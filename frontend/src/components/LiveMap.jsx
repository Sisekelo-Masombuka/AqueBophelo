import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Key, Layers, Compass, CheckCircle2 } from 'lucide-react';

// Fix default Leaflet asset URLs for fallback
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Sol Plaatje Municipality Coordinates (Kimberley, Northern Cape)
const KIMBERLEY_LNG_LAT = [24.7719, -28.7419]; // Mapbox uses [lng, lat]
const KIMBERLEY_LAT_LNG = [-28.7419, 24.7719]; // Leaflet uses [lat, lng]

/**
 * Creates custom DOM element for Mapbox Dam/Reservoir markers
 */
function createDamMarkerElement(dam) {
  const level = dam.latestLevel ?? 50;
  const badgeColor = level < 30 ? '#EF4444' : level < 60 ? '#F59E0B' : '#22C55E';

  const el = document.createElement('div');
  el.className = 'mapbox-dam-pin';
  el.style.width = '38px';
  el.style.height = '38px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';

  el.innerHTML = `
    <div style="
      width: 38px;
      height: 38px;
      background: #111B2E;
      border: 2px solid #22D3EE;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(34, 211, 238, 0.4);
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      ">${Math.round(level)}%</span>
    </div>
  `;
  return el;
}

/**
 * Creates custom DOM element for Mapbox Water Tanker markers
 */
function createTruckMarkerElement(truck) {
  const isOnTrip = truck.status === 'OnTrip' || truck.status === 'Active';
  const strokeColor = isOnTrip ? '#22C55E' : '#22D3EE';

  const el = document.createElement('div');
  el.className = 'mapbox-truck-pin';
  el.style.width = '42px';
  el.style.height = '42px';
  el.style.position = 'relative';
  el.style.cursor = 'pointer';

  const pulseHtml = isOnTrip
    ? `<span style="position: absolute; inset: -4px; border-radius: 50%; background: #22C55E; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
    : '';

  el.innerHTML = `
    ${pulseHtml}
    <div style="
      width: 42px;
      height: 42px;
      background: #0B1220;
      border: 2px solid ${strokeColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.8);
      position: relative;
    ">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    </div>
  `;
  return el;
}

export function LiveMap({ dams = [], trucks = [], zoom = 12, height = '480px' }) {
  const envToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const [userToken, setUserToken] = useState(() => localStorage.getItem('aquabophelo_mapbox_token') || envToken);
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenPrompt, setShowTokenPrompt] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ dams: {}, trucks: {} });

  const activeToken = userToken.trim();

  // Save manual token
  const handleSaveToken = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      localStorage.setItem('aquabophelo_mapbox_token', tokenInput.trim());
      setUserToken(tokenInput.trim());
      setShowTokenPrompt(false);
    }
  };

  // Initialize Mapbox GL JS map when token is present
  useEffect(() => {
    if (!activeToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = activeToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: KIMBERLEY_LNG_LAT,
      zoom: zoom,
      pitch: 30, // 3D perspective angle
      bearing: -5,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      mapRef.current = map;
    });

    map.on('error', (e) => {
      console.warn('Mapbox GL JS warning/error:', e);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [activeToken, zoom]);

  // Update Mapbox markers dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Render / Update Dam Markers
    dams.forEach((dam) => {
      if (!dam.latitude || !dam.longitude) return;

      if (!markersRef.current.dams[dam.id]) {
        const el = createDamMarkerElement(dam);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background: #111B2E; color: #E6EDF7; padding: 8px; border-radius: 8px; min-width: 170px; font-family: sans-serif; border: 1px solid #1F2C45;">
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

    // Render / Update Truck Markers (animated smoothly with heading)
    trucks.forEach((truck) => {
      if (!truck.lastLatitude || !truck.lastLongitude) return;

      const lngLat = [truck.lastLongitude, truck.lastLatitude];

      if (markersRef.current.trucks[truck.id]) {
        // Smoothly animate existing marker position and heading
        markersRef.current.trucks[truck.id].setLngLat(lngLat);
        if (truck.heading != null) {
          markersRef.current.trucks[truck.id].setRotation(truck.heading);
        }
      } else {
        const el = createTruckMarkerElement(truck);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="background: #111B2E; color: #E6EDF7; padding: 10px; border-radius: 8px; min-width: 190px; font-family: sans-serif; border: 1px solid #1F2C45;">
            <div style="font-family: monospace; font-weight: bold; font-size: 13px; color: #22D3EE; margin-bottom: 4px;">${truck.registrationNumber}</div>
            <div style="font-size: 11px; color: #8A9BB8;">Status: <strong style="color: #22C55E;">${truck.status || 'Available'}</strong></div>
            <div style="font-size: 11px; color: #8A9BB8; margin-top: 2px;">Driver: <strong style="color: #E6EDF7;">${truck.driverName || 'Unassigned'}</strong></div>
            <div style="font-size: 11px; color: #8A9BB8; margin-top: 2px;">Tank: <strong style="color: #E6EDF7;">${(truck.capacityLitres || 10000).toLocaleString()} L</strong></div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el, rotationAlignment: 'map' })
          .setLngLat(lngLat)
          .setRotation(truck.heading || 0)
          .setPopup(popup)
          .addTo(map);

        markersRef.current.trucks[truck.id] = marker;
      }
    });
  }, [dams, trucks, activeToken]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#1F2C45] shadow-xl relative" style={{ height }}>
      {/* Engine Status & Token Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
        <div className="px-2.5 py-1 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border border-[#1F2C45] text-xs font-semibold text-[#E6EDF7] shadow-lg flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>{activeToken ? 'Mapbox GL JS (3D Vector)' : 'OpenStreetMap / Carto Dark'}</span>
        </div>

        <button
          onClick={() => setShowTokenPrompt((prev) => !prev)}
          className="p-1 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border border-[#1F2C45] text-[#8A9BB8] hover:text-[#22D3EE] shadow-lg transition-colors"
          title="Configure Mapbox Token"
          aria-label="Configure Mapbox Token"
        >
          <Key className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mapbox Token Configuration Flyout */}
      {showTokenPrompt && (
        <div className="absolute top-12 left-3 z-30 bg-[#111B2E] border border-[#22D3EE]/40 rounded-xl p-4 shadow-2xl max-w-sm text-xs text-[#E6EDF7]">
          <h4 className="font-bold text-sm text-[#22D3EE] mb-1">Mapbox GL JS Access Token</h4>
          <p className="text-[11px] text-[#8A9BB8] mb-3">
            Paste your free public token from <strong>account.mapbox.com</strong> (or save it to <code className="text-[#22D3EE]">VITE_MAPBOX_TOKEN</code> in <code className="text-[#22D3EE]">.env.development</code>).
          </p>
          <form onSubmit={handleSaveToken} className="space-y-2">
            <input
              type="text"
              placeholder="pk.eyJ1..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-lg px-2.5 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE] font-mono"
            />
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTokenPrompt(false)}
                className="px-2.5 py-1 rounded text-[11px] text-[#8A9BB8] hover:text-[#E6EDF7]"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-[#22D3EE] text-[#0B1220] font-bold text-[11px] shadow-sm"
              >
                Apply Token
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Mapbox if token exists */}
      {activeToken ? (
        <div ref={mapContainerRef} className="w-full h-full" style={{ backgroundColor: '#0B1220' }} />
      ) : (
        /* Seamless Fallback to Leaflet Carto Dark while Mapbox token is being configured */
        <MapContainer
          center={KIMBERLEY_LAT_LNG}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', backgroundColor: '#0B1220' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {dams.map((dam) =>
            dam.latitude && dam.longitude ? (
              <LeafletMarker
                key={`dam-${dam.id}`}
                position={[dam.latitude, dam.longitude]}
                icon={L.divIcon({
                  html: `
                    <div style="width:36px;height:36px;background:#111B2E;border:2px solid #22D3EE;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(34,211,238,0.4);">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                    </div>
                  `,
                  className: 'dam-pin',
                  iconSize: [36, 36],
                  iconAnchor: [18, 18],
                })}
              >
                <LeafletPopup>
                  <div className="text-[#0B1220] p-1 font-sans">
                    <h3 className="font-bold text-sm">{dam.name}</h3>
                    <p className="text-xs">Capacity: {dam.capacityMegaLitres} ML</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">Level: {dam.latestLevel}%</p>
                  </div>
                </LeafletPopup>
              </LeafletMarker>
            ) : null
          )}

          {trucks.map((truck) =>
            truck.lastLatitude && truck.lastLongitude ? (
              <LeafletMarker
                key={`truck-${truck.id}`}
                position={[truck.lastLatitude, truck.lastLongitude]}
                icon={L.divIcon({
                  html: `
                    <div style="width:38px;height:38px;background:#0B1220;border:2px solid #22C55E;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.6);">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    </div>
                  `,
                  className: 'truck-pin',
                  iconSize: [38, 38],
                  iconAnchor: [19, 19],
                })}
              >
                <LeafletPopup>
                  <div className="text-[#0B1220] p-1 font-sans">
                    <h3 className="font-bold text-sm">🚚 Truck {truck.registrationNumber}</h3>
                    <p className="text-xs">Capacity: {truck.capacityLitres} L</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">Status: {truck.status}</p>
                  </div>
                </LeafletPopup>
              </LeafletMarker>
            ) : null
          )}
        </MapContainer>
      )}
    </div>
  );
}

export default LiveMap;
