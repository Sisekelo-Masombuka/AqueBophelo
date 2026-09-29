// SvgTankerMap.jsx
// A map drawn by YOU: real Kimberley roads and water (from OpenStreetMap) rendered as SVG,
// with animated tankers. No map tiles, no API keys, no network requests at runtime.
//
// Setup:
//   1. Put radarConfig.mjs, build-kimberley-map.mjs and this file in your project (e.g. src/radar/).
//   2. Edit radarConfig.mjs with your real depots, zones and tankers.
//   3. Run once:  node build-kimberley-map.mjs      (creates kimberleyMap.json next to it)
//   4. Use:       <SvgTankerMap />
//
// Real GPS later: pass  positions={{ "NC-542-KM": { lng, lat, heading } }}  and the trucks
// will jump to those real positions instead of simulating (see "live mode" below).

import { memo, useEffect, useRef, useState } from "react";
import mapData from "./kimberleyMap.json";
import { MAP, TANKERS, ZONES, FACILITIES, makeProjection } from "./radarConfig.mjs";

const { project, k } = makeProjection(MAP);
const METRES_PER_DEG = 111320;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/* ---------- the drawn map (memoised so it never redraws while trucks move) ---------- */
const BaseMap = memo(function BaseMap() {
  const L = mapData.layers;
  const edge = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" };
  return (
    <g>
      <rect className="stm-land" width={MAP.W} height={MAP.H} />
      {L.built && <path className="stm-built" d={L.built} />}
      {L.parks && <path className="stm-parks" d={L.parks} />}
      {L.water && <path className="stm-water" d={L.water} />}
      {L.waterway && <path className="stm-waterway" d={L.waterway} {...edge} />}
      <defs>
        <path id="stm-minor" d={L.minor} {...edge} />
        <path id="stm-medium" d={L.medium} {...edge} />
        <path id="stm-major" d={L.major} {...edge} />
      </defs>
      <use href="#stm-minor" className="stm-minor-edge" />
      <use href="#stm-minor" className="stm-minor" />
      <use href="#stm-medium" className="stm-medium-edge" />
      <use href="#stm-medium" className="stm-medium" />
      <use href="#stm-major" className="stm-major-edge" />
      <use href="#stm-major" className="stm-major" />
    </g>
  );
});

export default function SvgTankerMap({ tankers = TANKERS, zones = ZONES, facilities = FACILITIES, positions }) {
  const svgRef = useRef(null);
  const els = useRef({});                                  // id -> { trail, done, g, rot, text, rect }
  const sim = useRef({});                                  // id -> runtime state
  const view = useRef({ x: 0, y: 0, w: MAP.W, h: MAP.H });
  const zoomRef = useRef(1);
  const pausedRef = useRef(false);
  const multRef = useRef(1);
  const selectedRef = useRef(tankers[0].id);
  const positionsRef = useRef(positions);
  const drag = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(tankers[0].id);
  const [paused, setPaused] = useState(false);
  const [mult, setMult] = useState(1);
  const [rows, setRows] = useState({});

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { multRef.current = mult; }, [mult]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);

  /* ---------- pan and zoom (we just change the SVG viewBox) ---------- */
  function applyView() {
    const v = view.current;
    svgRef.current?.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`);
  }
  function zoomTo(nz) {
    const v = view.current;
    const cx = v.x + v.w / 2, cy = v.y + v.h / 2;
    nz = clamp(nz, 1, 6);
    v.w = MAP.W / nz; v.h = MAP.H / nz;
    v.x = clamp(cx - v.w / 2, 0, MAP.W - v.w);
    v.y = clamp(cy - v.h / 2, 0, MAP.H - v.h);
    zoomRef.current = nz;
    setZoom(nz);
    applyView();
  }
  function onPointerDown(e) {
    drag.current = { id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!drag.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const v = view.current;
    const scale = Math.max(rect.width / v.w, rect.height / v.h);   // matches preserveAspectRatio "slice"
    v.x = clamp(v.x - e.movementX / scale, 0, MAP.W - v.w);
    v.y = clamp(v.y - e.movementY / scale, 0, MAP.H - v.h);
    applyView();
  }
  function onPointerUp() { drag.current = null; }

  function select(id) { setSelected(id); selectedRef.current = id; }

  /* ---------- the simulation loop ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);

    // Measure each route once, and remember 200 points along it for live mode.
    tankers.forEach((t) => {
      const e = els.current[t.id];
      if (!e?.trail) return;
      const len = e.trail.getTotalLength();
      const samples = Array.from({ length: 201 }, (_, i) => e.trail.getPointAtLength((i / 200) * len));
      sim.current[t.id] = { len, samples, p: t.start, hold: 0, heading: 0, label: "" };
    });

    let raf = 0, last = performance.now(), acc = 0;
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const inv = 1 / zoomRef.current;
      const next = {};

      for (const t of tankers) {
        const s = sim.current[t.id], e = els.current[t.id];
        if (!s || !e) continue;
        const live = positionsRef.current?.[t.id];
        let x, y;

        if (live) {
          /* LIVE MODE: use the real GPS position. Progress = nearest point on the route. */
          [x, y] = project(live.lng, live.lat);
          let best = 0, bestD = Infinity;
          s.samples.forEach((pt, i) => {
            const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
            if (d < bestD) { bestD = d; best = i; }
          });
          s.p = best / 200;
          if (live.heading != null) s.heading = live.heading;
        } else {
          /* SIMULATION: 1) grow progress by elapsed time, 2) ask the SVG path where that is. */
          if (!pausedRef.current) {
            if (s.p >= 1) { s.hold += dt; if (s.hold > 3.5) { s.p = 0; s.hold = 0; } }
            else s.p = Math.min(1, s.p + (dt * multRef.current) / t.secs);
          }
          const at = s.p * s.len;
          const a = e.trail.getPointAtLength(at);
          const b = e.trail.getPointAtLength(Math.min(s.len, at + 3));
          x = a.x; y = a.y;
          // 3) heading = angle from this point to a point just ahead
          if (s.p < 0.995) s.heading = (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
        }

        e.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${inv})`);
        e.rot.setAttribute("transform", `rotate(${s.heading.toFixed(1)})`);
        // 4) the "travelled" line is the same path, dashed to the distance covered
        e.done.setAttribute("stroke-dasharray", `${(s.p * s.len).toFixed(1)} ${s.len.toFixed(1)}`);

        const left = Math.max(0, Math.ceil((1 - s.p) * t.minutes));
        const delivering = s.p >= 1;
        const label = `${t.id} \u00b7 ${delivering ? "delivering" : left + " min"}`;
        if (label !== s.label) {                       // resize the label box only when its text changes
          s.label = label;
          e.text.textContent = label;
          const w = e.text.getComputedTextLength();
          e.rect.setAttribute("x", -(w / 2 + 9));
          e.rect.setAttribute("width", w + 18);
        }
        next[t.id] = { p: s.p, left, delivering };
      }

      acc += dt;
      if (acc > 0.2) { acc = 0; setRows(next); }       // update the side list ~5 times a second
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inv = 1 / zoom;
  const ordered = [...tankers].sort((a, b) => (a.id === selected) - (b.id === selected)); // selected on top
  const routeFor = (t) => {
    if (mapData.routes?.[t.id]) return mapData.routes[t.id];
    const [x1, y1] = project(...t.from.lngLat), [x2, y2] = project(...t.to.lngLat);
    return `M${x1} ${y1}L${x2} ${y2}`;                 // fallback if the builder had no route
  };

  return (
    <section className="stm">
      <style>{CSS}</style>
      <div className="stm-map">
        <svg
          ref={svgRef}
          className="stm-svg"
          viewBox={`0 0 ${MAP.W} ${MAP.H}`}
          preserveAspectRatio="xMidYMid slice"
          role="group"
          aria-label="Map of active water tankers in Kimberley"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <BaseMap />

          {zones.map((z) => {
            const [cx, cy] = project(...z.center);
            return <circle key={z.name} className={z.status === "watch" ? "stm-zone-w" : "stm-zone-h"} cx={cx} cy={cy} r={(z.radius / METRES_PER_DEG) * k} />;
          })}

          {(mapData.places || []).map((p) => (
            <text key={p.name} className="stm-place" transform={`translate(${p.x} ${p.y}) scale(${inv})`} textAnchor="middle">{p.name}</text>
          ))}

          {facilities.map((f) => {
            const [x, y] = project(...f.lngLat);
            return (
              <g key={f.id} transform={`translate(${x} ${y}) scale(${inv})`}>
                {f.kind === "reservoir" ? (
                  <>
                    <rect x="-11" y="-11" width="22" height="22" rx="3" className="stm-fac" />
                    <path d="M0 -5 C0 -5 -5 1 -5 3.5 a5 5 0 0 0 10 0 C5 1 0 -5 0 -5Z" fill="#fff" />
                  </>
                ) : (
                  <circle r="6" className="stm-depot" />
                )}
                <text className="stm-fac-label" x="14" y="-8">{f.name}</text>
              </g>
            );
          })}

          {tankers.map((t) => (
            <g key={`trail-${t.id}`}>
              <path ref={(n) => { (els.current[t.id] ||= {}).trail = n; }} d={routeFor(t)} className="stm-trail" vectorEffect="non-scaling-stroke" />
              <path ref={(n) => { (els.current[t.id] ||= {}).done = n; }} d={routeFor(t)} className="stm-done" vectorEffect="non-scaling-stroke" />
            </g>
          ))}

          {ordered.map((t) => (
            <g
              key={t.id}
              ref={(n) => { (els.current[t.id] ||= {}).g = n; }}
              className={"stm-tk" + (selected === t.id ? " sel" : "")}
              tabIndex={0}
              role="button"
              aria-label={`Tanker ${t.id}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => select(t.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(t.id); } }}
            >
              <g ref={(n) => { (els.current[t.id] ||= {}).rot = n; }}>
                <circle className="stm-ring" r="15" />
                <path className="stm-arrow" d="M0 -8 L7 7 L0 3.5 L-7 7Z" />
              </g>
              <g className="stm-chip" transform="translate(0 -32)">
                <rect ref={(n) => { (els.current[t.id] ||= {}).rect = n; }} x="-62" y="-12" width="124" height="24" rx="3" />
                <text ref={(n) => { (els.current[t.id] ||= {}).text = n; }} textAnchor="middle" y="4.5" />
              </g>
            </g>
          ))}
        </svg>

        <div className="stm-tools">
          <span className="stm-ui">{tankers.length} tankers on map</span>
          <button type="button" className="stm-ui stm-btn" onClick={() => setPaused((p) => !p)}>{paused ? "Play" : "Pause"}</button>
          <button type="button" className="stm-ui stm-btn" onClick={() => setMult((m) => (m === 1 ? 4 : 1))}>Speed {mult}x</button>
        </div>
        <div className="stm-zoom">
          <button type="button" aria-label="Zoom in" onClick={() => zoomTo(zoomRef.current * 1.6)}>+</button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomTo(zoomRef.current / 1.6)}>{"\u2212"}</button>
          <button type="button" aria-label="Reset view" onClick={() => zoomTo(1)}>{"\u2302"}</button>
        </div>
        <div className="stm-legend">
          <div><i className="k-tk" />Tanker (selected is green)</div>
          <div><i className="k-h" />Area healthy</div>
          <div><i className="k-w" />Area on watch</div>
        </div>
        <div className="stm-credit">{mapData.attribution}</div>
      </div>

      <ul className="stm-list" aria-live="polite">
        {tankers.map((t) => {
          const r = rows[t.id] || { p: t.start, left: t.minutes, delivering: false };
          const on = selected === t.id;
          return (
            <li key={t.id}>
              <button type="button" className="stm-row" aria-current={on} onClick={() => select(t.id)}>
                <span className="stm-r1">
                  <strong className="stm-plate">{t.id}</strong>
                  <span className={"stm-tag" + (r.delivering ? " hold" : "")}>{r.delivering ? "Delivering" : "En route"}</span>
                </span>
                <span className="stm-route">{t.from.name} to {t.to.name}</span>
                <span className="stm-bar"><span style={{ width: `${(r.p * 100).toFixed(1)}%` }} /></span>
                <span className="stm-r2"><span>Arrives in <b>{r.delivering ? "now" : `${r.left} min`}</b></span><span>{Math.round(r.p * 100)}% of route</span></span>
                {on && <span className="stm-extra">Driver: <b>{t.driver}</b>, rated <b>{t.rating} out of 5</b></span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const CSS = `
.stm{
  --land:#eef0ed;--water:#b9d5e8;--park:#d9e8d0;--built:#e6e8e6;--road:#fff;--road-edge:#d3d9de;
  --major:#f5dca6;--major-edge:#dcbf82;--label:#6c7883;
  --surface:#fff;--band:#f1f3f5;--text:#1c2733;--muted:#55636f;--border:#c8d0d8;
  --navy:#14305a;--green:#2c7a31;--green-bg:#e6f2e6;--amber:#965400;--amber-bg:#fbeccf;--focus:#b86e00;
  display:grid;grid-template-columns:1fr 330px;border:1px solid var(--border);background:var(--surface);
  font-family:"Source Sans 3","Segoe UI",Arial,sans-serif;color:var(--text)
}
@media (prefers-color-scheme:dark){.stm{
  --land:#1a232b;--water:#20384c;--park:#1e3024;--built:#212c35;--road:#2b3743;--road-edge:#10171d;
  --major:#4a4230;--major-edge:#2b261b;--label:#8c9aa8;
  --surface:#18232f;--band:#141d27;--text:#e5eaf0;--muted:#9aa8b6;--border:#2d3b4a;
  --navy:#7fb4e6;--green:#6cc271;--green-bg:#17301a;--amber:#e9a64b;--amber-bg:#33260f;--focus:#f0b45a}}
.stm *{box-sizing:border-box}
.stm-map{position:relative;min-height:460px;border-right:1px solid var(--border);background:var(--land);overflow:hidden}
.stm-svg{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;display:block}
.stm-svg:active{cursor:grabbing}
.stm-land{fill:var(--land)}.stm-built{fill:var(--built)}.stm-parks{fill:var(--park)}.stm-water{fill:var(--water)}
.stm-waterway{stroke:var(--water);stroke-width:3}
.stm-minor-edge{stroke:var(--road-edge);stroke-width:3.4}.stm-minor{stroke:var(--road);stroke-width:2.2}
.stm-medium-edge{stroke:var(--road-edge);stroke-width:5.4}.stm-medium{stroke:var(--road);stroke-width:3.8}
.stm-major-edge{stroke:var(--major-edge);stroke-width:8}.stm-major{stroke:var(--major);stroke-width:6}
.stm-zone-h{fill:var(--green);fill-opacity:.11;stroke:var(--green);stroke-width:1.6;stroke-dasharray:5 4}
.stm-zone-w{fill:var(--amber);fill-opacity:.14;stroke:var(--amber);stroke-width:1.6;stroke-dasharray:5 4}
.stm-place{font-family:"Source Serif 4",Georgia,serif;font-style:italic;font-size:14px;fill:var(--label);paint-order:stroke;stroke:var(--land);stroke-width:3px;stroke-linejoin:round;pointer-events:none}
.stm-fac{fill:#14305a;stroke:#fff;stroke-width:3}
.stm-depot{fill:var(--amber);stroke:#fff;stroke-width:2.5}
.stm-fac-label{font-weight:700;font-size:11.5px;fill:var(--text);paint-order:stroke;stroke:var(--land);stroke-width:3px;pointer-events:none}
.stm-trail{fill:none;stroke:var(--navy);stroke-opacity:.4;stroke-width:3;stroke-dasharray:2 7;stroke-linecap:round}
.stm-done{fill:none;stroke:var(--navy);stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round}
.stm-tk{cursor:pointer}
.stm-ring{fill:var(--navy);stroke:#fff;stroke-width:3}
.stm-tk.sel .stm-ring{fill:var(--green)}
.stm-arrow{fill:#fff}
.stm-tk:focus{outline:none}.stm-tk:focus-visible .stm-ring{stroke:var(--focus);stroke-width:4}
.stm-chip rect{fill:#fff;stroke:#14305a;stroke-width:1.5}
.stm-chip text{font-weight:700;font-size:12.5px;fill:#14305a;font-variant-numeric:tabular-nums}
.stm-tk.sel .stm-chip rect{fill:#14305a}.stm-tk.sel .stm-chip text{fill:#fff}
.stm-tools{position:absolute;top:12px;left:12px;display:flex;gap:8px;flex-wrap:wrap}
.stm-ui{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:6px 12px;font:600 15px "Source Sans 3","Segoe UI",Arial,sans-serif;color:var(--text)}
.stm-btn{cursor:pointer}.stm-btn:hover{background:var(--band)}
.stm-btn:focus-visible,.stm-zoom button:focus-visible,.stm-row:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.stm-zoom{position:absolute;top:12px;right:12px;display:grid;border:1px solid var(--border);border-radius:3px;overflow:hidden}
.stm-zoom button{width:34px;height:34px;border:0;border-bottom:1px solid var(--border);background:var(--surface);color:var(--text);font-size:20px;line-height:1;cursor:pointer}
.stm-zoom button:last-child{border-bottom:0}.stm-zoom button:hover{background:var(--band)}
.stm-legend{position:absolute;left:12px;bottom:12px;background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:10px 14px;font-size:14px;color:var(--muted);display:grid;gap:6px}
.stm-legend div{display:flex;align-items:center;gap:8px}.stm-legend i{display:inline-block;width:14px;height:14px}
.k-tk{background:var(--navy);border-radius:50%}
.k-h{background:color-mix(in srgb,var(--green) 35%,transparent);border:1.5px dashed var(--green)}
.k-w{background:color-mix(in srgb,var(--amber) 35%,transparent);border:1.5px dashed var(--amber)}
.stm-credit{position:absolute;right:12px;bottom:12px;font-size:12px;color:var(--muted);background:var(--surface);padding:2px 8px;border:1px solid var(--border);border-radius:3px}
.stm-list{list-style:none;margin:0;padding:0;overflow:auto}
.stm-list li{border-bottom:1px solid var(--border)}
.stm-row{all:unset;box-sizing:border-box;display:block;width:100%;padding:16px 18px 16px 16px;border-left:5px solid transparent;cursor:pointer}
.stm-row:hover{background:var(--band)}
.stm-row[aria-current="true"]{border-left-color:var(--navy);background:var(--band)}
.stm-r1{display:flex;justify-content:space-between;align-items:center;gap:10px}
.stm-plate{font-size:18px;font-variant-numeric:tabular-nums}
.stm-tag{font-size:14px;font-weight:700;padding:2px 10px;border-radius:2px;color:var(--green);background:var(--green-bg)}
.stm-tag.hold{color:var(--amber);background:var(--amber-bg)}
.stm-route{display:block;color:var(--muted);font-size:15px;margin:2px 0 8px}
.stm-bar{display:block;height:6px;background:var(--border);overflow:hidden}
.stm-bar>span{display:block;height:100%;background:var(--navy)}
.stm-r2{display:flex;justify-content:space-between;font-size:15px;margin-top:8px;color:var(--muted)}
.stm-r2 b,.stm-extra b{color:var(--text)}
.stm-extra{display:block;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:15px;color:var(--muted)}
@media(max-width:860px){.stm{grid-template-columns:1fr}.stm-map{border-right:0;border-bottom:1px solid var(--border)}}
`;
