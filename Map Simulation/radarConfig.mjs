// radarConfig.mjs
// One place for everything about your map. Used by BOTH the build script
// (build-kimberley-map.mjs) and the React component (SvgTankerMap.jsx).
//
// All coordinates are [longitude, latitude]. The ones below are APPROXIMATE.
// Replace them with your real depots, zones and tankers.

// The area the map covers. spanLng = how many degrees of longitude fit across the map.
// Bigger number = zoomed further out. 0.24 is roughly 23 km wide.
export const MAP = { center: [24.76, -28.73], spanLng: 0.24, W: 900, H: 560 };

export const FACILITIES = [
  { id: "newton", name: "Newton reservoir", lngLat: [24.7712, -28.7033], kind: "reservoir" },
  { id: "riverton", name: "Riverton works", lngLat: [24.8102, -28.6788], kind: "reservoir" },
  { id: "roodepan", name: "Roodepan depot", lngLat: [24.7255, -28.6905], kind: "depot" },
];

// Coloured circles showing area health. radius is in metres.
export const ZONES = [
  { name: "Galeshewe zone 3", center: [24.7352, -28.7385], radius: 1400, status: "healthy" },
  { name: "Roodepan depot area", center: [24.7255, -28.6905], radius: 1500, status: "watch" },
  { name: "Kimberley CBD", center: [24.7637, -28.7282], radius: 1300, status: "healthy" },
];

// secs = how long the demo trip takes on screen. minutes = the ETA shown to residents.
export const TANKERS = [
  { id: "NC-542-KM", from: { name: "Newton reservoir", lngLat: [24.7712, -28.7033] }, to: { name: "Galeshewe zone 3", lngLat: [24.7352, -28.7385] }, minutes: 18, secs: 56, start: 0.38, driver: "Sample driver", rating: 4.8 },
  { id: "NC-118-KM", from: { name: "Newton reservoir", lngLat: [24.7712, -28.7033] }, to: { name: "Roodepan depot", lngLat: [24.7255, -28.6905] }, minutes: 24, secs: 66, start: 0.18, driver: "Sample driver", rating: 4.5 },
  { id: "NC-907-KM", from: { name: "Riverton works", lngLat: [24.8102, -28.6788] }, to: { name: "Kimberley CBD", lngLat: [24.7637, -28.7282] }, minutes: 21, secs: 60, start: 0.62, driver: "Sample driver", rating: 4.7 },
];

// Turns longitude/latitude into x/y positions on the 900x560 map.
// Small-area projection: fine for a city, and keeps circles round.
export function makeProjection({ center, spanLng, W, H }) {
  const [lng0, lat0] = center;
  const cos = Math.cos((lat0 * Math.PI) / 180);
  const k = W / (spanLng * cos); // pixels per degree of latitude
  const project = (lng, lat) => [W / 2 + (lng - lng0) * cos * k, H / 2 - (lat - lat0) * k];
  const bbox = {
    west: lng0 - spanLng / 2,
    east: lng0 + spanLng / 2,
    south: lat0 - H / 2 / k,
    north: lat0 + H / 2 / k,
  };
  return { project, bbox, k };
}
