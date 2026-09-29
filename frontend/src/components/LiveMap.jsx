import React, { memo, useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import mapData from './kimberleyMap.json';
import { 
  Truck, Droplet, MapPin, Navigation, CheckCircle2, Clock, 
  ZoomIn, ZoomOut, RotateCcw, Play, Pause, Layers, ShieldCheck 
} from 'lucide-react';
import apiClient from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

// Map Dimensions & Projection Center for Kimberley
const MAP_CONFIG = { center: [24.76, -28.73], spanLng: 0.24, W: 900, H: 560 };
const METRES_PER_DEG = 111320;

function makeProjection({ center, spanLng, W, H }) {
  const [lng0, lat0] = center;
  const cos = Math.cos((lat0 * Math.PI) / 180);
  const k = W / (spanLng * cos); // pixels per degree of longitude
  const project = (lng, lat) => [
    W / 2 + (lng - lng0) * cos * k,
    H / 2 - (lat - lat0) * k
  ];
  return { project, k };
}

const { project, k } = makeProjection(MAP_CONFIG);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Default Municipal Facilities
const DEFAULT_FACILITIES = [
  { id: 'newton', name: 'Newton Reservoir', lngLat: [24.7712, -28.7033], level: 62.5, capacity: '92.5 ML', kind: 'reservoir' },
  { id: 'riverton', name: 'Riverton Water Works', lngLat: [24.8102, -28.6788], level: 82.0, capacity: '150.0 ML', kind: 'reservoir' },
  { id: 'roodepan', name: 'Roodepan Depot', lngLat: [24.7255, -28.6905], level: 90.0, capacity: '45.0 ML', kind: 'depot' },
];

// Default Municipal Water Delivery Stops (Many Stops on Map)
const DEFAULT_DELIVERY_STOPS = [
  { id: 101, sequence: 1, name: 'Galeshewe Police Station Water Point', lngLat: [24.7319, -28.7183], area: 'Galeshewe', status: 'Completed', volume: '3,500 L' },
  { id: 102, sequence: 2, name: 'Tshwarelela Primary Drop Point', lngLat: [24.7291, -28.7125], area: 'Galeshewe', status: 'In Delivery', volume: '2,500 L' },
  { id: 103, sequence: 3, name: 'Mayibuye Community Centre', lngLat: [24.7245, -28.7098], area: 'Galeshewe', status: 'Pending', volume: '3,000 L' },
  { id: 201, sequence: 1, name: 'Sol Plaatje Civic Centre Reservoir', lngLat: [24.7719, -28.7419], area: 'Kimberley Central', status: 'Completed', volume: '5,000 L' },
  { id: 202, sequence: 2, name: 'Kimberley Hospital Water Reserve', lngLat: [24.7645, -28.7388], area: 'Kimberley Central', status: 'In Delivery', volume: '4,000 L' },
  { id: 301, sequence: 1, name: 'Roodepan Municipal Depot Standby', lngLat: [24.7088, -28.6921], area: 'Roodepan', status: 'Pending', volume: '2,000 L' },
  { id: 302, sequence: 2, name: 'Lerato Park Community Water Tanks', lngLat: [24.7012, -28.6854], area: 'Roodepan', status: 'Pending', volume: '3,500 L' },
];

// Default Tankers Fleet with OpenStreetMap Routes
const DEFAULT_TANKERS = [
  {
    id: '542-KM NC',
    registrationNumber: '542-KM NC',
    driverName: 'Sipho Dlamini',
    capacityLitres: 10000,
    status: 'OnTrip',
    from: { name: 'Newton Reservoir', lngLat: [24.7712, -28.7033] },
    to: { name: 'Galeshewe Zone 3', lngLat: [24.7319, -28.7183] },
    speedKmh: 38,
    minutes: 18,
    secs: 50,
    start: 0.45
  },
  {
    id: '882-KM NC',
    registrationNumber: '882-KM NC',
    driverName: 'Lerato Motsepe',
    capacityLitres: 15000,
    status: 'OnTrip',
    from: { name: 'Newton Reservoir', lngLat: [24.7712, -28.7033] },
    to: { name: 'Roodepan Depot', lngLat: [24.7088, -28.6921] },
    speedKmh: 42,
    minutes: 24,
    secs: 65,
    start: 0.25
  },
  {
    id: '104-KM NC',
    registrationNumber: '104-KM NC',
    driverName: 'Tshepo Khumalo',
    capacityLitres: 10000,
    status: 'Available',
    from: { name: 'Riverton Water Works', lngLat: [24.8102, -28.6788] },
    to: { name: 'Kimberley Central CBD', lngLat: [24.7719, -28.7419] },
    speedKmh: 0,
    minutes: 0,
    secs: 60,
    start: 0.95
  }
];

// SVG Base Map Layer
const BaseMap = memo(function BaseMap() {
  const L = mapData.layers || {};
  const edgeProps = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' };
  return (
    <g>
      {/* Landmass background */}
      <rect className="fill-[#eef0ed]" width={MAP_CONFIG.W} height={MAP_CONFIG.H} />
      {/* Built-up areas */}
      {L.built && <path className="fill-[#e6e8e6]" d={L.built} />}
      {/* Parks & Greenery */}
      {L.parks && <path className="fill-[#d9e8d0]" d={L.parks} />}
      {/* Water Bodies & Reservoirs */}
      {L.water && <path className="fill-[#b9d5e8]" d={L.water} />}
      {/* Waterways & Rivers */}
      {L.waterway && <path className="stroke-[#8ab4f8] stroke-[3px] fill-none" d={L.waterway} {...edgeProps} />}

      {/* Road Network Layers */}
      <defs>
        <path id="stm-minor" d={L.minor || ''} {...edgeProps} />
        <path id="stm-medium" d={L.medium || ''} {...edgeProps} />
        <path id="stm-major" d={L.major || ''} {...edgeProps} />
      </defs>

      {/* Minor Streets */}
      <use href="#stm-minor" className="stroke-[#d3d9de] stroke-[3.4px] fill-none" />
      <use href="#stm-minor" className="stroke-white stroke-[2.2px] fill-none" />
      {/* Medium Connectors */}
      <use href="#stm-medium" className="stroke-[#c0c7d0] stroke-[5.4px] fill-none" />
      <use href="#stm-medium" className="stroke-white stroke-[3.8px] fill-none" />
      {/* Major Arterial Routes */}
      <use href="#stm-major" className="stroke-[#dcbf82] stroke-[8px] fill-none" />
      <use href="#stm-major" className="stroke-[#f5dca6] stroke-[6px] fill-none" />
    </g>
  );
});

// Top-Down Water Tanker Truck Vector Graphic (Uber/Bolt Style)
const UberStyleTankerIcon = ({ isSelected = false }) => (
  <g className="cursor-pointer transition-transform duration-300 hover:scale-110">
    {/* Ground drop shadow */}
    <ellipse cx="0" cy="4" rx="20" ry="32" fill="#000000" opacity="0.25" />

    {/* Selected Pulse Ring */}
    {isSelected && (
      <circle cx="0" cy="0" r="32" className="animate-ping fill-none stroke-[#2e7d32] stroke-[2.5px]" opacity="0.7" />
    )}

    {/* Tanker Main Chassis / Tanker Body */}
    <rect x="-15" y="-22" width="30" height="44" rx="12" fill="url(#tankGrad)" stroke="#0f223d" strokeWidth="1.5" />

    {/* Tanker Ribs */}
    <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#0f223d" strokeWidth="2" opacity="0.4" />
    <line x1="-12" y1="0" x2="12" y2="0" stroke="#0f223d" strokeWidth="2" opacity="0.4" />
    <line x1="-12" y1="12" x2="12" y2="12" stroke="#0f223d" strokeWidth="2" opacity="0.4" />

    {/* Water Drop Emblem on Tanker Top */}
    <path d="M0 -14 C 4 -8, 6 -4, 6 -1 C 6 3, 3 6, 0 6 C -3 6, -6 3, -6 -1 C -6 -4, -4 -8, 0 -14 Z" fill="#ffffff" />

    {/* Driver Cab Front */}
    <rect x="-12" y="-28" width="24" height="15" rx="4" fill="#152e52" stroke="#0a182c" strokeWidth="1.5" />
    {/* Windshield Glass */}
    <rect x="-9" y="-25" width="18" height="6" rx="2" fill="#bfe3f5" opacity="0.9" />

    {/* Side Mirrors */}
    <rect x="-15" y="-24" width="3" height="4" rx="1" fill="#0a182c" />
    <rect x="12" y="-24" width="3" height="4" rx="1" fill="#0a182c" />

    {/* Front Heading Direction Arrow Chevron */}
    <path d="M0 -34 L5 -28 L-5 -28 Z" fill={isSelected ? '#2e7d32' : '#152e52'} />
  </g>
);

export function LiveMap({
  height = '560px',
  dams = [],
  trucks = [],
  stops = DEFAULT_DELIVERY_STOPS,
  onTruckSelect,
  onStopSelect
}) {
  const svgRef = useRef(null);
  const elementsRef = useRef({});
  const simRef = useRef({});
  const viewRef = useRef({ x: 0, y: 0, w: MAP_CONFIG.W, h: MAP_CONFIG.H });
  const zoomRef = useRef(1);
  const pausedRef = useRef(false);
  const dragRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [selectedTruckId, setSelectedTruckId] = useState('542-KM NC');
  const [selectedStop, setSelectedStop] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMult, setSpeedMult] = useState(1);
  const [truckPositions, setTruckPositions] = useState({});
  const [activeSignalR, setActiveSignalR] = useState(false);

  const activeTankers = trucks.length > 0 ? trucks : DEFAULT_TANKERS;
  const activeStops = stops.length > 0 ? stops : DEFAULT_DELIVERY_STOPS;

  // SignalR Real-Time Location Telemetry Connection
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/trucks`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('LocationUpdated', (payload) => {
      if (payload && payload.registrationNumber) {
        setTruckPositions((prev) => ({
          ...prev,
          [payload.registrationNumber]: {
            latitude: payload.latitude,
            longitude: payload.longitude,
            heading: payload.heading || 0,
            speedKmh: payload.speedKmh || 0,
          },
        }));
      }
    });

    async function startHub() {
      try {
        await connection.start();
        setActiveSignalR(true);
      } catch (err) {
        console.warn('SignalR Hub unavailable, map operating in high-precision simulated telemetry mode.', err);
      }
    }
    startHub();

    return () => {
      connection.stop();
    };
  }, []);

  // Zoom controls helper
  const applyViewBox = () => {
    const v = viewRef.current;
    svgRef.current?.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
  };

  const handleZoom = (nextZoom) => {
    const v = viewRef.current;
    const cx = v.x + v.w / 2;
    const cy = v.y + v.h / 2;
    const z = clamp(nextZoom, 1, 5);
    v.w = MAP_CONFIG.W / z;
    v.h = MAP_CONFIG.H / z;
    v.x = clamp(cx - v.w / 2, 0, MAP_CONFIG.W - v.w);
    v.y = clamp(cy - v.h / 2, 0, MAP_CONFIG.H - v.h);
    zoomRef.current = z;
    setZoom(z);
    applyViewBox();
  };

  // Pointer drag panning
  const handlePointerDown = (e) => {
    dragRef.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const v = viewRef.current;
    const scale = Math.max(rect.width / v.w, rect.height / v.h);
    v.x = clamp(v.x - e.movementX / scale, 0, MAP_CONFIG.W - v.w);
    v.y = clamp(v.y - e.movementY / scale, 0, MAP_CONFIG.H - v.h);
    applyViewBox();
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  // Main animation tick loop for Uber-style smooth vehicle movement on streets
  useEffect(() => {
    // Sample routes from kimberleyMap.json
    activeTankers.forEach((t) => {
      const reg = t.registrationNumber || t.id;
      const el = elementsRef.current[reg];
      if (!el?.trail) return;
      const len = el.trail.getTotalLength();
      const samples = Array.from({ length: 201 }, (_, i) => el.trail.getPointAtLength((i / 200) * len));
      simRef.current[reg] = { len, samples, p: t.start || 0.2, hold: 0, heading: 0 };
    });

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      const invScale = 1 / zoomRef.current;

      for (const t of activeTankers) {
        const reg = t.registrationNumber || t.id;
        const s = simRef.current[reg];
        const e = elementsRef.current[reg];
        if (!s || !e) continue;

        const liveGps = truckPositions[reg];
        let x, y;

        if (liveGps && liveGps.latitude && liveGps.longitude) {
          [x, y] = project(liveGps.longitude, liveGps.latitude);
          if (liveGps.heading != null) s.heading = liveGps.heading;
        } else {
          if (!pausedRef.current) {
            if (s.p >= 1) {
              s.hold += dt;
              if (s.hold > 3.0) { s.p = 0; s.hold = 0; }
            } else {
              s.p = Math.min(1, s.p + (dt * speedMult) / (t.secs || 50));
            }
          }

          const at = s.p * s.len;
          const ptA = e.trail.getPointAtLength(at);
          const ptB = e.trail.getPointAtLength(Math.min(s.len, at + 3));
          x = ptA.x;
          y = ptA.y;

          // Uber/Bolt rotation heading angle calculation along path
          if (s.p < 0.995) {
            s.heading = (Math.atan2(ptB.x - ptA.x, -(ptB.y - ptA.y)) * 180) / Math.PI;
          }
        }

        // Apply smooth transform to truck marker
        e.g?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${invScale})`);
        e.rot?.setAttribute('transform', `rotate(${s.heading.toFixed(1)})`);
        // Update dashed trail
        e.done?.setAttribute('stroke-dasharray', `${(s.p * s.len).toFixed(1)} ${s.len.toFixed(1)}`);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeTankers, truckPositions, speedMult]);

  const inv = 1 / zoom;

  // Function to resolve SVG path for route
  const getRoutePath = (t) => {
    const reg = t.registrationNumber || t.id;
    if (mapData.routes && mapData.routes[reg]) return mapData.routes[reg];
    const fromCoords = t.from?.lngLat || [24.7712, -28.7033];
    const toCoords = t.to?.lngLat || [24.7319, -28.7183];
    const [x1, y1] = project(...fromCoords);
    const [x2, y2] = project(...toCoords);
    return `M${x1} ${y1}L${x2} ${y2}`;
  };

  return (
    <div className="relative w-full border border-slate-200 rounded-lg overflow-hidden bg-[#eef0ed] shadow-xs select-none" style={{ height }}>
      {/* SVG Canvas Map */}
      <svg
        ref={svgRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        viewBox={`0 0 ${MAP_CONFIG.W} ${MAP_CONFIG.H}`}
        preserveAspectRatio="xMidYMid slice"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d70b8" />
            <stop offset="50%" stopColor="#152e52" />
            <stop offset="100%" stopColor="#1d70b8" />
          </linearGradient>
        </defs>

        {/* Base Map Roads, Water, Parks */}
        <BaseMap />

        {/* Municipal Suburb Place Labels */}
        {(mapData.places || []).map((p) => (
          <text
            key={p.name}
            className="font-serif italic text-xs font-semibold fill-slate-600 pointer-events-none select-none"
            transform={`translate(${p.x} ${p.y}) scale(${inv})`}
            textAnchor="middle"
          >
            {p.name}
          </text>
        ))}

        {/* Municipal Facilities (Newton, Riverton, Roodepan) */}
        {DEFAULT_FACILITIES.map((f) => {
          const [x, y] = project(...f.lngLat);
          return (
            <g key={f.id} transform={`translate(${x} ${y}) scale(${inv})`} className="cursor-pointer">
              <rect x="-12" y="-12" width="24" height="24" rx="4" className="fill-[#152e52] stroke-white stroke-2 shadow-xs" />
              <path d="M0 -6 C0 -6 -5 1 -5 3.5 a5 5 0 0 0 10 0 C5 1 0 -6 0 -6Z" fill="#ffffff" />
              <text className="font-sans font-bold text-[11px] fill-[#152e52] font-mono pointer-events-none" x="16" y="4">
                {f.name} ({f.level}%)
              </text>
            </g>
          );
        })}

        {/* Delivery Stop Pins (Many Stops on Map) */}
        {activeStops.map((stop) => {
          const [x, y] = project(...stop.lngLat);
          const isCompleted = stop.status === 'Completed';
          const isInDelivery = stop.status === 'In Delivery';

          return (
            <g
              key={stop.id}
              transform={`translate(${x} ${y}) scale(${inv})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStop(stop);
                if (onStopSelect) onStopSelect(stop);
              }}
            >
              {/* Drop Shadow */}
              <ellipse cx="0" cy="14" rx="8" ry="3" fill="#000000" opacity="0.3" />

              {/* Pin Teardrop Shape */}
              <path
                d="M0 -22 C -12 -22, -18 -12, -18 -4 C -18 8, 0 16, 0 16 C 0 16, 18 8, 18 -4 C 18 -12, 12 -22, 0 -22 Z"
                fill={isCompleted ? '#2e7d32' : isInDelivery ? '#1d70b8' : '#152e52'}
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Inner Badge Icon or Number */}
              <text textAnchor="middle" y="-6" className="font-bold text-[10px] fill-white font-sans pointer-events-none">
                {stop.sequence}
              </text>
            </g>
          );
        })}

        {/* Route Trails for Active Tankers */}
        {activeTankers.map((t) => {
          const reg = t.registrationNumber || t.id;
          return (
            <g key={`trail-${reg}`}>
              <path
                ref={(n) => { (elementsRef.current[reg] ||= {}).trail = n; }}
                d={getRoutePath(t)}
                className="fill-none stroke-[#1d70b8] opacity-30 stroke-[3.5px] stroke-dasharray-[3,6] stroke-linecap-round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                ref={(n) => { (elementsRef.current[reg] ||= {}).done = n; }}
                d={getRoutePath(t)}
                className="fill-none stroke-[#152e52] stroke-[4px] stroke-linecap-round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}

        {/* Moving Tanker Truck Vehicles (Uber / Bolt Style) */}
        {activeTankers.map((t) => {
          const reg = t.registrationNumber || t.id;
          const isSelected = selectedTruckId === reg;

          return (
            <g
              key={reg}
              ref={(n) => { (elementsRef.current[reg] ||= {}).g = n; }}
              tabIndex={0}
              role="button"
              className="cursor-pointer outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTruckId(reg);
                if (onTruckSelect) onTruckSelect(t);
              }}
            >
              {/* Rotating Truck Body in Direction of Travel */}
              <g ref={(n) => { (elementsRef.current[reg] ||= {}).rot = n; }}>
                <UberStyleTankerIcon isSelected={isSelected} />
              </g>

              {/* Floating Uber/Bolt Style Vehicle Badge */}
              <g transform="translate(0 -42)" className="pointer-events-none">
                <rect
                  x="-55"
                  y="-12"
                  width="110"
                  height="24"
                  rx="4"
                  fill={isSelected ? '#152e52' : '#ffffff'}
                  stroke={isSelected ? '#2e7d32' : '#bcd6ea'}
                  strokeWidth="1.5"
                  className="shadow-md"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  className={`font-bold text-[11px] font-mono ${isSelected ? 'fill-white' : 'fill-[#152e52]'}`}
                >
                  {reg} · {t.status === 'OnTrip' ? `${t.speedKmh || 35}km/h` : 'Standby'}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Top Header Map Controls Bar */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 shadow-xs">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#152e52]">
          <Truck className="w-4 h-4 text-[#1d70b8]" />
          <span>{activeTankers.length} Active Tankers</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#2e7d32]">
          <MapPin className="w-3.5 h-3.5 text-[#2e7d32]" />
          <span>{activeStops.length} Water Stops</span>
        </span>
        {activeSignalR && (
          <span className="ml-1 text-[10px] font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">
            LIVE GPS SYNC
          </span>
        )}
      </div>

      {/* Top Right Zoom Controls */}
      <div className="absolute top-3 right-3 flex flex-col bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <button
          onClick={() => handleZoom(zoomRef.current * 1.5)}
          className="p-2 text-slate-700 hover:bg-slate-100 border-b border-slate-200 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(zoomRef.current / 1.5)}
          className="p-2 text-slate-700 hover:bg-slate-100 border-b border-slate-200 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(1)}
          className="p-2 text-slate-700 hover:bg-slate-100 cursor-pointer"
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Stop Drawer Prompt */}
      {selectedStop && (
        <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-80 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-4 shadow-xl z-20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1d70b8] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Stop #{selectedStop.sequence} · {selectedStop.area}</span>
            </span>
            <button onClick={() => setSelectedStop(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
              ✕
            </button>
          </div>
          <h4 className="font-serif text-sm font-bold text-[#152e52]">{selectedStop.name}</h4>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Volume: <strong className="text-slate-800 font-mono">{selectedStop.volume}</strong></span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              selectedStop.status === 'Completed' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :
              selectedStop.status === 'In Delivery' ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' :
              'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {selectedStop.status}
            </span>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-md p-2.5 text-[11px] text-slate-700 shadow-xs hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#152e52]"></span>
          <span>Tankers (Uber Style)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]"></span>
          <span>Completed Stop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1d70b8]"></span>
          <span>In Delivery</span>
        </div>
      </div>
    </div>
  );
}

export default LiveMap;
