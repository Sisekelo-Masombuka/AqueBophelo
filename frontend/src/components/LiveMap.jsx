import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { 
  Truck, MapPin, Droplet, ZoomIn, ZoomOut, RotateCcw, Sun, Moon, X, 
  Star, AlertTriangle, CheckCircle2, PhoneCall, Clock, ShieldCheck, Check, Info
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import mapData from './kimberleyMap.json';

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5094';
const MAP_CONFIG = { center: [24.76, -28.73], spanLng: 0.24, W: 900, H: 560 };
const MAX_ZOOM = 5;
const PAD = 90;
const THEME_KEY = 'aquabophelo-map-theme';

function makeProjection({ center, spanLng, W, H }) {
  const [lng0, lat0] = center;
  const cos = Math.cos((lat0 * Math.PI) / 180);
  const k = W / (spanLng * cos);
  const project = (lng, lat) => [W / 2 + (lng - lng0) * cos * k, H / 2 - (lat - lat0) * k];
  return { project, k };
}
const { project } = makeProjection(MAP_CONFIG);
const clamp = (n, lo, hi) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, n)));

/* ------------------------------------------------------------------ */
/*  Default Data & Helper Functions                                    */
/* ------------------------------------------------------------------ */
const DEFAULT_FACILITIES = [
  { id: 'newton', name: 'Newton Reservoir', lngLat: [24.7712, -28.7033], level: 62.5, capacity: '92.5 ML', kind: 'reservoir' },
  { id: 'riverton', name: 'Riverton Water Works', lngLat: [24.8102, -28.6788], level: 82.0, capacity: '150.0 ML', kind: 'reservoir' },
  { id: 'roodepan', name: 'Roodepan Depot', lngLat: [24.7255, -28.6905], level: 90.0, capacity: '45.0 ML', kind: 'depot' },
];

const DEFAULT_DELIVERY_STOPS = [
  { id: 101, sequence: 1, name: 'Galeshewe Police Station Water Point', lngLat: [24.7319, -28.7183], area: 'Galeshewe Zone 3', status: 'Completed', volume: '3,500 L' },
  { id: 102, sequence: 2, name: 'Tshwarelela Primary Drop Point', lngLat: [24.7291, -28.7125], area: 'Galeshewe Zone 3', status: 'In Delivery', volume: '2,500 L' },
  { id: 103, sequence: 3, name: 'Mayibuye Community Centre', lngLat: [24.7245, -28.7098], area: 'Galeshewe Zone 3', status: 'Pending', volume: '3,000 L' },
  { id: 201, sequence: 4, name: 'Sol Plaatje Civic Centre Reservoir', lngLat: [24.7719, -28.7419], area: 'Kimberley Central', status: 'Pending', volume: '5,000 L' },
  { id: 202, sequence: 5, name: 'Kimberley Hospital Water Reserve', lngLat: [24.7645, -28.7388], area: 'Kimberley Central', status: 'Pending', volume: '4,000 L' },
];

const DEFAULT_TANKERS = [
  { id: '542-KM NC', registrationNumber: '542-KM NC', driverName: 'Sipho Dlamini', driverRating: 4.8, completedTripsCount: 124, capacityLitres: 10000, status: 'OnTrip',
    from: { name: 'Newton Reservoir', lngLat: [24.7712, -28.7033] }, to: { name: 'Galeshewe Zone 3', lngLat: [24.7319, -28.7183] },
    speedKmh: 38, minutes: 14, secs: 50, start: 0.45 },
  { id: '882-KM NC', registrationNumber: '882-KM NC', driverName: 'Lerato Motsepe', driverRating: 4.9, completedTripsCount: 96, capacityLitres: 15000, status: 'OnTrip',
    from: { name: 'Newton Reservoir', lngLat: [24.7712, -28.7033] }, to: { name: 'Roodepan Depot', lngLat: [24.7088, -28.6921] },
    speedKmh: 42, minutes: 24, secs: 65, start: 0.25 },
  { id: '104-KM NC', registrationNumber: '104-KM NC', driverName: 'Tshepo Khumalo', driverRating: 4.7, completedTripsCount: 8, capacityLitres: 10000, status: 'Available',
    from: { name: 'Riverton Water Works', lngLat: [24.8102, -28.6788] }, to: { name: 'Kimberley Central CBD', lngLat: [24.7719, -28.7419] },
    speedKmh: 0, minutes: 0, secs: 60, start: 0.95 },
];

const regOf = (t) => t.registrationNumber || t.id;

function formatFirstName(fullName = '') {
  if (!fullName) return 'Sipho';
  return fullName.trim().split(/\s+/)[0];
}

function formatDriverRating(rating, count) {
  if (!count || count < 5) return 'New Driver';
  return `${rating?.toFixed(1) || '4.8'} ★ (${count} deliveries)`;
}

function getPlainStatus(status, progress = 0) {
  if (status === 'Completed') return 'Completed';
  if (status === 'In Delivery' || status === 'Delivering') return 'Delivering';
  if (status === 'OnTrip' || status === 'On the way') {
    if (progress >= 0.96) return 'Arrived';
    if (progress > 0) return 'On the way';
    return 'On the way';
  }
  return 'Standby';
}

/* ------------------------------------------------------------------ */
/*  Routes & Offline Road Graph                                        */
/* ------------------------------------------------------------------ */
const normPlate = (s = '') => String(s).toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean).sort().join('-');
const r1 = (n) => Math.round(n * 10) / 10;
const toPath = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join('');
const straightPath = (from, to) => toPath([project(...from), project(...to)]);

function prebuiltRoute(reg, from, to) {
  const key = Object.keys(mapData.routes || {}).find((k) => normPlate(k) === normPlate(reg));
  if (!key) return null;
  const d = mapData.routes[key];
  const n = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => +m[0]);
  if (n.length < 4) return null;
  const [fx, fy] = project(...from);
  const [tx, ty] = project(...to);
  const ok = Math.hypot(n[0] - fx, n[1] - fy) < 14 && Math.hypot(n[n.length - 2] - tx, n[n.length - 1] - ty) < 14;
  return ok ? d : null;
}

let roadGraph;
function getRoadGraph() {
  if (roadGraph) return roadGraph;
  const L = mapData.layers || {};
  const cost = { minor: 1.0, medium: 0.9, major: 0.8 };
  const nodes = [], adj = [], grid = new Map();

  const nodeFor = (x, y) => {
    const cx = Math.floor(x), cy = Math.floor(y);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const list = grid.get(`${cx + dx},${cy + dy}`);
      if (list) for (const id of list) if (Math.hypot(nodes[id][0] - x, nodes[id][1] - y) < 0.6) return id;
    }
    const id = nodes.length;
    nodes.push([x, y]); adj.push([]);
    const key = `${cx},${cy}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(id);
    return id;
  };

  for (const [layer, factor] of Object.entries(cost)) {
    if (!L[layer]) continue;
    for (const way of L[layer].split('M')) {
      if (!way) continue;
      let prev = -1;
      for (const pair of way.split('L')) {
        const [xs, ys] = pair.trim().split(/\s+/);
        const x = +xs, y = +ys;
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        const id = nodeFor(x, y);
        if (prev >= 0 && prev !== id) {
          const w = Math.hypot(nodes[id][0] - nodes[prev][0], nodes[id][1] - nodes[prev][1]) * factor;
          adj[prev].push([id, w]); adj[id].push([prev, w]);
        }
        prev = id;
      }
    }
  }

  const comp = new Int32Array(nodes.length).fill(-1);
  const sizes = [];
  for (let s = 0; s < nodes.length; s++) {
    if (comp[s] !== -1) continue;
    const id = sizes.length; let count = 0; const stack = [s]; comp[s] = id;
    while (stack.length) {
      const n = stack.pop(); count++;
      for (const [m] of adj[n]) if (comp[m] === -1) { comp[m] = id; stack.push(m); }
    }
    sizes.push(count);
  }
  const main = sizes.indexOf(Math.max(...sizes));
  roadGraph = { nodes, adj, comp, main };
  return roadGraph;
}

function nearestRoadNode(g, [x, y]) {
  let best = -1, bestD = Infinity;
  for (let i = 0; i < g.nodes.length; i++) {
    if (g.comp[i] !== g.main) continue;
    const d = (g.nodes[i][0] - x) ** 2 + (g.nodes[i][1] - y) ** 2;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

function roadRoute(from, to) {
  const g = getRoadGraph();
  if (!g.nodes.length) return null;
  const a = project(...from), b = project(...to);
  const start = nearestRoadNode(g, a), goal = nearestRoadNode(g, b);
  if (start < 0 || goal < 0) return null;

  const dist = new Float64Array(g.nodes.length).fill(Infinity);
  const prev = new Int32Array(g.nodes.length).fill(-1);
  const h = (i) => Math.hypot(g.nodes[i][0] - g.nodes[goal][0], g.nodes[i][1] - g.nodes[goal][1]) * 0.8;
  const heap = [[h(start), start]];
  dist[start] = 0;
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
      }
    }
    return top;
  };

  while (heap.length) {
    const [, n] = pop();
    if (n === goal) break;
    for (const [m, w] of g.adj[n]) {
      const nd = dist[n] + w;
      if (nd < dist[m]) { dist[m] = nd; prev[m] = n; push([nd + h(m), m]); }
    }
  }
  if (dist[goal] === Infinity) return null;

  const pts = [];
  for (let n = goal; n !== -1; n = prev[n]) pts.push(g.nodes[n]);
  pts.reverse();
  return toPath([a, ...pts, b]);
}

function resolveRoute(reg, from, to) {
  const stored = prebuiltRoute(reg, from, to);
  if (stored) return stored;
  try { return roadRoute(from, to) || straightPath(from, to); } catch { return straightPath(from, to); }
}

/* ------------------------------------------------------------------ */
/*  Theme Hook                                                         */
/* ------------------------------------------------------------------ */
function readSiteTheme() {
  if (typeof document === 'undefined') return 'light';
  const el = document.documentElement;
  return el.classList.contains('dark') || el.dataset.theme === 'dark' ? 'dark' : 'light';
}
function useMapTheme(forced) {
  const [override, setOverride] = useState(() => {
    try { const v = localStorage.getItem(THEME_KEY); return v === 'dark' || v === 'light' ? v : null; } catch { return null; }
  });
  const [site, setSite] = useState(readSiteTheme);
  useEffect(() => {
    const mo = new MutationObserver(() => setSite(readSiteTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => mo.disconnect();
  }, []);
  const theme = forced || override || site;
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  };
  return [theme, toggle];
}

/* ------------------------------------------------------------------ */
/*  Label Decluttering                                                 */
/* ------------------------------------------------------------------ */
const LABEL_FONT = 'italic 500 11px Lora, Georgia, serif';
const UI_FONT = '600 11px system-ui, sans-serif';
let measureCtx;
function textWidth(text, font) {
  if (typeof document === 'undefined') return text.length * 6;
  measureCtx ||= document.createElement('canvas').getContext('2d');
  if (!measureCtx) return text.length * 6;
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
}
const PLACE_PRIORITY = ['Kimberley', 'Galeshewe', 'Roodepan', 'Kimberley North', 'Homevale', 'Vergenoeg', 'De Beers', 'Belgravia',
  'Beaconsfield', 'Kirstenhof', 'Greenside', 'Southridge', 'Kenilworth', 'Colville', 'Verwoerd Park', 'Kanfers Dam'];
const rankOf = (name) => { const i = PLACE_PRIORITY.indexOf(name); return i === -1 ? 100 : i; };
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function layoutLabels(places, u, obstacles) {
  const placed = [...obstacles];
  const shown = new Set();
  [...places].sort((a, b) => rankOf(a.name) - rankOf(b.name)).forEach((p) => {
    const w = textWidth(p.name, LABEL_FONT) + 10, h = 16;
    const box = { x: p.x * u - w / 2, y: p.y * u - h / 2, w, h };
    if (!placed.some((o) => hit(o, box))) { placed.push(box); shown.add(p.name); }
  });
  return shown;
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */
const BaseMap = memo(function BaseMap() {
  const L = mapData.layers || {};
  const edge = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' };
  return (
    <g>
      <rect className="lm-land" x={-PAD * 2} y={-PAD * 2} width={MAP_CONFIG.W + PAD * 4} height={MAP_CONFIG.H + PAD * 4} />
      {L.built && <path className="lm-built" d={L.built} />}
      {L.parks && <path className="lm-parks" d={L.parks} />}
      {L.water && <path className="lm-water" d={L.water} />}
      {L.waterway && <path className="lm-waterway" d={L.waterway} {...edge} />}
      <defs>
        <path id="lm-minor" d={L.minor || ''} {...edge} />
        <path id="lm-medium" d={L.medium || ''} {...edge} />
        <path id="lm-major" d={L.major || ''} {...edge} />
      </defs>
      <use href="#lm-minor" className="lm-minor-edge" />
      <use href="#lm-minor" className="lm-minor" />
      <use href="#lm-medium" className="lm-medium-edge" />
      <use href="#lm-medium" className="lm-medium" />
      <use href="#lm-major" className="lm-major-edge" />
      <use href="#lm-major" className="lm-major" />
    </g>
  );
});

const TruckIcon = memo(function TruckIcon() {
  return (
    <g transform="scale(0.86)">
      <ellipse cx="0" cy="2" rx="8.5" ry="15" fill="#000" opacity="0.16" />
      <rect x="-7" y="-13.5" width="14" height="28" rx="5.5" fill="#fff" />
      <rect x="-5.2" y="-5" width="10.4" height="18.5" rx="4" fill="url(#lm-tank)" stroke="#0f223d" strokeWidth="0.8" />
      <line x1="-4" y1="4" x2="4" y2="4" stroke="#0f223d" strokeWidth="1" opacity="0.35" />
      <line x1="-4" y1="10" x2="4" y2="10" stroke="#0f223d" strokeWidth="1" opacity="0.35" />
      <path d="M0 5.2 c1.5 1.9 2.3 3 2.3 4.1 a2.3 2.3 0 0 1 -4.6 0 c0 -1.1 0.8 -2.2 2.3 -4.1Z" fill="#fff" />
      <rect x="-5.2" y="-12" width="10.4" height="8.4" rx="2.6" fill="#152e52" stroke="#0a182c" strokeWidth="0.8" />
      <rect x="-3.7" y="-10.8" width="7.4" height="3" rx="1" fill="#bfe3f5" />
      <path className="lm-chev" d="M0 -19.5 L3.6 -14.8 L-3.6 -14.8Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
});

function FacilityMarker({ f, x, y, scale, compact, onPick }) {
  const textRef = useRef(null);
  const rectRef = useRef(null);
  const measure = useCallback(() => {
    if (textRef.current && rectRef.current) rectRef.current.setAttribute('width', textRef.current.getComputedTextLength() + 16);
  }, []);
  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
  }, [measure, f.name, f.level, compact]);
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      className="lm-fac-g"
      tabIndex={0}
      role="button"
      aria-label={`${f.name}, ${f.level ?? ''} percent full`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onPick(f); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(f); } }}
    >
      <rect x="-11" y="-11" width="22" height="22" rx="5" className="lm-fac" />
      <path d="M0 -5.5 C0 -5.5 -4.6 0.8 -4.6 3.2 a4.6 4.6 0 0 0 9.2 0 C4.6 0.8 0 -5.5 0 -5.5Z" fill="#fff" />
      <g transform="translate(13 0)">
        <rect ref={rectRef} x="0" y="-11" width="120" height="22" rx="4" className="lm-chip-bg" />
        <text ref={textRef} x="8" y="4" className="lm-chip-text">
          {compact ? <tspan className="lm-chip-level">{f.level}%</tspan> : <>{f.name}{f.level != null && <tspan className="lm-chip-level" dx="5">{f.level}%</tspan>}</>}
        </text>
      </g>
    </g>
  );
}

function StopPin({ stop, x, y, scale, onPick }) {
  const color = stop.status === 'Completed' ? '#2e7d32' : stop.status === 'In Delivery' ? '#1d70b8' : '#152e52';
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      className="lm-stop"
      tabIndex={0}
      role="button"
      aria-label={`Stop ${stop.sequence}: ${stop.name}, ${stop.status}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onPick(stop); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(stop); } }}
    >
      <circle cx="0" cy="-11" r="15" fill="transparent" />
      <ellipse cx="0" cy="0" rx="5" ry="2" fill="#000" opacity="0.18" />
      <path d="M0 0 C-2 -4 -8 -8.5 -8 -14 a8 8 0 0 1 16 0 C8 -8.5 2 -4 0 0Z" fill={color} stroke="#fff" strokeWidth="1.8" />
      <text textAnchor="middle" y="-10.6" className="lm-stop-num">{stop.sequence}</text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function LiveMap({
  height = '560px',
  trucks = [],
  stops = DEFAULT_DELIVERY_STOPS,
  facilities = DEFAULT_FACILITIES,
  dams = null,
  theme: themeProp,
  onTruckSelect,
  onStopSelect,
  onSelectTruck,
  onSelectStop,
  onSelectFacility,
  readOnly = false,
}) {
  const activeFacilities = useMemo(() => {
    if (dams && Array.isArray(dams) && dams.length > 0) {
      return dams.map((d) => ({
        id: d.id || d.name,
        name: d.name,
        lngLat: d.lngLat || [d.longitude || 24.7712, d.latitude || -28.7033],
        level: d.capacityPercentage ?? d.level ?? 75,
        capacity: d.capacityLitres ? `${(d.capacityLitres / 1000000).toFixed(1)} ML` : (d.capacity || '100 ML'),
        kind: d.kind || 'reservoir',
      }));
    }
    return facilities.length > 0 ? facilities : DEFAULT_FACILITIES;
  }, [dams, facilities]);

  const tankers = trucks.length > 0 ? trucks : DEFAULT_TANKERS;
  const activeStops = stops.length > 0 ? stops : DEFAULT_DELIVERY_STOPS;
  const tankerKey = tankers.map(regOf).join('|');

  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const elRef = useRef({});
  const simRef = useRef({});
  const positionsRef = useRef({});
  const pointers = useRef(new Map());
  const pinch = useRef(null);
  const selectedRef = useRef(regOf(tankers[0]));
  const cardRef = useRef(null);
  const pausedRef = useRef(false);
  const { user } = useAuth();
  const zoomRef = useRef(1);
  const uRef = useRef(1);
  const facBoxes = useRef([]);

  const [initialViewBox] = useState(`0 0 ${MAP_CONFIG.W} ${MAP_CONFIG.H}`);
  const [zoom, setZoom] = useState(1);
  const [u, setU] = useState(1);
  const [narrow, setNarrow] = useState(false);
  const [theme, toggleTheme] = useMapTheme(themeProp);
  const [selectedTruckId, setSelectedTruckId] = useState(regOf(tankers[0]));
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [card, setCard] = useState(null);
  const [hud, setHud] = useState({});
  const [liveGps, setLiveGps] = useState(false);
  const [lastGpsSecAgo, setLastGpsSecAgo] = useState(4);

  // Resident Features State
  const [mySuburb, setMySuburb] = useState('Galeshewe Zone 3');
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingTags, setRatingTags] = useState(['On time', 'Enough water']);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Report Problem State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssueType, setReportIssueType] = useState('Dirty water');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Dynamic GPS Freshness Seconds Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLastGpsSecAgo((prev) => (prev >= 60 ? 4 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fitPoints = useMemo(() => {
    const pts = [];
    const busy = new Set();
    tankers.filter((t) => t.status === 'OnTrip').forEach((t) => [t.from?.lngLat, t.to?.lngLat].forEach((ll) => ll && busy.add(ll.join(','))));
    activeFacilities.forEach((f) => pts.push({ p: project(...f.lngLat), l: 20, r: 185, rN: 70, t: 55, b: 20, opt: !busy.has(f.lngLat.join(',')) }));
    activeStops.forEach((st) => pts.push({ p: project(...st.lngLat), l: 20, r: 20, t: 40, b: 15 }));
    tankers.forEach((t) => [t.from?.lngLat, t.to?.lngLat].filter(Boolean).forEach((ll) => pts.push({ p: project(...ll), l: 40, r: 40, t: 55, b: 30, opt: t.status !== 'OnTrip' })));
    return pts;
  }, [tankers, activeFacilities, activeStops]);

  const fitRef = useRef(null);
  const fittedRef = useRef(false);
  const view = useRef({ x: 0, y: 0, w: MAP_CONFIG.W, h: MAP_CONFIG.H });

  const routes = useMemo(() => Object.fromEntries(tankers.map((t) => {
    const from = t.from?.lngLat || [24.7712, -28.7033], to = t.to?.lngLat || [24.7319, -28.7183];
    return [regOf(t), t.status === 'OnTrip' ? resolveRoute(regOf(t), from, to) : straightPath(from, to)];
  })), [tankerKey]);

  zoomRef.current = zoom;
  selectedRef.current = selectedTruckId;
  cardRef.current = card;

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/trucks`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => localStorage.getItem('aquabophelo_token') || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('LocationUpdated', (p) => {
      if (p?.registrationNumber) {
        positionsRef.current[p.registrationNumber] = {
          lat: p.latitude, lng: p.longitude, heading: p.heading ?? null, speedKmh: p.speedKmh || 0, t: Date.now(),
        };
        setLastGpsSecAgo(0);
      }
    });

    connection.start().then(() => setLiveGps(true)).catch((err) => {
      console.warn('SignalR hub unavailable, map running in simulated mode.', err);
    });
    return () => { connection.stop(); };
  }, []);

  const clampView = (v) => {
    v.x = clamp(v.x, -PAD, MAP_CONFIG.W - v.w + PAD);
    v.y = clamp(v.y, -PAD, MAP_CONFIG.H - v.h + PAD);
  };

  const writeView = useCallback(() => {
    const v = view.current;
    svgRef.current?.setAttribute('viewBox', `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return;
    uRef.current = rect.width / v.w;
    zoomRef.current = MAP_CONFIG.W / v.w;
    setU(Math.round(uRef.current * 1000) / 1000);
    setZoom(zoomRef.current);
    setNarrow(rect.width < 560);
  }, []);

  const fitToContent = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return;
    const A = rect.width / rect.height;
    let w = MAP_CONFIG.W, bb;
    for (let i = 0; i < 4; i++) {
      const uVal = rect.width / w;
      bb = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
      fitPoints.forEach(({ p: [x, y], l, r: r0, rN, t, b, opt }) => {
        let r = r0;
        if (opt && rect.width < 560) return;
        if (rN && rect.width < 560) r = rN;
        bb.minX = Math.min(bb.minX, x - l / uVal); bb.maxX = Math.max(bb.maxX, x + r / uVal);
        bb.minY = Math.min(bb.minY, y - t / uVal); bb.maxY = Math.max(bb.maxY, y + b / uVal);
      });
      bb.maxX += 56 / uVal; bb.minY -= 52 / uVal;
      w = clamp(Math.max(bb.maxX - bb.minX, (bb.maxY - bb.minY) * A), MAP_CONFIG.W / 3, MAP_CONFIG.W);
    }
    const v = view.current;
    v.w = w; v.h = w / A;
    v.x = (bb.minX + bb.maxX) / 2 - v.w / 2;
    v.y = (bb.minY + bb.maxY) / 2 - v.h / 2;
    clampView(v);
    fittedRef.current = true;
    writeView();
  }, [fitPoints, writeView]);
  fitRef.current = fitToContent;

  const zoomAt = useCallback((nextZoom, clientX, clientY) => {
    const v = view.current;
    const rect = svgRef.current.getBoundingClientRect();
    const rx = clientX == null ? 0.5 : (clientX - rect.left) / rect.width;
    const ry = clientY == null ? 0.5 : (clientY - rect.top) / rect.height;
    const fx = v.x + rx * v.w, fy = v.y + ry * v.h;
    const z = clamp(nextZoom, 1, MAX_ZOOM);
    v.w = MAP_CONFIG.W / z; v.h = v.w * (rect.height / rect.width);
    v.x = fx - rx * v.w; v.y = fy - ry * v.h;
    clampView(v);
    writeView();
  }, [writeView]);

  const resetView = () => fitRef.current?.();

  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: zoomRef.current };
    }
  };

  const onPointerMove = (e) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((pinch.current.z * d) / pinch.current.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (pointers.current.size === 1) {
      const v = view.current;
      v.x -= (cur.x - prev.x) / uRef.current;
      v.y -= (cur.y - prev.y) / uRef.current;
      clampView(v);
      writeView();
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  useLayoutEffect(() => {
    const onResize = () => {
      const rect = svgRef.current.getBoundingClientRect();
      if (!rect.width) return;
      if (!fittedRef.current) { fitRef.current(); return; }
      const v = view.current;
      const cy = v.y + v.h / 2;
      v.h = v.w * (rect.height / rect.width);
      v.y = cy - v.h / 2;
      clampView(v);
      writeView();
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, [writeView]);

  const routeSig = tankerKey + '#' + Object.values(routes).map((d) => d.length).join(',');
  useLayoutEffect(() => {
    tankers.forEach((t) => {
      const reg = regOf(t);
      const e = elRef.current[reg];
      if (!e?.trail) return;
      const len = e.trail.getTotalLength();
      const samples = Array.from({ length: 201 }, (_, i) => e.trail.getPointAtLength((i / 200) * len));
      const prev = simRef.current[reg];
      simRef.current[reg] = { len, samples, p: prev ? prev.p : (t.start ?? 0.2), hold: prev?.hold || 0, heading: prev?.heading || 0, label: '', h0: null };
    });
  }, [routeSig]);

  useEffect(() => {
    pausedRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = performance.now(), hudAcc = 0;

    const headingAt = (trail, at, len) => {
      const a = trail.getPointAtLength(at), b = trail.getPointAtLength(Math.min(len, at + 3));
      return (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
    };

    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const ms = Math.pow(zoomRef.current, 0.2) / uRef.current;
      const hudNext = {};
      const where = {};

      for (const t of tankers) {
        const reg = regOf(t);
        const s = simRef.current[reg], e = elRef.current[reg];
        if (!s || !e?.trail || !s.len) continue;

        const live = positionsRef.current[reg];
        const liveOk = live && live.lat && live.lng && Date.now() - live.t < 30000;
        const onTrip = t.status === 'OnTrip';
        let x, y, speed = 0;

        if (liveOk) {
          [x, y] = project(live.lng, live.lat);
          let best = 0, bestD = Infinity;
          s.samples.forEach((pt, i) => { const d = (pt.x - x) ** 2 + (pt.y - y) ** 2; if (d < bestD) { bestD = d; best = i; } });
          s.p = best / 200;
          if (live.heading != null) s.heading = live.heading;
          speed = live.speedKmh;
        } else if (!onTrip) {
          s.p = 0;
          const a = e.trail.getPointAtLength(0);
          x = a.x; y = a.y + 30 / uRef.current;
          if (s.h0 == null) s.h0 = headingAt(e.trail, 0, s.len);
          s.heading = s.h0;
        } else {
          if (!pausedRef.current) {
            if (s.p >= 1) { s.hold += dt; if (s.hold > 3) { s.p = 0; s.hold = 0; } }
            else s.p = Math.min(1, s.p + dt / (t.secs || 50));
          }
          const at = s.p * s.len;
          const a = e.trail.getPointAtLength(at);
          x = a.x; y = a.y;
          if (s.p < 0.995) s.heading = headingAt(e.trail, at, s.len);
          speed = t.speedKmh || 0;
        }

        where[reg] = [x, y];
        e.g?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${ms})`);
        e.rot?.setAttribute('transform', `rotate(${s.heading.toFixed(1)})`);
        const dash = `${(s.p * s.len).toFixed(1)} ${s.len.toFixed(1)}`;
        e.done?.setAttribute('stroke-dasharray', dash);
        e.doneCase?.setAttribute('stroke-dasharray', dash);

        const left = Math.max(0, Math.ceil((1 - s.p) * (t.minutes || 14)));
        const plainState = getPlainStatus(t.status, s.p);
        const label = selectedRef.current === reg ? `${reg} \u00b7 ${plainState}` : reg;
        if (e.text && label !== s.label) {
          s.label = label;
          e.text.textContent = label;
          e.rect?.setAttribute('width', e.text.getComputedTextLength() + 16);
          e.rect?.setAttribute('x', -(e.text.getComputedTextLength() + 16) / 2);
        }
        hudNext[reg] = { p: s.p, left, plainState, speed };
      }

      const zk = Math.pow(zoomRef.current, 0.2), uu = uRef.current;
      const taken = [...facBoxes.current];
      const byPriority = [...tankers].sort((a, b) => (regOf(b) === selectedRef.current) - (regOf(a) === selectedRef.current));
      for (const t of byPriority) {
        const reg = regOf(t), e = elRef.current[reg], at = where[reg];
        if (!e?.chip || !at) continue;
        const w = (Number(e.rect?.getAttribute('width')) || 70) * zk, h = 22 * zk;
        const box = { x: at[0] * uu - w / 2, y: at[1] * uu - 25 * zk - h / 2, w, h };
        const clash = regOf(t) !== selectedRef.current && taken.some((o) => hit(o, box));
        const display = clash ? 'none' : '';
        if (e.chip.style.display !== display) e.chip.style.display = display;
        if (!clash) taken.push(box);
      }

      hudAcc += dt;
      if (hudAcc > 0.25 && cardRef.current === 'truck') { hudAcc = 0; setHud(hudNext); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tankerKey]);

  const scale = Math.pow(zoom, 0.2) / u;
  const zf = Math.pow(zoom, 0.55);

  const labelsShown = useMemo(() => {
    const obstacles = [];
    activeFacilities.forEach((f) => {
      const [x, y] = project(...f.lngLat);
      const w = textWidth(narrow ? `${f.level ?? ''}%` : `${f.name} ${f.level ?? ''}%`, UI_FONT) + 34;
      obstacles.push({ x: x * u - 14, y: y * u - 14, w: w + 28, h: 28 });
    });
    facBoxes.current = obstacles.slice(0, activeFacilities.length);
    activeStops.forEach((s) => {
      const [x, y] = project(...s.lngLat);
      obstacles.push({ x: x * u - 12, y: y * u - 28, w: 24, h: 32 });
    });
    return layoutLabels(mapData.places || [], u, obstacles);
  }, [u, narrow, activeFacilities, activeStops]);

  const orderedTankers = useMemo(
    () => [...tankers].sort((a, b) => (regOf(a) === selectedTruckId) - (regOf(b) === selectedTruckId)),
    [tankerKey, selectedTruckId],
  );

  const pickTruck = (t) => {
    setSelectedTruckId(regOf(t));
    setSelectedStop(null);
    setCard('truck');
    onTruckSelect?.(t);
    onSelectTruck?.(t);
  };

  const pickFacility = (f) => {
    setSelectedFacility(f);
    setCard('facility');
    onSelectFacility?.(f);
  };

  const pickStop = (stop) => {
    setSelectedStop(stop);
    setCard('stop');
    onStopSelect?.(stop);
    onSelectStop?.(stop);
  };

  const sel = tankers.find((t) => regOf(t) === selectedTruckId) || tankers[0];
  const selHud = hud[regOf(sel)];
  const isDark = theme === 'dark';
  const tonePending = 'lm-tag lm-tag-pending';

  // Calculations for Resident View
  const progress = selHud?.p || 0.45;
  const currentLitresOnboard = Math.max(0, Math.round((sel.capacityLitres || 10000) * (1 - progress * 0.4)));
  const driverFirstName = formatFirstName(sel.driverName);
  const driverRatingLabel = formatDriverRating(sel.driverRating || 4.8, sel.completedTripsCount || 124);
  const plainStateLabel = selHud?.plainState || getPlainStatus(sel.status, progress);
  const etaMinutes = selHud?.left != null ? selHud.left : (sel.minutes || 14);

  const handleToggleTag = (tag) => {
    setRatingTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <div
      ref={rootRef}
      className="lm"
      data-theme={theme}
      style={{ height, '--zf': zf }}
    >
      <style>{CSS}</style>

      <svg
        ref={svgRef}
        className="lm-svg"
        viewBox={initialViewBox}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Map of water tankers and delivery stops in Kimberley"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => zoomAt(zoomRef.current * 1.6, e.clientX, e.clientY)}
      >
        <defs>
          <linearGradient id="lm-tank" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d70b8" />
            <stop offset="50%" stopColor="#152e52" />
            <stop offset="100%" stopColor="#1d70b8" />
          </linearGradient>
        </defs>

        <BaseMap />

        {(mapData.places || []).map((p) => labelsShown.has(p.name) && (
          <text key={p.name} className="lm-place" textAnchor="middle" transform={`translate(${p.x} ${p.y + 4 / u}) scale(${1 / u})`}>
            {p.name}
          </text>
        ))}

        {tankers.map((t) => {
          const reg = regOf(t);
          const visible = t.status === 'OnTrip';
          return (
            <g key={`trail-${reg}`} style={{ display: visible ? 'inline' : 'none' }}>
              <path ref={(n) => { (elRef.current[reg] ||= {}).trail = n; }} d={routes[reg]} className="lm-trail"
                style={{ strokeWidth: 3 / u, strokeDasharray: `${0.1 / u} ${7 / u}` }} />
              <path ref={(n) => { (elRef.current[reg] ||= {}).doneCase = n; }} d={routes[reg]} className="lm-done-case" style={{ strokeWidth: 7.5 / u }} />
              <path ref={(n) => { (elRef.current[reg] ||= {}).done = n; }} d={routes[reg]} className="lm-done" style={{ strokeWidth: 4.5 / u }} />
            </g>
          );
        })}

        {activeFacilities.map((f) => {
          const [x, y] = project(...f.lngLat);
          return <FacilityMarker key={f.id} f={f} x={x} y={y} scale={scale} compact={narrow} onPick={pickFacility} />;
        })}

        {activeStops.map((stop) => {
          const [x, y] = project(...stop.lngLat);
          return <StopPin key={stop.id} stop={stop} x={x} y={y} scale={scale} onPick={pickStop} />;
        })}

        {orderedTankers.map((t) => {
          const reg = regOf(t);
          const isSel = selectedTruckId === reg;
          return (
            <g
              key={reg}
              ref={(n) => { (elRef.current[reg] ||= {}).g = n; }}
              className={`lm-tk${isSel ? ' sel' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`Tanker ${reg}, ${t.status === 'OnTrip' ? 'on a delivery trip' : 'on standby'}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); pickTruck(t); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTruck(t); } }}
            >
              {isSel && <circle className="lm-pulse" r="15" />}
              <g ref={(n) => { (elRef.current[reg] ||= {}).rot = n; }}><TruckIcon /></g>
              <g ref={(n) => { (elRef.current[reg] ||= {}).chip = n; }} transform="translate(0 -25)" className="lm-tchip">
                <rect ref={(n) => { (elRef.current[reg] ||= {}).rect = n; }} x="-40" y="-10" width="80" height="20" rx="4" />
                <text ref={(n) => { (elRef.current[reg] ||= {}).text = n; }} textAnchor="middle" y="3.8" />
              </g>
            </g>
          );
        })}
      </svg>

      {/* top-left summary & suburb selector */}
      <div className="lm-panel lm-top">
        <span className="lm-top-item lm-strong"><Truck size={15} className="lm-blue" /> {tankers.length} Active Tankers</span>
        <span className="lm-sep" />
        <span className="lm-top-item lm-green"><MapPin size={14} /> My Stop: 
          <select 
            value={mySuburb} 
            onChange={(e) => setMySuburb(e.target.value)}
            className="lm-suburb-select"
          >
            <option value="Galeshewe Zone 3">Galeshewe Zone 3</option>
            <option value="Roodepan Depot">Roodepan</option>
            <option value="Kimberley Central">Kimberley Central</option>
          </select>
        </span>
        <span className={liveGps ? 'lm-badge lm-badge-live' : 'lm-badge'}>{liveGps ? 'Live GPS' : 'Simulated'}</span>
      </div>

      {/* top-right controls */}
      <div className="lm-panel lm-controls">
        <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoomAt(zoomRef.current * 1.5)}><ZoomIn size={16} /></button>
        <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoomAt(zoomRef.current / 1.5)}><ZoomOut size={16} /></button>
        <button type="button" title="Reset view" aria-label="Reset view" onClick={resetView}><RotateCcw size={16} /></button>
        {!themeProp && (
          <button type="button" title={isDark ? 'Switch to light map' : 'Switch to dark map'} aria-label={isDark ? 'Switch to light map' : 'Switch to dark map'}
            aria-pressed={isDark} onClick={toggleTheme}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>

      {/* RESIDENT POPUP CARD */}
      {card === 'truck' && (
        <div className="lm-panel lm-card lm-card-enhanced" role="dialog" aria-label={`Tanker ${regOf(sel)} details`}>
          <div className="lm-card-top">
            <span className="lm-eyebrow"><Truck size={13} /> Tanker &middot; {regOf(sel)}</span>
            <button type="button" className="lm-x" aria-label="Close" onClick={() => setCard(null)}><X size={15} /></button>
          </div>

          {/* 1. Plain words status banner */}
          <div className="lm-status-banner">
            <span className="lm-status-chip">{plainStateLabel}</span>
            <span className="lm-gps-freshness">
              {lastGpsSecAgo > 30 ? (
                <span className="text-amber-500 font-medium">⚠️ GPS offline (estimating)</span>
              ) : (
                `Updated ${lastGpsSecAgo}s ago`
              )}
            </span>
          </div>

          {/* 2. Primary ETA to resident's stop */}
          <div className="lm-eta-box">
            <Clock size={16} className="lm-blue" />
            <span>Arrives at <strong>{mySuburb}</strong> in <strong>{etaMinutes} min</strong></span>
          </div>

          {/* 3. Queue position & upcoming stops */}
          <div className="lm-queue-row">
            <span className="lm-queue-pill">Stop 2 of 5</span>
            <span className="lm-queue-next">Next: Tshwarelela Primary Point &rarr; Mayibuye Centre</span>
          </div>

          {/* 4. Tanker & Driver details */}
          <div className="lm-driver-box">
            <div>
              <div className="lm-driver-name">Driver: <strong>{driverFirstName}</strong></div>
              <div className="lm-driver-rating"><Star size={12} className="fill-amber-400 text-amber-400 inline" /> {driverRatingLabel}</div>
            </div>
            <div className="lm-plate-tag">{regOf(sel)}</div>
          </div>

          {/* 5. Water Left on board */}
          <div className="lm-water-left-box">
            <div className="lm-row">
              <span className="lm-muted">Water Onboard</span>
              <strong>{currentLitresOnboard.toLocaleString('en-ZA')} L of {Number(sel.capacityLitres || 10000).toLocaleString('en-ZA')} L</strong>
            </div>
            <div className="lm-prog" aria-label={`Water level onboard`}>
              <span style={{ width: `${((currentLitresOnboard / (sel.capacityLitres || 10000)) * 100).toFixed(1)}%` }} />
            </div>
          </div>

          {/* 6. Resident Delivery Confirmation & Actions */}
          <div className="lm-actions-group">
            {(!user || user.role === 'Resident') ? (
              !deliveryConfirmed ? (
                <div className="lm-btn-grid">
                  <button 
                    onClick={() => { setDeliveryConfirmed(true); setShowRatingModal(true); }}
                    className="lm-btn-confirm"
                  >
                    <CheckCircle2 size={14} />
                    <span>I Received Water</span>
                  </button>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="lm-btn-report"
                  >
                    <AlertTriangle size={14} />
                    <span>Report Problem</span>
                  </button>
                </div>
              ) : (
                <div className="lm-confirmed-badge">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Delivery confirmed! Thank you.</span>
                  {!ratingSubmitted && (
                    <button onClick={() => setShowRatingModal(true)} className="lm-link-rate">Rate Driver</button>
                  )}
                </div>
              )
            ) : (
              <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center">
                <span className="font-semibold text-[#152e52]">{user.role} Operations View:</span> Live telemetry and dispatch monitoring active. Driver rating is reserved for community residents.
              </div>
            )}
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {showRatingModal && (
        <div className="lm-modal-overlay">
          <div className="lm-modal-content">
            <div className="lm-card-top">
              <span className="lm-eyebrow"><Star size={14} className="text-amber-500 fill-amber-500" /> Rate Your Driver</span>
              <button onClick={() => setShowRatingModal(false)} className="lm-x"><X size={15} /></button>
            </div>
            {!ratingSubmitted ? (
              <>
                <p className="lm-modal-desc">How was your water delivery experience with <strong>{driverFirstName}</strong>?</p>
                
                {/* 1-5 Star Picker */}
                <div className="lm-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setRatingStars(s)} 
                      className={s <= ratingStars ? 'lm-star-active' : 'lm-star-inactive'}
                    >
                      <Star size={24} className={s <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>

                {/* Quick Feedback Tags */}
                <div className="lm-tag-options">
                  {['On time', 'Polite', 'Enough water', 'Left area clean'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={ratingTags.includes(tag) ? 'lm-chip-tag selected' : 'lm-chip-tag'}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Comment box */}
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Optional comment about delivery service..."
                  className="lm-modal-textarea"
                />

                <button 
                  onClick={() => { setRatingSubmitted(true); setTimeout(() => setShowRatingModal(false), 2000); }}
                  className="lm-btn-submit"
                >
                  Submit Rating
                </button>
              </>
            ) : (
              <div className="lm-success-box">
                <CheckCircle2 size={36} className="text-emerald-600 mb-2" />
                <h4>Rating Saved!</h4>
                <p>Thank you for helping keep water delivery transparent in Kimberley.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPORT PROBLEM MODAL */}
      {showReportModal && (
        <div className="lm-modal-overlay">
          <div className="lm-modal-content">
            <div className="lm-card-top">
              <span className="lm-eyebrow"><AlertTriangle size={14} className="text-red-500" /> Report Delivery Issue</span>
              <button onClick={() => setShowReportModal(false)} className="lm-x"><X size={15} /></button>
            </div>
            {!reportSubmitted ? (
              <>
                <label className="lm-modal-label">Select Problem Type:</label>
                <select 
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  className="lm-modal-select"
                >
                  <option value="Dirty water">Dirty / Contaminated Water</option>
                  <option value="Short delivery">Short Delivery (Not enough water)</option>
                  <option value="Truck never arrived">Tanker Never Arrived</option>
                </select>

                {/* DIRTY WATER IMMEDIATE EMERGENCY HOTLINE DISPLAY */}
                {reportIssueType === 'Dirty water' && (
                  <div className="lm-hotline-alert">
                    <div className="lm-hotline-title">
                      <AlertTriangle size={16} />
                      <strong>Municipal Water Quality Emergency Hotline:</strong>
                    </div>
                    <p>If water appears discoloured or unsafe, do not consume it. Call immediately:</p>
                    <div className="lm-hotline-numbers">
                      <a href="tel:0538306442" className="lm-hotline-btn"><PhoneCall size={14} /> 053 830 6442</a>
                      <a href="tel:0538306836" className="lm-hotline-btn"><PhoneCall size={14} /> 053 830 6836</a>
                    </div>
                  </div>
                )}

                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Describe what happened at your location..."
                  className="lm-modal-textarea"
                />

                <button 
                  onClick={() => { setReportSubmitted(true); setTimeout(() => setShowReportModal(false), 2200); }}
                  className="lm-btn-submit lm-btn-danger"
                >
                  File Complaint Ticket
                </button>
              </>
            ) : (
              <div className="lm-success-box">
                <CheckCircle2 size={36} className="text-emerald-600 mb-2" />
                <h4>Complaint Logged!</h4>
                <p>Municipal ticket generated. Admin and maintenance team notified.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facility & Stop Cards */}
      {card === 'stop' && selectedStop && (
        <div className="lm-panel lm-card" role="dialog" aria-label={`${selectedStop.name} details`}>
          <div className="lm-card-top">
            <span className="lm-eyebrow"><MapPin size={13} /> Stop {selectedStop.sequence} &middot; {selectedStop.area}</span>
            <button type="button" className="lm-x" aria-label="Close" onClick={() => { setCard(null); setSelectedStop(null); }}><X size={15} /></button>
          </div>
          <h4 className="lm-card-title">{selectedStop.name}</h4>
          <div className="lm-row">
            <span className="lm-muted">Volume <strong className="lm-mono">{selectedStop.volume}</strong></span>
            <span className={selectedStop.status === 'Completed' ? 'lm-tag lm-tag-green' : selectedStop.status === 'In Delivery' ? 'lm-tag lm-tag-blue' : tonePending}>
              {selectedStop.status}
            </span>
          </div>
        </div>
      )}

      {card === 'facility' && selectedFacility && (
        <div className="lm-panel lm-card" role="dialog" aria-label={`${selectedFacility.name} details`}>
          <div className="lm-card-top">
            <span className="lm-eyebrow"><Droplet size={13} /> {selectedFacility.kind === 'depot' ? 'Depot' : 'Reservoir'}</span>
            <button type="button" className="lm-x" aria-label="Close" onClick={() => { setCard(null); setSelectedFacility(null); }}><X size={15} /></button>
          </div>
          <h4 className="lm-card-title">{selectedFacility.name}</h4>
          <dl className="lm-dl">
            {selectedFacility.level != null && <div><dt>Storage level</dt><dd>{selectedFacility.level}%</dd></div>}
            {selectedFacility.capacity && <div><dt>Capacity</dt><dd>{selectedFacility.capacity}</dd></div>}
          </dl>
          {selectedFacility.level != null && (
            <div className="lm-prog" aria-label={`${selectedFacility.level} percent full`}><span style={{ width: `${selectedFacility.level}%` }} /></div>
          )}
        </div>
      )}

      {/* legend */}
      <div className="lm-panel lm-legend">
        <span><i className="lm-dot lm-dot-truck" />Tanker</span>
        <span><i className="lm-dot" style={{ background: '#2e7d32' }} />Completed stop</span>
        <span><i className="lm-dot" style={{ background: '#1d70b8' }} />In delivery</span>
        <span><i className="lm-dot lm-dot-pending" />Pending</span>
      </div>

      <div className="lm-credit">{mapData.attribution || '\u00a9 OpenStreetMap contributors'}</div>
    </div>
  );
}

export default LiveMap;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const CSS = `
.lm{
  --navy:#152e52;--blue:#1d70b8;--green:#2e7d32;
  --land:#eef0ed;--built:#e6e8e6;--parks:#d9e8d0;--water:#b9d5e8;--waterway:#8ab4f8;
  --minor-edge:#d3d9de;--minor:#ffffff;--medium-edge:#c0c7d0;--medium:#ffffff;--major-edge:#dcbf82;--major:#f5dca6;
  --label:#556070;--halo:#eef0ed;
  --panel:rgba(255,255,255,.96);--panel-border:#e2e8f0;--text:#152e52;--muted:#64748b;--hover:#f1f5f9;
  --chip-bg:#ffffff;--chip-border:#bcd6ea;--chip-text:#152e52;--chip-level:#1d70b8;
  --done-case:#ffffff;--trail:#152e52;--border:#e2e8f0;
  --tag-green-bg:#f2f9f3;--tag-green-text:#2e7d32;--tag-green-border:#b8e3bd;
  --tag-blue-bg:#e8f1fa;--tag-blue-text:#1d70b8;--tag-blue-border:#b6d3ee;
  --tag-grey-bg:#f1f5f9;--tag-grey-text:#475569;--tag-grey-border:#e2e8f0;
}
.lm[data-theme="dark"]{
  --land:#141c27;--built:#1a2433;--parks:#17291f;--water:#1b3a57;--waterway:#2f6da3;
  --minor-edge:#0d141c;--minor:#2b394b;--medium-edge:#0d141c;--medium:#37495f;--major-edge:#43361a;--major:#8a6d36;
  --label:#9fb2c8;--halo:#141c27;
  --panel:rgba(21,46,82,.96);--panel-border:#2b4a7a;--text:#ffffff;--muted:#aebfd8;--hover:#1d3d6b;
  --chip-bg:#152e52;--chip-border:#2f568c;--chip-text:#ffffff;--chip-level:#7fbbf0;
  --done-case:#0d141c;--trail:#9fc4ea;--border:#27406a;
  --tag-green-bg:rgba(46,125,50,.22);--tag-green-text:#8fd694;--tag-green-border:#2e7d32;
  --tag-blue-bg:rgba(29,112,184,.25);--tag-blue-text:#8cc3f2;--tag-blue-border:#1d70b8;
  --tag-grey-bg:rgba(255,255,255,.08);--tag-grey-text:#c9d6e8;--tag-grey-border:#3a5883;
}
.lm{position:relative;width:100%;overflow:hidden;border:1px solid var(--border);border-radius:8px;background:var(--land);user-select:none;font-family:inherit;color:var(--text)}
.lm *{box-sizing:border-box}
.lm-svg{display:block;width:100%;height:100%;touch-action:none;cursor:grab}
.lm-svg:active{cursor:grabbing}

.lm-land{fill:var(--land)}.lm-built{fill:var(--built)}.lm-parks{fill:var(--parks)}.lm-water{fill:var(--water)}
.lm-waterway{stroke:var(--waterway);stroke-width:calc(3px * var(--zf))}
.lm-minor-edge{stroke:var(--minor-edge);stroke-width:calc(3.2px * var(--zf))}
.lm-minor{stroke:var(--minor);stroke-width:calc(2px * var(--zf))}
.lm-medium-edge{stroke:var(--medium-edge);stroke-width:calc(5.2px * var(--zf))}
.lm-medium{stroke:var(--medium);stroke-width:calc(3.6px * var(--zf))}
.lm-major-edge{stroke:var(--major-edge);stroke-width:calc(7.6px * var(--zf))}
.lm-major{stroke:var(--major);stroke-width:calc(5.6px * var(--zf))}
.lm-place{font-family:var(--font-serif,Lora,Georgia,'Times New Roman',serif);font-style:italic;font-weight:500;font-size:11px;fill:var(--label);paint-order:stroke;stroke:var(--halo);stroke-width:3px;stroke-linejoin:round;pointer-events:none}

.lm-trail{fill:none;stroke:var(--trail);stroke-opacity:.5;stroke-linecap:round}
.lm-done-case{fill:none;stroke:var(--done-case);stroke-opacity:.9;stroke-linecap:round;stroke-linejoin:round}
.lm-done{fill:none;stroke:#1d70b8;stroke-linecap:round;stroke-linejoin:round}

.lm-fac{fill:#152e52;stroke:#fff;stroke-width:2}
.lm-chip-bg{fill:var(--chip-bg);stroke:var(--chip-border);stroke-width:1}
.lm-chip-text{font:600 11px system-ui,-apple-system,'Segoe UI',sans-serif;fill:var(--chip-text);pointer-events:none}
.lm-chip-level{fill:var(--chip-level);font-weight:700}
.lm-stop,.lm-fac-g{cursor:pointer;outline:none}
.lm-fac-g:focus-visible .lm-fac{stroke:#b86e00}
.lm-stop-num{font:700 9.5px system-ui,sans-serif;fill:#fff;pointer-events:none}
.lm-stop:focus-visible path{stroke:#b86e00;stroke-width:2.6}
.lm-tk{cursor:pointer;outline:none}
.lm-chev{fill:#1d70b8}
.lm-tk.sel .lm-chev{fill:#2e7d32}
.lm-tk:focus-visible .lm-pulse{stroke:#b86e00}
.lm-pulse{fill:none;stroke:#2e7d32;stroke-width:2;transform-box:fill-box;transform-origin:center;animation:lm-pulse 2.2s ease-out infinite}
@keyframes lm-pulse{0%{opacity:.8;transform:scale(.75)}100%{opacity:0;transform:scale(1.7)}}
.lm-tchip rect{fill:var(--chip-bg);stroke:var(--chip-border);stroke-width:1}
.lm-tchip text{font:700 10.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:var(--chip-text);pointer-events:none}
.lm-tk.sel .lm-tchip rect{fill:#152e52;stroke:#2e7d32;stroke-width:1.5}
.lm-tk.sel .lm-tchip text{fill:#fff}

.lm-panel{position:absolute;background:var(--panel);border:1px solid var(--panel-border);border-radius:6px;box-shadow:0 1px 2px rgba(15,34,61,.08);color:var(--text);backdrop-filter:blur(2px)}
.lm-top{top:12px;left:12px;display:flex;align-items:center;gap:10px;padding:7px 12px;font-size:12.5px;max-width:calc(100% - 76px);flex-wrap:wrap}
.lm-suburb-select{background:transparent;border:1px solid var(--panel-border);border-radius:4px;padding:1px 6px;font-weight:600;font-size:12px;color:var(--text);margin-left:4px}
.lm-top-item{display:inline-flex;align-items:center;gap:6px;font-weight:600}
.lm-strong{font-weight:700}.lm-blue{color:#1d70b8}.lm-green{color:#2e7d32}
.lm[data-theme="dark"] .lm-blue{color:#6fb4ee}.lm[data-theme="dark"] .lm-green{color:#7fd187}
.lm-sep{width:1px;height:16px;background:var(--panel-border)}
.lm-badge{font-size:10.5px;font-weight:700;letter-spacing:.02em;padding:2px 8px;border-radius:4px;border:1px solid var(--tag-grey-border);background:var(--tag-grey-bg);color:var(--tag-grey-text)}
.lm-badge-live{background:var(--tag-green-bg);color:var(--tag-green-text);border-color:var(--tag-green-border)}
.lm-controls{top:12px;right:12px;display:flex;flex-direction:column;overflow:hidden}
.lm-controls button{all:unset;box-sizing:border-box;width:34px;height:34px;display:grid;place-items:center;cursor:pointer;color:var(--text);border-bottom:1px solid var(--panel-border)}
.lm-controls button:last-child{border-bottom:0}
.lm-controls button:hover{background:var(--hover)}
.lm-controls button:focus-visible,.lm-x:focus-visible{outline:2px solid #b86e00;outline-offset:-2px}
.lm-legend{left:12px;bottom:12px;display:none;gap:16px;padding:8px 12px;font-size:11.5px;color:var(--muted);align-items:center;flex-wrap:wrap}
@media(min-width:640px){.lm-legend{display:flex}}
.lm-legend span{display:inline-flex;align-items:center;gap:6px}
.lm-dot{display:inline-block;width:10px;height:10px;border-radius:50%}
.lm-dot-pending{background:#152e52;box-shadow:0 0 0 1.5px rgba(255,255,255,.9)}
.lm-dot-truck{background:linear-gradient(90deg,#1d70b8,#152e52,#1d70b8);border-radius:3px;width:8px;height:12px;border:1px solid #fff}
.lm-credit{position:absolute;right:8px;bottom:6px;font-size:10px;color:var(--muted);background:var(--panel);padding:1px 6px;border-radius:3px;pointer-events:none}

.lm-card{right:12px;bottom:30px;width:320px;max-width:calc(100% - 24px);padding:14px 16px;z-index:5}
.lm-card-enhanced{display:flex;flex-direction:column;gap:10px}
.lm-card-top{display:flex;justify-content:space-between;align-items:center}
.lm-eyebrow{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#1d70b8}
.lm[data-theme="dark"] .lm-eyebrow{color:#7fbbf0}
.lm-x{all:unset;box-sizing:border-box;cursor:pointer;padding:3px;border-radius:4px;color:var(--muted);display:grid;place-items:center}
.lm-x:hover{background:var(--hover)}

.lm-status-banner{display:flex;justify-content:space-between;align-items:center;background:var(--tag-blue-bg);border:1px solid var(--tag-blue-border);padding:6px 10px;border-radius:6px;font-size:12px}
.lm-status-chip{font-weight:700;color:var(--tag-blue-text)}
.lm-gps-freshness{font-size:10.5px;color:var(--muted)}

.lm-eta-box{display:flex;align-items:center;gap:8px;background:var(--hover);padding:8px 10px;border-radius:6px;font-size:13px}
.lm-queue-row{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted)}
.lm-queue-pill{background:#152e52;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px;font-size:10.5px}
.lm-queue-next{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.lm-driver-box{display:flex;justify-content:space-between;align-items:center;background:var(--hover);padding:8px 10px;border-radius:6px;font-size:12px}
.lm-driver-name{font-size:13px}
.lm-driver-rating{font-size:11.5px;color:var(--muted);display:flex;align-items:center;gap:4px;margin-top:2px}
.lm-plate-tag{font-family:monospace;font-weight:700;background:var(--chip-bg);border:1px solid var(--chip-border);padding:2px 6px;border-radius:4px;font-size:11px}

.lm-water-left-box{display:flex;flex-direction:column;gap:4px;font-size:12px}

.lm-actions-group{margin-top:4px}
.lm-btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lm-btn-confirm{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#2e7d32;color:#fff;font-weight:700;font-size:12px;padding:8px 10px;border-radius:6px;border:none;cursor:pointer}
.lm-btn-confirm:hover{background:#236427}
.lm-btn-report{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#dc2626;color:#fff;font-weight:700;font-size:12px;padding:8px 10px;border-radius:6px;border:none;cursor:pointer}
.lm-btn-report:hover{background:#b91c1c}

.lm-confirmed-badge{display:flex;align-items:center;justify-content:space-between;background:var(--tag-green-bg);border:1px solid var(--tag-green-border);color:var(--tag-green-text);padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600}
.lm-link-rate{color:#1d70b8;text-decoration:underline;background:none;border:none;cursor:pointer;font-weight:700}

/* Modal Overlay & Dialogs */
.lm-modal-overlay{position:absolute;inset:0;background:rgba(15,34,61,0.65);backdrop-filter:blur(3px);z-index:20;display:grid;place-items:center;padding:16px}
.lm-modal-content{background:var(--panel);border:1px solid var(--panel-border);border-radius:8px;width:100%;max-width:340px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.2);display:flex;flex-direction:column;gap:12px}
.lm-modal-desc{font-size:13px;margin:0}
.lm-stars-row{display:flex;justify-content:center;gap:8px}
.lm-star-active,.lm-star-inactive{background:none;border:none;cursor:pointer;padding:2px}
.lm-tag-options{display:flex;flex-wrap:wrap;gap:6px}
.lm-chip-tag{background:var(--hover);border:1px solid var(--panel-border);padding:4px 8px;border-radius:20px;font-size:11.5px;cursor:pointer;color:var(--text)}
.lm-chip-tag.selected{background:#1d70b8;color:#fff;border-color:#1d70b8}
.lm-modal-textarea{width:100%;height:60px;padding:8px;border-radius:6px;border:1px solid var(--panel-border);background:var(--hover);color:var(--text);font-size:12px;resize:none}
.lm-btn-submit{background:#1d70b8;color:#fff;font-weight:700;padding:8px;border-radius:6px;border:none;cursor:pointer;font-size:13px}
.lm-btn-submit:hover{background:#155894}
.lm-btn-danger{background:#dc2626}
.lm-btn-danger:hover{background:#b91c1c}

.lm-modal-label{font-size:12px;font-weight:700}
.lm-modal-select{width:100%;padding:8px;border-radius:6px;border:1px solid var(--panel-border);background:var(--hover);color:var(--text);font-size:12.5px}
.lm-hotline-alert{background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:10px;border-radius:6px;font-size:12px;display:flex;flex-direction:column;gap:6px}
.lm-hotline-title{display:flex;align-items:center;gap:6px;color:#dc2626}
.lm-hotline-numbers{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px}
.lm-hotline-btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;background:#dc2626;color:#fff;padding:6px;border-radius:4px;font-weight:700;font-size:11px;text-decoration:none}

.lm-success-box{text-align:center;padding:16px 8px;display:flex;flex-direction:column;align-items:center}
.lm-success-box h4{margin:4px 0;font-size:16px;color:var(--text)}
.lm-success-box p{font-size:12px;color:var(--muted);margin:0}

@media(prefers-reduced-motion:reduce){.lm-pulse{animation:none;opacity:.5}}
`;
