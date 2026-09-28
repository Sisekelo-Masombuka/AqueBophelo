import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Star,
  Navigation,
  Clock,
  Gauge,
  X,
  Crosshair,
  MapPin,
  Sun,
  Moon,
} from 'lucide-react';

const KIMBERLEY_CENTER = [24.7719, -28.7419];

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

function getLocationFreshness(lastSeen) {
  if (!lastSeen) {
    return { text: 'No telemetry yet', level: 'offline', color: '#b91c1c', dotColor: 'bg-red-600' };
  }
  const date = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (diffSec < 60) {
    return {
      text: `Live (${diffSec}s ago)`,
      level: 'fresh',
      color: '#2e9e4f',
      dotColor: 'bg-brand-green',
    };
  } else if (diffSec < 600) {
    const min = Math.floor(diffSec / 60);
    return {
      text: `Updated ${min}m ago`,
      level: 'moderate',
      color: '#b45309',
      dotColor: 'bg-amber-600',
    };
  } else {
    const hours = Math.floor(diffSec / 3600);
    const min = Math.floor((diffSec % 3600) / 60);
    return {
      text: `Last seen ${hours > 0 ? `${hours}h ` : ''}${min}m ago`,
      level: 'stale',
      color: '#b91c1c',
      dotColor: 'bg-red-600',
    };
  }
}

function createTruckDOMElement(truck, isSelected = false, isLightMode = true) {
  const freshness = getLocationFreshness(truck.lastSeenAt || truck.lastUpdated);
  const isStale = freshness.level === 'stale';

  let statusColor = '#2e9e4f'; // Brand green
  if (truck.status === 'Maintenance') statusColor = '#b45309';
  else if (truck.status === 'Available') statusColor = '#0e4c8c';
  if (isStale) statusColor = '#b91c1c';

  const el = document.createElement('div');
  el.className = 'ab-truck-marker';
  el.style.width = '38px';
  el.style.height = '38px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

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

  const selectionGlow = isSelected
    ? `<div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid #0e4c8c;
        box-shadow: 0 0 12px rgba(14, 76, 140, 0.6);
        pointer-events: none;
      "></div>`
    : '';

  el.innerHTML = `
    ${selectionGlow}
    ${pulseHtml}
    <div style="
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 3px 6px rgba(14, 76, 140, 0.3));
      position: relative;
    ">
      <img src="/truck_pin_badge.svg" alt="Water Tanker ${truck.registrationNumber}" style="width: 38px; height: 38px; object-fit: contain;" />
    </div>

    <!-- Registration Plate -->
    <div style="
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      background: #FFFFFF;
      border: 1px solid ${isSelected ? '#0e4c8c' : '#d4e4ef'};
      color: ${isSelected ? '#0e4c8c' : '#0a2a4f'};
      font-family: ui-monospace, monospace;
      font-weight: 800;
      font-size: 9.5px;
      padding: 1px 5px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(10,42,79,0.15);
      pointer-events: none;
    ">
      ${truck.registrationNumber}
    </div>
  `;

  return el;
}

function createDamDOMElement(dam, isLightMode = true) {
  const level = dam.latestLevel ?? 50;

  let damMarkerSvg = '/dam_marker_healthy.svg';
  let badgeBg = '#2e9e4f';

  if (level < 15) {
    damMarkerSvg = '/dam_marker_critical.svg';
    badgeBg = '#b91c1c';
  } else if (level < 30) {
    damMarkerSvg = '/dam_marker_low.svg';
    badgeBg = '#b91c1c';
  } else if (level < 60) {
    damMarkerSvg = '/dam_marker_watch.svg';
    badgeBg = '#b45309';
  } else {
    damMarkerSvg = '/dam_marker_healthy.svg';
    badgeBg = '#2e9e4f';
  }

  const el = document.createElement('div');
  el.className = 'ab-dam-marker';
  el.style.width = '38px';
  el.style.height = '38px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';

  el.innerHTML = `
    <div style="
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 3px 6px rgba(10, 42, 79, 0.25));
      position: relative;
    ">
      <img src="${damMarkerSvg}" alt="${dam.name}" style="width: 38px; height: 38px; object-fit: contain;" />
      <span style="
        position: absolute;
        top: -4px;
        right: -6px;
        background: ${badgeBg};
        color: #FFFFFF;
        font-weight: 800;
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 9999px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      ">${Math.round(level)}%</span>
    </div>
  `;
  return el;
}

const ROAD_ROUTES = {
  1: [
    [24.7685, -28.7485],
    [24.7700, -28.7420],
    [24.7675, -28.7395],
    [24.7645, -28.7360],
    [24.7580, -28.7315],
    [24.7510, -28.7270],
    [24.7430, -28.7210],
    [24.7350, -28.7145],
    [24.7260, -28.7065],
    [24.7180, -28.6975],
  ],
  2: [
    [24.7725, -28.7425],
    [24.7660, -28.7405],
    [24.7585, -28.7355],
    [24.7505, -28.7305],
    [24.7435, -28.7255],
    [24.7365, -28.7210],
    [24.7295, -28.7160],
  ],
  3: [
    [24.7612, -28.7511],
    [24.7655, -28.7535],
    [24.7695, -28.7475],
    [24.7680, -28.7410],
    [24.7645, -28.7365],
  ],
};

function calculateHeading(fromLng, fromLat, toLng, toLat) {
  const dLng = toLng - fromLng;
  const dLat = toLat - fromLat;
  const angleRad = Math.atan2(dLng, dLat);
  const deg = Math.round((angleRad * 180) / Math.PI);
  return (deg + 360) % 360;
}

export function LiveMap({
  dams = [],
  trucks = [],
  zoom = 13.8,
  height = '560px',
  selectedTruckId = null,
  onTruckSelect = null,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ trucks: {}, dams: {} });

  const [activeTruck, setActiveTruck] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const [animatedTrucks, setAnimatedTrucks] = useState(trucks);

  const movementStateRef = useRef({});

  useEffect(() => {
    setAnimatedTrucks(trucks);
  }, [trucks]);

  useEffect(() => {
    if (selectedTruckId) {
      const found = animatedTrucks.find((t) => t.id === selectedTruckId);
      if (found) setActiveTruck(found);
    }
  }, [selectedTruckId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTrucks((prevTrucks) =>
        prevTrucks.map((truck) => {
          if (truck.status === 'Available' || !truck.lastLatitude) return truck;

          const routePoints = ROAD_ROUTES[truck.id] || ROAD_ROUTES[1];
          const numSegments = routePoints.length - 1;

          if (!movementStateRef.current[truck.id]) {
            movementStateRef.current[truck.id] = {
              segmentIndex: (truck.id - 1) % numSegments,
              progress: 0.1,
              direction: 1,
            };
          }

          const state = movementStateRef.current[truck.id];
          state.progress += 0.04;

          if (state.progress >= 1.0) {
            state.progress = 0.0;
            state.segmentIndex += state.direction;

            if (state.segmentIndex >= numSegments) {
              state.segmentIndex = numSegments - 1;
              state.direction = -1;
            } else if (state.segmentIndex < 0) {
              state.segmentIndex = 0;
              state.direction = 1;
            }
          }

          const fromPoint = routePoints[state.segmentIndex];
          const nextIndex = state.segmentIndex + state.direction;
          const toPoint = routePoints[nextIndex >= 0 && nextIndex < routePoints.length ? nextIndex : state.segmentIndex];

          const currentLng = fromPoint[0] + (toPoint[0] - fromPoint[0]) * state.progress;
          const currentLat = fromPoint[1] + (toPoint[1] - fromPoint[1]) * state.progress;

          const heading = calculateHeading(fromPoint[0], fromPoint[1], toPoint[0], toPoint[1]);

          return {
            ...truck,
            lastLongitude: currentLng,
            lastLatitude: currentLat,
            heading: heading,
            speedKmh: Math.floor(32 + Math.sin(Date.now() / 1000 + truck.id) * 8),
            lastSeenAt: new Date(),
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

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

      map.on('click', (e) => {
        if (!e.defaultPrevented) {
          setActiveTruck(null);
          setIsFollowing(false);
        }
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

          map.addLayer({
            id: 'truck-route-glow',
            type: 'line',
            source: 'selected-truck-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#0e4c8c',
              'line-width': 7,
              'line-opacity': 0.35,
              'line-blur': 4,
            },
          });

          map.addLayer({
            id: 'truck-route-main',
            type: 'line',
            source: 'selected-truck-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#0e4c8c',
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
            zoom: 15.4,
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

      const roadWaypoints = ROAD_ROUTES[activeTruck.id] || ROAD_ROUTES[1];
      const coordinates = [[activeTruck.lastLongitude, activeTruck.lastLatitude], ...roadWaypoints];

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    dams.forEach((dam) => {
      if (!dam.latitude || !dam.longitude) return;

      if (!markersRef.current.dams[dam.id]) {
        const el = createDamDOMElement(dam, isLightMode);

        const popup = new maplibregl.Popup({ offset: 22, closeButton: false }).setHTML(`
          <div style="background: #FFFFFF; color: #0A2A4F; padding: 12px; border-radius: 12px; min-width: 190px; font-family: sans-serif; border: 1px solid #D4E4EF; box-shadow: 0 8px 24px rgba(10,42,79,0.12);">
            <div style="font-weight: 800; font-size: 13px; color: #0E4C8C; margin-bottom: 4px;">${dam.name}</div>
            <div style="font-size: 11px; color: #4D6278;">Capacity: <strong style="color: #0A2A4F;">${dam.capacityMegaLitres} ML</strong></div>
            <div style="font-size: 11px; color: #4D6278; margin-top: 4px;">Fill Level: <strong style="color: #2E9E4F;">${dam.latestLevel ?? 50}%</strong></div>
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

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-border shadow-md relative select-none"
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full bg-surface-blue" />

      {/* Top Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsLightMode((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-border text-xs font-bold text-brand-navy shadow-sm flex items-center space-x-2 hover:bg-surface-blue transition-all cursor-pointer"
        >
          {isLightMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Light Map View</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-brand-blue" />
              <span>Night Map View</span>
            </>
          )}
        </button>

        <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-border text-xs font-semibold text-brand-navy shadow-sm flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="font-mono text-brand-blue font-bold">{animatedTrucks.length} Active Tankers</span>
        </div>
      </div>

      {/* Floating Active Vehicle Drawer */}
      {activeTruck && (
        <div className="absolute bottom-4 left-4 right-4 md:left-5 md:right-auto md:w-96 z-30 bg-white border border-brand-accent/40 rounded-2xl p-4 md:p-5 shadow-lg text-brand-navy transition-all duration-300">
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-3" />

          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm md:text-base font-black text-brand-blue bg-surface-blue px-2.5 py-1 rounded-lg border border-brand-accent/30 tracking-wider">
                {activeTruck.registrationNumber}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  activeTruck.status === 'OnTrip' || activeTruck.status === 'Active'
                    ? 'bg-surface-green text-brand-green-dark border border-brand-green/30'
                    : 'bg-surface-blue text-brand-blue border border-brand-accent/30'
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
              className="text-muted hover:text-brand-navy p-1 rounded-lg hover:bg-surface-blue transition-colors cursor-pointer"
              aria-label="Close truck details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-3 bg-surface-blue p-3 rounded-xl border border-brand-accent/20">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-white border border-brand-accent/30 text-brand-blue font-bold text-sm flex items-center justify-center shadow-xs">
                {activeTruck.driverName ? activeTruck.driverName[0] : 'S'}
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-brand-navy">
                  {activeTruck.driverName || 'Sipho Dlamini (Driver)'}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-muted">
                  <span className="flex items-center text-amber-700 font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5 text-amber-500" />
                    {activeTruck.driverRating || '4.8'}
                  </span>
                  <span>· {activeTruck.completedTripsCount || 127} deliveries</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-extrabold text-brand-blue bg-white px-2 py-1 rounded-lg border border-brand-accent/30">
              {(activeTruck.capacityLitres || 10000).toLocaleString()} L
            </span>
          </div>

          <div className="space-y-1.5 mb-3.5 text-xs">
            <div className="flex items-center space-x-2 text-muted">
              <Navigation className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span className="font-semibold text-brand-navy truncate">
                {activeTruck.route || 'Galeshewe Zone 3 Morning Route'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-brand-blue pl-5 text-[11px] font-medium">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Next Stop: {activeTruck.destination || 'Kagisho Clinic Water Point'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="bg-surface-blue p-2.5 rounded-xl border border-brand-accent/20 flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-brand-blue" />
              <div>
                <p className="text-[10px] text-muted">Speed</p>
                <p className="font-bold text-brand-navy">
                  {activeTruck.speedKmh != null && activeTruck.speedKmh > 0
                    ? `${Math.round(activeTruck.speedKmh)} km/h`
                    : '34 km/h'}
                </p>
              </div>
            </div>

            <div className="bg-surface-green p-2.5 rounded-xl border border-brand-green/30 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-green-dark" />
              <div>
                <p className="text-[10px] text-muted">Est. Arrival</p>
                <p className="font-bold text-brand-navy">
                  {activeTruck.estimatedArrival || '12 mins'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing((prev) => !prev)}
            className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer ${
              isFollowing
                ? 'bg-brand-blue text-white'
                : 'bg-surface-blue hover:bg-brand-blue/10 text-brand-blue border border-brand-accent/30'
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
