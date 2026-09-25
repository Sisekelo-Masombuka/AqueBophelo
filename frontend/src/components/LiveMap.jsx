import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet asset URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Sol Plaatje Municipality Coordinates (Kimberley, Northern Cape)
const KIMBERLEY_CENTER = [-28.7419, 24.7719];

/**
 * Custom SVG DivIcon generator for Water Dams / Reservoirs
 */
function createDamIcon(dam) {
  const level = dam.latestLevel ?? 50;
  const badgeColor = level < 30 ? '#EF4444' : level < 60 ? '#F59E0B' : '#22C55E';

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      background: #111B2E;
      border: 2px solid #22D3EE;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(34, 211, 238, 0.35);
      cursor: pointer;
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

  return L.divIcon({
    html,
    className: 'dam-marker-icon',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

/**
 * Custom SVG DivIcon generator for Water Tankers
 */
function createTruckIcon(truck) {
  const isOnTrip = truck.status === 'OnTrip' || truck.status === 'Active';
  const strokeColor = isOnTrip ? '#22C55E' : '#22D3EE';
  const pulseHtml = isOnTrip
    ? `<span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #22C55E; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
    : '';

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #0B1220;
      border: 2px solid ${strokeColor};
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
      cursor: pointer;
    ">
      ${pulseHtml}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'truck-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

export function LiveMap({ dams = [], trucks = [], zoom = 12, height = '450px' }) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#1F2C45] shadow-lg relative" style={{ height }}>
      <MapContainer
        center={KIMBERLEY_CENTER}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#0B1220' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Dam Markers */}
        {dams.map((dam) => (
          dam.latitude && dam.longitude ? (
            <Marker
              key={`dam-${dam.id}`}
              position={[dam.latitude, dam.longitude]}
              icon={createDamIcon(dam)}
            >
              <Popup className="dark-popup">
                <div className="bg-[#111B2E] text-[#E6EDF7] p-2 rounded-lg min-w-[180px] font-sans border border-[#1F2C45]">
                  <div className="flex items-center justify-between border-b border-[#1F2C45] pb-1.5 mb-1.5">
                    <h3 className="font-bold text-xs text-[#22D3EE]">{dam.name}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22D3EE]/20 text-[#22D3EE]">
                      Dam
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A9BB8]">
                    Capacity: <span className="font-medium text-[#E6EDF7]">{dam.capacityMegaLitres} ML</span>
                  </p>
                  {dam.latestLevel != null && (
                    <div className="mt-2 pt-1.5 border-t border-[#1F2C45]/60 flex items-center justify-between">
                      <span className="text-[11px] text-[#8A9BB8]">Current Level:</span>
                      <span
                        className={`text-xs font-bold ${
                          dam.latestLevel < 30
                            ? 'text-[#EF4444]'
                            : dam.latestLevel < 60
                            ? 'text-[#F59E0B]'
                            : 'text-[#22C55E]'
                        }`}
                      >
                        {dam.latestLevel}%
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}

        {/* Truck Markers */}
        {trucks.map((truck) => (
          truck.lastLatitude && truck.lastLongitude ? (
            <Marker
              key={`truck-${truck.id}`}
              position={[truck.lastLatitude, truck.lastLongitude]}
              icon={createTruckIcon(truck)}
            >
              <Popup className="dark-popup">
                <div className="bg-[#111B2E] text-[#E6EDF7] p-2.5 rounded-lg min-w-[200px] font-sans border border-[#1F2C45]">
                  <div className="flex items-center justify-between border-b border-[#1F2C45] pb-1.5 mb-2">
                    <span className="font-mono text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-1.5 py-0.5 rounded border border-[#22D3EE]/20">
                      {truck.registrationNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        truck.status === 'OnTrip' || truck.status === 'Active'
                          ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                          : 'bg-[#8A9BB8]/20 text-[#8A9BB8]'
                      }`}
                    >
                      {truck.status || 'Available'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A9BB8]">
                    Tank Capacity: <span className="font-medium text-[#E6EDF7]">{truck.capacityLitres?.toLocaleString() || 10000} L</span>
                  </p>
                  {truck.driverName && (
                    <p className="text-[11px] text-[#8A9BB8] mt-0.5">
                      Driver: <span className="font-medium text-[#E6EDF7]">{truck.driverName}</span>
                    </p>
                  )}
                  {truck.route && (
                    <p className="text-[11px] text-[#8A9BB8] mt-0.5">
                      Route: <span className="font-medium text-[#E6EDF7]">{truck.route}</span>
                    </p>
                  )}
                  {truck.speedKmh != null && (
                    <p className="text-[10px] text-[#22D3EE] mt-1.5">
                      Speed: {truck.speedKmh.toFixed(1)} km/h
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}

export default LiveMap;
