// build-kimberley-map.mjs
// Run once:   node build-kimberley-map.mjs
// Needs Node 18 or newer (uses the built-in fetch). No npm packages required.
//
// What it does:
//  1. Downloads real roads, water, parks, built-up areas and suburb names for your
//     area from OpenStreetMap (free Overpass API).
//  2. Turns them into SVG path strings that fit your 900x560 map.
//  3. Asks the free OSRM server for the real road route for each tanker trip and
//     converts those to SVG paths too.
//  4. Writes kimberleyMap.json. Your app then draws everything itself, with no map
//     tiles and no network requests at runtime.
//
// Map data is (c) OpenStreetMap contributors (ODbL). Keep the credit on the map.

import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { MAP, TANKERS, makeProjection } from "./radarConfig.mjs";

const OVERPASS = "https://overpass-api.de/api/interpreter";
const OSRM = "https://router.project-osrm.org/route/v1/driving";
const UA = "AquaBophelo-map-builder/1.0 (student capstone project)";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- small helpers ---------- */
const r1 = (n) => Math.round(n * 10) / 10;

// Points -> compact SVG path text. Drops points closer than 0.4px to keep the file small.
export function toPath(points, close = false) {
  let out = "";
  let px = null, py = null;
  points.forEach(([x, y], i) => {
    x = r1(x); y = r1(y);
    if (i > 0 && Math.abs(x - px) < 0.4 && Math.abs(y - py) < 0.4) return;
    out += (i === 0 ? "M" : "L") + x + " " + y;
    px = x; py = y;
  });
  return out && close ? out + "Z" : out;
}

function overlapsMap(points, W, H, pad = 40) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return maxX > -pad && minX < W + pad && maxY > -pad && minY < H + pad;
}

const same = (a, b) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;

// Big lakes are stored as several pieces. This stitches the pieces into closed outlines.
export function joinRings(segments) {
  const pool = segments.filter((s) => s.length > 1).map((s) => s.slice());
  const rings = [];
  while (pool.length) {
    let ring = pool.pop();
    let grew = true;
    while (grew && !same(ring[0], ring[ring.length - 1])) {
      grew = false;
      for (let i = 0; i < pool.length; i++) {
        const s = pool[i];
        const head = ring[0], tail = ring[ring.length - 1];
        if (same(tail, s[0])) ring = ring.concat(s.slice(1));
        else if (same(tail, s[s.length - 1])) ring = ring.concat(s.slice(0, -1).reverse());
        else if (same(head, s[s.length - 1])) ring = s.slice(0, -1).concat(ring);
        else if (same(head, s[0])) ring = s.slice(1).reverse().concat(ring);
        else continue;
        pool.splice(i, 1);
        grew = true;
        break;
      }
    }
    rings.push(ring);
  }
  return rings;
}

// Decide which map layer an OpenStreetMap feature belongs to.
function classify(tags = {}) {
  if (tags.highway) {
    const h = tags.highway.replace("_link", "");
    if (["motorway", "trunk", "primary"].includes(h)) return ["line", "major"];
    if (["secondary", "tertiary"].includes(h)) return ["line", "medium"];
    if (["residential", "unclassified", "living_street"].includes(h)) return ["line", "minor"];
    return null;
  }
  if (tags.natural === "water" || tags.waterway === "riverbank") return ["area", "water"];
  if (["river", "canal"].includes(tags.waterway)) return ["line", "waterway"];
  if (["park", "pitch", "garden", "golf_course", "nature_reserve", "recreation_ground"].includes(tags.leisure)) return ["area", "parks"];
  if (["grass", "recreation_ground", "cemetery", "forest", "village_green"].includes(tags.landuse)) return ["area", "parks"];
  if (["residential", "commercial", "retail", "industrial"].includes(tags.landuse)) return ["area", "built"];
  return null;
}

/* ---------- turn Overpass elements into SVG layers ---------- */
export function buildLayers(elements, project, { W, H }) {
  const parts = { water: [], waterway: [], parks: [], built: [], minor: [], medium: [], major: [] };
  const places = [];
  const seen = new Set();
  const proj = (g) => project(g.lon, g.lat);

  for (const el of elements) {
    if (el.type === "node" && el.tags?.place && el.tags?.name) {
      if (!["suburb", "town", "city"].includes(el.tags.place)) continue;
      const [x, y] = project(el.lon, el.lat);
      if (x < 30 || x > W - 30 || y < 18 || y > H - 18 || seen.has(el.tags.name)) continue;
      seen.add(el.tags.name);
      places.push({ name: el.tags.name, x: r1(x), y: r1(y), kind: el.tags.place });
      continue;
    }

    const c = classify(el.tags);
    if (!c) continue;
    const [kind, layer] = c;

    if (el.type === "way" && el.geometry) {
      const pts = el.geometry.map(proj);
      if (!overlapsMap(pts, W, H)) continue;
      const d = toPath(pts, kind === "area");
      if (d) parts[layer].push(d);
    }

    if (el.type === "relation" && kind === "area" && el.members) {
      const outers = el.members
        .filter((m) => m.type === "way" && m.role === "outer" && m.geometry)
        .map((m) => m.geometry.map((g) => [g.lon, g.lat]));
      for (const ring of joinRings(outers)) {
        const pts = ring.map(([lng, lat]) => project(lng, lat));
        if (!overlapsMap(pts, W, H)) continue;
        const d = toPath(pts, true);
        if (d) parts[layer].push(d);
      }
    }
  }

  const layers = {};
  for (const [name, list] of Object.entries(parts)) layers[name] = list.join("");
  return { layers, places };
}

/* ---------- network steps ---------- */
function overpassQuery({ south, west, north, east }) {
  const b = `${south},${west},${north},${east}`;
  return `[out:json][timeout:90];
(
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street)(_link)?$"](${b});
  way["natural"="water"](${b});
  relation["natural"="water"](${b});
  way["waterway"~"^(river|canal|riverbank)$"](${b});
  way["leisure"~"^(park|pitch|garden|golf_course|nature_reserve|recreation_ground)$"](${b});
  way["landuse"~"^(grass|recreation_ground|cemetery|forest|village_green|residential|commercial|retail|industrial)$"](${b});
  node["place"~"^(suburb|town|city)$"](${b});
);
out geom;`;
}

async function fetchOverpass(bbox) {
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
    body: "data=" + encodeURIComponent(overpassQuery(bbox)),
  });
  if (!res.ok) throw new Error(`Overpass error ${res.status}. Wait a minute and run the script again.`);
  return (await res.json()).elements;
}

async function fetchRoute(from, to) {
  const url = `${OSRM}/${from.join(",")};${to.join(",")}?overview=full&geometries=geojson`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`OSRM error ${res.status}`);
  const json = await res.json();
  const coords = json.routes?.[0]?.geometry?.coordinates;
  if (!coords) throw new Error("No route found");
  return coords;
}

async function main() {
  const outFile = process.argv[2] || "kimberleyMap.json";
  const { project, bbox } = makeProjection(MAP);

  console.log("Downloading map data from OpenStreetMap (this can take up to a minute)...");
  const elements = await fetchOverpass(bbox);
  console.log(`Got ${elements.length} features.`);
  const { layers, places } = buildLayers(elements, project, MAP);

  const routes = {};
  for (const t of TANKERS) {
    let coords;
    try {
      console.log(`Routing ${t.id}: ${t.from.name} to ${t.to.name}`);
      coords = await fetchRoute(t.from.lngLat, t.to.lngLat);
    } catch (err) {
      console.warn(`  Could not route ${t.id} (${err.message}). Using a straight line.`);
      coords = [t.from.lngLat, t.to.lngLat];
    }
    routes[t.id] = toPath(coords.map(([lng, lat]) => project(lng, lat)));
    await wait(1200); // OSRM demo server allows about 1 request per second
  }

  const out = {
    generated: new Date().toISOString(),
    attribution: "\u00a9 OpenStreetMap contributors",
    W: MAP.W,
    H: MAP.H,
    layers,
    places,
    routes,
  };
  await writeFile(outFile, JSON.stringify(out));
  const kb = Math.round(JSON.stringify(out).length / 1024);
  console.log(`Done. Wrote ${outFile} (${kb} KB) with ${places.length} place labels.`);
  if (kb > 900) console.log("Tip: the file is large. Remove 'residential' from the roads in classify() for a lighter map.");
}

// Only run when called directly (so the functions above can be tested on their own).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
