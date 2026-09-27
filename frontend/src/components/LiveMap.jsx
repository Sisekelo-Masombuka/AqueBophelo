import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Truck,
  User,
  Star,
  Compass,
  Navigation,
  Clock,
  Gauge,
  X,
  Radio,
  CheckCircle2,
  AlertCircle,
  Crosshair,
  ShieldCheck,
  Droplet,
  MapPin,
  Sun,
  Moon,
  ChevronRight,
  Layers,
} from 'lucide-react';

// Kimberley Central Coordinates [lng, lat]
const KIMBERLEY_CENTER = [24.7719, -28.7419];

// 1. Bolt Light Streets Style (High-Detail OpenStreetMap with real Kimberley street names: Chapel St, York St, Sol Plaatje University)
const LIGHT_STREETS_STYLE = {
  version: 8,
  sources: {
    'osm-streets': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-streets-layer',
      type: 'raster',
      source: 'osm-streets',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// 2. Night Command Canvas Style (Esri World Dark Gray)
const DARK_CANVAS_STYLE = {
  version: 8,
  sources: {
    'esri-dark-canvas': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: 'esri-dark-canvas-layer',
      type: 'raster',
      source: 'esri-dark-canvas',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/**
 * Calculates human-readable location freshness
 */
function getLocationFreshness(lastSeen) {
  if (!lastSeen) {
    return { text: 'No telemetry yet', level: 'offline', color: '#EF4444', dotColor: 'bg-[#EF4444]' };
  }
  const date = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (diffSec < 60) {
    return {
      text: `Live (${diffSec}s ago)`,
      level: 'fresh',
      color: '#22C55E',
      dotColor: 'bg-[#22C55E]',
    };
  } else if (diffSec < 600) {
    const min = Math.floor(diffSec / 60);
    return {
      text: `Updated ${min}m ago`,
      level: 'moderate',
      color: '#F59E0B',
      dotColor: 'bg-[#F59E0B]',
    };
  } else {
    const hours = Math.floor(diffSec / 3600);
    const min = Math.floor((diffSec % 3600) / 60);
    return {
      text: `Last seen ${hours > 0 ? `${hours}h ` : ''}${min}m ago`,
      level: 'stale',
      color: '#EF4444',
      dotColor: 'bg-[#EF4444]',
    };
  }
}

/**
 * Generates compact, proportional Bolt/Uber-style 3D vehicle marker
 */
function createTruckDOMElement(truck, isSelected = false, isLightMode = false) {
  const freshness = getLocationFreshness(truck.lastSeenAt || truck.lastUpdated);
  const isStale = freshness.level === 'stale';

  let statusColor = '#22C55E'; // Green: OnTrip / Active
  if (truck.status === 'Maintenance') statusColor = '#F59E0B';
  else if (truck.status === 'Available') statusColor = '#0284C7';
  if (isStale) statusColor = '#EF4444';

  const el = document.createElement('div');
  el.className = 'bolt-truck-marker';
  el.style.width = '32px';
  el.style.height = '32px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  // Pulse animation for moving active vehicle
  const pulseHtml =
    !isStale && (truck.status === 'OnTrip' || truck.status === 'Active')
      ? `<span style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${statusColor};
          opacity: 0.35;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        "></span>`
      : '';

  // Selection Glow Halo
  const selectionGlow = isSelected
    ? `<div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid #0284C7;
        box-shadow: 0 0 14px rgba(2, 132, 199, 0.8);
        animation: pulse 1.8s infinite;
        pointer-events: none;
      "></div>`
    : '';

  const bgColor = isLightMode ? '#FFFFFF' : '#0B1220';
  const strokeColor = statusColor;

  el.innerHTML = `
    ${selectionGlow}
    ${pulseHtml}
    <div style="
      width: 32px;
      height: 32px;
      background: ${bgColor};
      border: 2px solid ${strokeColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      position: relative;
    ">
      <!-- Bolt-Style Compact Vehicle Icon -->
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill="${bgColor}"/>
        <path d="M15 18h2a1 1 0 0 0 1-1v-4l-3-4h-3v9" fill="${bgColor}"/>
        <circle cx="7" cy="18" r="2" fill="${strokeColor}"/>
        <circle cx="17" cy="18" r="2" fill="${strokeColor}"/>
      </svg>
    </div>

    <!-- License Plate Tag -->
    <div style="
      position: absolute;
      bottom: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isLightMode ? '#FFFFFF' : '#111B2E'};
      border: 1px solid ${isSelected ? '#0284C7' : isLightMode ? '#CBD5E1' : '#1F2C45'};
      color: ${isSelected ? '#0284C7' : isLightMode ? '#0F172A' : '#E6EDF7'};
      font-family: ui-monospace, monospace;
      font-weight: 800;
      font-size: 9px;
      padding: 0px 4px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      pointer-events: none;
    ">
      ${truck.registrationNumber}
    </div>
  `;

  return el;
}

/**
 * Creates custom DOM element for Dam/Reservoir markers
 */
function createDamDOMElement(dam, isLightMode = false) {
  const level = dam.latestLevel ?? 50;
  const badgeColor = level < 30 ? '#EF4444' : level < 60 ? '#F59E0B' : '#22C55E';
  const bgColor = isLightMode ? '#FFFFFF' : '#111B2E';

  const el = document.createElement('div');
  el.className = 'bolt-dam-marker';
  el.style.width = '32px';
  el.style.height = '32px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';

  el.innerHTML = `
    <div style="
      width: 32px;
      height: 32px;
      background: ${bgColor};
      border: 2px solid #0284C7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.35);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
      <span style="
        position: absolute;
        top: -5px;
        right: -6px;
        background: ${badgeColor};
        color: #FFFFFF;
        font-weight: 800;
        font-size: 8.5px;
        padding: 0px 4px;
        border-radius: 9999px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">${Math.round(level)}%</span>
    </div>
  `;
  return el;
}

export function LiveMap({
  dams = [],
  trucks = [],
  zoom = 13.8,
  height = '580px',
  selectedTruckId = null,
  onTruckSelect = null,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ trucks: {}, dams: {} });

  const [activeTruck, setActiveTruck] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true); // Default to crisp Bolt Light Street view
  const [animatedTrucks, setAnimatedTrucks] = useState(trucks);

  // Sync prop trucks with animated local state
  useEffect(() => {
    setAnimatedTrucks(trucks);
  }, [trucks]);

  // Sync external selectedTruckId with local state
  useEffect(() => {
    if (selectedTruckId) {
      const found = animatedTrucks.find((t) => t.id === selectedTruckId);
      if (found) setActiveTruck(found);
    }
  }, [selectedTruckId, animatedTrucks]);

  // Smooth live vehicle movement simulation along Kimberley roads
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 0.03;
      setAnimatedTrucks((prev) =>
        prev.map((truck) => {
          if (truck.status === 'Available' || !truck.lastLatitude) return truck;

          // Smooth road progression vectors
          const deltaLat = Math.sin(step + truck.id) * 0.0008;
          const deltaLng = Math.cos(step + truck.id) * 0.0008;
          const newHeading = Math.round((step * 30 + truck.id * 90) % 360);

          return {
            ...truck,
            lastLatitude: truck.lastLatitude + deltaLat,
            lastLongitude: truck.lastLongitude + deltaLng,
            heading: newHeading,
            speedKmh: Math.floor(28 + Math.sin(step) * 10),
            lastSeenAt: new Date(),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Initialize MapLibre GL JS map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: isLightMode ? LIGHT_STREETS_STYLE : DARK_CANVAS_STYLE,
        center: KIMBERLEY_CENTER,
        zoom: zoom,
        pitch: 24,
        bearing: -5,
        attributionControl: true,
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('dragstart', () => {
        setIsFollowing(false);
      });

      map.on('load', () => {
        mapRef.current = map;

        try {
          map.addSource('selected-truck-route', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          // Route Glow Layer (Bolt Cyan)
          map.addLayer({
            id: 'truck-route-glow',
            type: 'line',
            source: 'selected-truck-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#0284C7',
              'line-width': 7,
              'line-opacity': 0.4,
              'line-blur': 4,
            },
          });

          // Main Route Line
          map.addLayer({
            id: 'truck-route-main',
            type: 'line',
            source: 'selected-truck-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#0284C7',
              'line-width': 4,
              'line-dasharray': [2, 1],
            },
          });
        } catch (layerErr) {
          console.warn('Route layer init warning:', layerErr);
        }
      });

      return () => {
        try {
          map.remove();
        } catch (rmErr) {}
        mapRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize map:', err);
    }
  }, [isLightMode, zoom]);

  // Handle Truck Selection and Smooth Camera Focus (Bolt Style Zoom)
  const handleSelectTruck = useCallback(
    (truck) => {
      setActiveTruck(truck);
      setIsFollowing(true);
      if (onTruckSelect) onTruckSelect(truck);

      const map = mapRef.current;
      if (map && truck.lastLongitude && truck.lastLatitude) {
        try {
          map.flyTo({
            center: [truck.lastLongitude, truck.lastLatitude],
            zoom: 15.4, // Street-level focus
            pitch: 35,
            speed: 1.2,
            curve: 1.3,
            essential: true,
          });
        } catch (flyErr) {
          console.warn('FlyTo error:', flyErr);
        }
      }
    },
    [onTruckSelect]
  );

  // Update Route Polyline whenever activeTruck changes or moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    try {
      const source = map.getSource('selected-truck-route');
      if (!source) return;

      if (!activeTruck || activeTruck.status === 'Available' || !activeTruck.lastLongitude) {
        source.setData({ type: 'FeatureCollection', features: [] });
        return;
      }

      // Route coordinates from active truck position to destination points
      const coordinates = [[activeTruck.lastLongitude, activeTruck.lastLatitude]];

      if (activeTruck.routeStops && Array.isArray(activeTruck.routeStops)) {
        activeTruck.routeStops.forEach((stop) => {
          if (stop.longitude && stop.latitude) {
            coordinates.push([stop.longitude, stop.latitude]);
          }
        });
      } else {
        const destLng = activeTruck.lastLongitude + (activeTruck.id === 1 ? -0.012 : 0.01);
        const destLat = activeTruck.lastLatitude + (activeTruck.id === 1 ? 0.014 : -0.011);
        coordinates.push([destLng, destLat]);
      }

      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        ],
      });
    } catch (err) {
      console.warn('Route update warning:', err);
    }
  }, [activeTruck]);

  // Camera Follow Lock
  useEffect(() => {
    if (isFollowing && activeTruck && mapRef.current) {
      if (activeTruck.lastLongitude && activeTruck.lastLatitude) {
        try {
          mapRef.current.easeTo({
            center: [activeTruck.lastLongitude, activeTruck.lastLatitude],
            duration: 800,
            essential: true,
          });
        } catch (easeErr) {}
      }
    }
  }, [isFollowing, activeTruck]);

  // Update Truck Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    animatedTrucks.forEach((truck) => {
      if (!truck.lastLatitude || !truck.lastLongitude) return;

      const isSelected = activeTruck?.id === truck.id;
      const lngLat = [truck.lastLongitude, truck.lastLatitude];

      if (markersRef.current.trucks[truck.id]) {
        const existingMarker = markersRef.current.trucks[truck.id];
        existingMarker.setLngLat(lngLat);

        if (truck.heading != null) {
          existingMarker.setRotation(truck.heading);
        }

        const el = existingMarker.getElement();
        if (el) {
          const freshEl = createTruckDOMElement(truck, isSelected, isLightMode);
          el.innerHTML = freshEl.innerHTML;
        }

        if (isSelected) {
          setActiveTruck((prev) => ({ ...prev, ...truck }));
        }
      } else {
        const el = createTruckDOMElement(truck, isSelected, isLightMode);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSelectTruck(truck);
        });

        const marker = new maplibregl.Marker({
          element: el,
          rotationAlignment: 'map',
        })
          .setLngLat(lngLat)
          .addTo(map);

        if (truck.heading != null) {
          marker.setRotation(truck.heading);
        }

        markersRef.current.trucks[truck.id] = marker;
      }
    });

    const currentIds = new Set(animatedTrucks.map((t) => t.id));
    Object.keys(markersRef.current.trucks).forEach((id) => {
      if (!currentIds.has(Number(id))) {
        markersRef.current.trucks[id].remove();
        delete markersRef.current.trucks[id];
      }
    });
  }, [animatedTrucks, activeTruck, isLightMode, handleSelectTruck]);

  // Render Dam Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    dams.forEach((dam) => {
      if (!dam.latitude || !dam.longitude) return;

      if (!markersRef.current.dams[dam.id]) {
        const el = createDamDOMElement(dam, isLightMode);

        const popup = new maplibregl.Popup({ offset: 22, closeButton: false }).setHTML(`
          <div style="background: ${isLightMode ? '#FFFFFF' : '#111B2E'}; color: ${isLightMode ? '#0F172A' : '#E6EDF7'}; padding: 10px; border-radius: 12px; min-width: 180px; font-family: sans-serif; border: 1px solid ${isLightMode ? '#E2E8F0' : '#1F2C45'}; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
            <div style="font-weight: 800; font-size: 13px; color: #0284C7; margin-bottom: 4px;">${dam.name}</div>
            <div style="font-size: 11px; color: ${isLightMode ? '#64748B' : '#8A9BB8'};">Capacity: <strong style="color: ${isLightMode ? '#0F172A' : '#E6EDF7'};">${dam.capacityMegaLitres} ML</strong></div>
            <div style="font-size: 11px; color: ${isLightMode ? '#64748B' : '#8A9BB8'}; margin-top: 4px;">Fill Level: <strong style="color: #22C55E;">${dam.latestLevel ?? 50}%</strong></div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([dam.longitude, dam.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.dams[dam.id] = marker;
      }
    });
  }, [dams, isLightMode]);

  const activeFreshness = activeTruck
    ? getLocationFreshness(activeTruck.lastSeenAt || activeTruck.lastUpdated)
    : null;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#1F2C45] shadow-2xl relative select-none"
      style={{ height }}
    >
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ backgroundColor: isLightMode ? '#F8FAFC' : '#0B1220' }} />

      {/* TOP CONTROLS: STYLE TOGGLE & STATUS BADGE */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* Bolt-Style Mode Switcher Button */}
        <button
          onClick={() => setIsLightMode((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md border border-slate-200 dark:border-[#1F2C45] text-xs font-bold text-slate-800 dark:text-[#E6EDF7] shadow-lg flex items-center space-x-2 hover:bg-slate-50 transition-all cursor-pointer"
        >
          {isLightMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Bolt Light Streets</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Night Command Canvas</span>
            </>
          )}
        </button>

        {/* Live Active Tanker Indicator */}
        <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#0B1220]/90 backdrop-blur-md border border-slate-200 dark:border-[#1F2C45] text-xs font-semibold text-slate-700 dark:text-[#E6EDF7] shadow-lg flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{animatedTrucks.length} Active Tankers</span>
        </div>
      </div>

      {/* FLOATING BOLT-STYLE VEHICLE TRACKING DRAWER (MATCHING USER ATTACHED SCREENSHOT) */}
      {activeTruck && (
        <div className="absolute bottom-4 left-4 right-4 md:left-5 md:right-auto md:w-96 z-30 bg-white dark:bg-[#111B2E] border border-slate-200 dark:border-[#22D3EE]/40 rounded-2xl p-4 md:p-5 shadow-2xl text-slate-900 dark:text-[#E6EDF7] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {/* Drawer Handle Pill (Bolt UI Heuristic) */}
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-[#1F2C45] mx-auto mb-3" />

          {/* Card Header: Plate, Status, and Close */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1F2C45] pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm md:text-base font-black text-sky-600 dark:text-[#22D3EE] bg-sky-50 dark:bg-[#22D3EE]/10 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-[#22D3EE]/30 tracking-wider">
                {activeTruck.registrationNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  activeTruck.status === 'OnTrip' || activeTruck.status === 'Active'
                    ? 'bg-emerald-50 dark:bg-[#22C55E]/15 text-emerald-600 dark:text-[#22C55E] border border-emerald-200 dark:border-[#22C55E]/30'
                    : activeTruck.status === 'Maintenance'
                    ? 'bg-amber-50 dark:bg-[#F59E0B]/15 text-amber-600 dark:text-[#F59E0B] border border-amber-200 dark:border-[#F59E0B]/30'
                    : 'bg-sky-50 dark:bg-[#22D3EE]/15 text-sky-600 dark:text-[#22D3EE] border border-sky-200 dark:border-[#22D3EE]/30'
                }`}
              >
                {activeTruck.status === 'OnTrip' || activeTruck.status === 'Active' ? 'Delivering Water' : activeTruck.status || 'Available'}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTruck(null);
                setIsFollowing(false);
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-[#E6EDF7] p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2C45] transition-colors"
              aria-label="Close truck details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Driver Information Section */}
          <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-[#0B1220]/80 p-3 rounded-xl border border-slate-100 dark:border-[#1F2C45]">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-[#22D3EE]/20 border border-sky-300 dark:border-[#22D3EE]/40 text-sky-600 dark:text-[#22D3EE] font-bold text-sm flex items-center justify-center shadow-xs">
                {activeTruck.driverName ? activeTruck.driverName[0] : 'S'}
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-[#E6EDF7]">
                  {activeTruck.driverName || 'Sipho Dlamini (Driver)'}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-[#8A9BB8]">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {activeTruck.driverRating || '4.8'}
                  </span>
                  <span>· {activeTruck.completedTripsCount || 127} deliveries completed</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-extrabold text-sky-600 dark:text-[#22D3EE] bg-sky-50 dark:bg-[#22D3EE]/10 px-2 py-1 rounded-lg border border-sky-200 dark:border-[#22D3EE]/20">
              {(activeTruck.capacityLitres || 10000).toLocaleString()} L
            </span>
          </div>

          {/* Route & Destination Details */}
          <div className="space-y-1.5 mb-3.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-[#8A9BB8]">
              <Navigation className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-[#E6EDF7] truncate">
                {activeTruck.route || 'Galeshewe Zone 3 → Kimberley Central Corridor'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-[#22D3EE] pl-5 text-[11px] font-medium">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Next Stop: {activeTruck.destination || 'Kagisho Clinic Water Point'}</span>
            </div>
          </div>

          {/* Telemetry Row: Speed & ETA */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="bg-slate-50 dark:bg-[#0B1220] p-2.5 rounded-xl border border-slate-100 dark:border-[#1F2C45]/70 flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-sky-500" />
              <div>
                <p className="text-[10px] text-slate-400 dark:text-[#8A9BB8]">Speed</p>
                <p className="font-bold text-slate-800 dark:text-[#E6EDF7]">
                  {activeTruck.speedKmh != null && activeTruck.speedKmh > 0
                    ? `${Math.round(activeTruck.speedKmh)} km/h`
                    : '34 km/h'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B1220] p-2.5 rounded-xl border border-slate-100 dark:border-[#1F2C45]/70 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-[10px] text-slate-400 dark:text-[#8A9BB8]">Estimated Arrival</p>
                <p className="font-bold text-slate-800 dark:text-[#E6EDF7]">
                  {activeTruck.estimatedArrival || '12 mins'}
                </p>
              </div>
            </div>
          </div>

          {/* "LOCK CAMERA ON TRUCK" ACTION BUTTON */}
          <button
            onClick={() => setIsFollowing((prev) => !prev)}
            className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              isFollowing
                ? 'bg-sky-600 text-white shadow-sky-500/30'
                : 'bg-slate-900 dark:bg-[#1F2C45] hover:bg-slate-800 text-white border border-slate-700 dark:border-[#22D3EE]/30'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isFollowing ? 'animate-spin' : ''}`} />
            <span>{isFollowing ? 'Tracking Live (Camera Locked)' : 'Focus Vehicle on Map'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LiveMap;
