import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  ExternalLink,
} from 'lucide-react';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  (typeof window !== 'undefined' ? localStorage.getItem('aquabophelo_mapbox_token') : '') ||
  '';

// Kimberley Central Coordinates [lng, lat]
const KIMBERLEY_CENTER = [24.7719, -28.7419];

/**
 * Calculates human-readable location freshness with color-coded status
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
      text: `Updated ${diffSec}s ago`,
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
 * Generates custom SVG element for a recognizable water tanker marker
 */
function createTruckDOMElement(truck, isSelected = false) {
  const freshness = getLocationFreshness(truck.lastSeenAt || truck.lastUpdated);
  const isStale = freshness.level === 'stale';

  let statusColor = '#22C55E'; // Green: OnTrip / Active
  let badgeLabel = 'On Trip';

  if (truck.status === 'Maintenance') {
    statusColor = '#F59E0B'; // Amber
    badgeLabel = 'Maint';
  } else if (truck.status === 'Available') {
    statusColor = '#22D3EE'; // Cyan
    badgeLabel = 'Available';
  }

  if (isStale) {
    statusColor = '#EF4444'; // Red if telemetry is stale
    badgeLabel = 'Offline';
  }

  const el = document.createElement('div');
  el.className = 'aque-truck-marker';
  el.style.width = '48px';
  el.style.height = '48px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.25s ease-out';

  // Selection Glow Halo
  const selectionGlow = isSelected
    ? `<div style="
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid #22D3EE;
        box-shadow: 0 0 18px #22D3EE;
        animation: pulse 1.8s infinite;
        pointer-events: none;
      "></div>`
    : '';

  // Pulsing live wave for active fresh trucks
  const livePulse =
    !isStale && (truck.status === 'OnTrip' || truck.status === 'Active')
      ? `<span style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${statusColor};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        "></span>`
      : '';

  el.innerHTML = `
    ${selectionGlow}
    ${livePulse}
    <div style="
      width: 48px;
      height: 48px;
      background: #0B1220;
      border: 2.5px solid ${statusColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7);
      position: relative;
    ">
      <!-- Water Tanker SVG Icon -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="14" height="13" rx="2" fill="#111B2E" />
        <polygon points="15 8 19 8 22 11 22 16 15 16 15 8" fill="#111B2E" />
        <circle cx="5.5" cy="18.5" r="2.5" fill="#0B1220" />
        <circle cx="18.5" cy="18.5" r="2.5" fill="#0B1220" />
      </svg>

      <!-- Mini Status Dot -->
      <span style="
        position: absolute;
        top: -2px;
        right: -2px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: ${statusColor};
        border: 2px solid #0B1220;
      "></span>
    </div>

    <!-- Registration plate pill below marker -->
    <div style="
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      background: #111B2E;
      border: 1px solid ${isSelected ? '#22D3EE' : '#1F2C45'};
      color: ${isSelected ? '#22D3EE' : '#E6EDF7'};
      font-family: monospace;
      font-weight: 800;
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
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
function createDamDOMElement(dam) {
  const level = dam.latestLevel ?? 50;
  const badgeColor = level < 30 ? '#EF4444' : level < 60 ? '#F59E0B' : '#22C55E';

  const el = document.createElement('div');
  el.className = 'aque-dam-marker';
  el.style.width = '36px';
  el.style.height = '36px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';

  el.innerHTML = `
    <div style="
      width: 36px;
      height: 36px;
      background: #111B2E;
      border: 2px solid #22D3EE;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(34, 211, 238, 0.4);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
      <span style="
        position: absolute;
        top: -6px;
        right: -8px;
        background: ${badgeColor};
        color: #0B1220;
        font-weight: 800;
        font-size: 9px;
        padding: 1px 4px;
        border-radius: 9999px;
      ">${Math.round(level)}%</span>
    </div>
  `;
  return el;
}

export function LiveMap({
  dams = [],
  trucks = [],
  zoom = 12.5,
  height = '540px',
  selectedTruckId = null,
  onTruckSelect = null,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ trucks: {}, dams: {} });

  const [activeTruck, setActiveTruck] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [freshnessTime, setFreshnessTime] = useState(Date.now());

  // Keep freshness clock ticking every 3 seconds for live relative time
  useEffect(() => {
    const timer = setInterval(() => setFreshnessTime(Date.now()), 3000);
    return () => clearInterval(timer);
  }, []);

  // Sync external selectedTruckId with local state
  useEffect(() => {
    if (selectedTruckId) {
      const found = trucks.find((t) => t.id === selectedTruckId);
      if (found) setActiveTruck(found);
    }
  }, [selectedTruckId, trucks]);

  // Initialize Mapbox GL JS map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: KIMBERLEY_CENTER,
      zoom: zoom,
      pitch: 32,
      bearing: -8,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    // If user starts panning/dragging the map, gracefully disable follow mode (Uber style)
    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    map.on('load', () => {
      mapRef.current = map;

      // Add GeoJSON source and glowing layer for route polyline
      map.addSource('selected-truck-route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Route Glow Outline Layer
      map.addLayer({
        id: 'truck-route-glow',
        type: 'line',
        source: 'selected-truck-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#22D3EE',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 6,
        },
      });

      // Route Main Directional Line Layer
      map.addLayer({
        id: 'truck-route-main',
        type: 'line',
        source: 'selected-truck-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#22D3EE',
          'line-width': 3.5,
          'line-dasharray': [1.5, 1],
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [zoom]);

  // Handle Truck Selection and Smooth Camera Focus
  const handleSelectTruck = useCallback(
    (truck) => {
      setActiveTruck(truck);
      if (onTruckSelect) onTruckSelect(truck);

      const map = mapRef.current;
      if (map && truck.lastLongitude && truck.lastLatitude) {
        map.flyTo({
          center: [truck.lastLongitude, truck.lastLatitude],
          zoom: 14.2,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
      }
    },
    [onTruckSelect]
  );

  // Update Route Polyline whenever activeTruck changes or moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('selected-truck-route');
    if (!source) return;

    if (!activeTruck || activeTruck.status === 'Available' || !activeTruck.lastLongitude) {
      source.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    // Waypoints from current truck coordinate towards destination stops
    const coordinates = [
      [activeTruck.lastLongitude, activeTruck.lastLatitude],
    ];

    if (activeTruck.routeStops && Array.isArray(activeTruck.routeStops)) {
      activeTruck.routeStops.forEach((stop) => {
        if (stop.longitude && stop.latitude) {
          coordinates.push([stop.longitude, stop.latitude]);
        }
      });
    } else if (activeTruck.destinationCoordinates) {
      coordinates.push(activeTruck.destinationCoordinates);
    } else {
      // Default corridor to showcase connection towards destination zone
      const destLng = activeTruck.lastLongitude + (activeTruck.id === 1 ? -0.015 : 0.012);
      const destLat = activeTruck.lastLatitude + (activeTruck.id === 1 ? 0.018 : -0.014);
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
  }, [activeTruck]);

  // Follow Mode: Smoothly ease camera to active truck when coordinates update
  useEffect(() => {
    if (isFollowing && activeTruck && mapRef.current) {
      if (activeTruck.lastLongitude && activeTruck.lastLatitude) {
        mapRef.current.easeTo({
          center: [activeTruck.lastLongitude, activeTruck.lastLatitude],
          duration: 900,
          essential: true,
        });
      }
    }
  }, [isFollowing, activeTruck]);

  // Update & Render Truck Markers (Strict single-marker per truck guarantee)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    trucks.forEach((truck) => {
      if (!truck.lastLatitude || !truck.lastLongitude) return;

      const isSelected = activeTruck?.id === truck.id;
      const lngLat = [truck.lastLongitude, truck.lastLatitude];

      if (markersRef.current.trucks[truck.id]) {
        // Update existing marker position, heading, and selection appearance
        const existingMarker = markersRef.current.trucks[truck.id];
        existingMarker.setLngLat(lngLat);

        if (truck.heading != null) {
          existingMarker.setRotation(truck.heading);
        }

        // Update DOM highlight if selection status changed
        const el = existingMarker.getElement();
        if (el) {
          const freshEl = createTruckDOMElement(truck, isSelected);
          el.innerHTML = freshEl.innerHTML;
        }

        // If this truck is currently active, sync its telemetry in state
        if (isSelected) {
          setActiveTruck((prev) => ({ ...prev, ...truck }));
        }
      } else {
        // Create new single marker for this truck
        const el = createTruckDOMElement(truck, isSelected);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSelectTruck(truck);
        });

        const marker = new mapboxgl.Marker({
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

    // Clean up any markers for trucks no longer present
    const currentIds = new Set(trucks.map((t) => t.id));
    Object.keys(markersRef.current.trucks).forEach((id) => {
      if (!currentIds.has(Number(id))) {
        markersRef.current.trucks[id].remove();
        delete markersRef.current.trucks[id];
      }
    });
  }, [trucks, activeTruck, handleSelectTruck]);

  // Render Dam Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    dams.forEach((dam) => {
      if (!dam.latitude || !dam.longitude) return;

      if (!markersRef.current.dams[dam.id]) {
        const el = createDamDOMElement(dam);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background: #111B2E; color: #E6EDF7; padding: 10px; border-radius: 10px; min-width: 180px; font-family: sans-serif; border: 1px solid #1F2C45;">
            <div style="font-weight: bold; font-size: 13px; color: #22D3EE; margin-bottom: 4px;">${dam.name}</div>
            <div style="font-size: 11px; color: #8A9BB8;">Capacity: <strong style="color: #E6EDF7;">${dam.capacityMegaLitres} ML</strong></div>
            <div style="font-size: 11px; color: #8A9BB8; margin-top: 4px;">Current Level: <strong style="color: #22C55E;">${dam.latestLevel ?? 50}%</strong></div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([dam.longitude, dam.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.dams[dam.id] = marker;
      }
    });
  }, [dams]);

  const activeFreshness = activeTruck
    ? getLocationFreshness(activeTruck.lastSeenAt || activeTruck.lastUpdated)
    : null;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-[#1F2C45] shadow-2xl relative select-none"
      style={{ height }}
    >
      {/* Mapbox Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ backgroundColor: '#0B1220' }} />

      {/* Top Left: Map Status Indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <div className="px-3 py-1.5 rounded-xl bg-[#0B1220]/90 backdrop-blur-md border border-[#1F2C45] text-xs font-semibold text-[#E6EDF7] shadow-xl flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          <span>Mapbox GL Vector Engine</span>
          <span className="text-[#8A9BB8]">·</span>
          <span className="text-[#22D3EE] font-mono">{trucks.length} Trucks</span>
        </div>
      </div>

      {/* FLOATING UBER/BOLT-STYLE TRUCK INFORMATION CARD */}
      {activeTruck && (
        <div className="absolute bottom-5 left-4 right-4 md:left-5 md:right-auto md:w-96 z-30 bg-[#111B2E]/95 backdrop-blur-xl border border-[#22D3EE]/40 rounded-2xl p-4 md:p-5 shadow-2xl text-[#E6EDF7] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {/* Card Header: Plate, Status, and Close */}
          <div className="flex items-center justify-between border-b border-[#1F2C45] pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm md:text-base font-black text-[#22D3EE] bg-[#22D3EE]/10 px-2.5 py-1 rounded-lg border border-[#22D3EE]/30 tracking-wider">
                {activeTruck.registrationNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTruck.status === 'OnTrip' || activeTruck.status === 'Active'
                    ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                    : activeTruck.status === 'Maintenance'
                    ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                    : 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30'
                }`}
              >
                {activeTruck.status || 'Available'}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTruck(null);
                setIsFollowing(false);
              }}
              className="text-[#8A9BB8] hover:text-[#E6EDF7] p-1 rounded-lg hover:bg-[#1F2C45] transition-colors"
              aria-label="Close truck details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Driver Information Section */}
          <div className="flex items-center justify-between mb-3 bg-[#0B1220]/80 p-3 rounded-xl border border-[#1F2C45]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-xs flex items-center justify-center">
                {activeTruck.driverName ? activeTruck.driverName[0] : 'T'}
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-[#E6EDF7]">
                  {activeTruck.driverName || 'Municipal Depot Standby'}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-[#8A9BB8]">
                  {activeTruck.driverRating ? (
                    <span className="flex items-center text-[#F59E0B] font-bold">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      {activeTruck.driverRating}
                    </span>
                  ) : null}
                  {activeTruck.completedTripsCount != null && (
                    <span>· {activeTruck.completedTripsCount} trips completed</span>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-[#8A9BB8]">
              {activeTruck.capacityLitres?.toLocaleString() || 10000} L Tank
            </span>
          </div>

          {/* Route & Destination */}
          <div className="space-y-1.5 mb-3 text-xs">
            <div className="flex items-center space-x-2 text-[#8A9BB8]">
              <Navigation className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
              <span className="text-[#E6EDF7] font-medium truncate">
                {activeTruck.route || 'Kimberley Central Distribution Corridor'}
              </span>
            </div>
            {activeTruck.destination && (
              <p className="text-[11px] text-[#22D3EE] pl-5 font-semibold">
                Destination: {activeTruck.destination}
              </p>
            )}
          </div>

          {/* Telemetry Row: Speed, ETA, Freshness Pill */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="bg-[#0B1220] p-2 rounded-lg border border-[#1F2C45]/70 flex items-center space-x-2">
              <Gauge className="w-3.5 h-3.5 text-[#22D3EE]" />
              <div>
                <p className="text-[10px] text-[#8A9BB8]">Current Speed</p>
                <p className="font-bold text-[#E6EDF7]">
                  {activeTruck.speedKmh != null && activeTruck.speedKmh > 0
                    ? `${Math.round(activeTruck.speedKmh)} km/h`
                    : 'Stationary'}
                </p>
              </div>
            </div>

            <div className="bg-[#0B1220] p-2 rounded-lg border border-[#1F2C45]/70 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
              <div>
                <p className="text-[10px] text-[#8A9BB8]">Estimated Arrival</p>
                <p className="font-bold text-[#E6EDF7]">
                  {activeTruck.estimatedArrival || (activeTruck.status === 'OnTrip' ? '15 mins' : 'Standby')}
                </p>
              </div>
            </div>
          </div>

          {/* Freshness Status Pill */}
          <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#1F2C45] mb-4">
            <span className="text-[#8A9BB8]">Telemetry Freshness:</span>
            <div className="flex items-center space-x-1.5 font-semibold" style={{ color: activeFreshness?.color }}>
              <span className={`w-2 h-2 rounded-full ${activeFreshness?.dotColor} animate-pulse`} />
              <span>{activeFreshness?.text}</span>
            </div>
          </div>

          {/* "TRACK TRUCK" (FOLLOW MODE) ACTION BUTTON */}
          <button
            onClick={() => setIsFollowing((prev) => !prev)}
            className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
              isFollowing
                ? 'bg-[#22D3EE] text-[#0B1220] shadow-[#22D3EE]/30'
                : 'bg-[#1F2C45] hover:bg-[#2A3B5C] text-[#E6EDF7] border border-[#22D3EE]/30'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isFollowing ? 'animate-spin' : ''}`} />
            <span>{isFollowing ? 'Tracking Live (Camera Locked)' : 'Track Truck on Map'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LiveMap;
