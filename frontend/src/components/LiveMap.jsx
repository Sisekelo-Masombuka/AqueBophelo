import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const KIMBERLEY_CENTER = [-28.7419, 24.7719]; // Sol Plaatje Municipality coordinates

export function LiveMap({ dams = [], trucks = [], zoom = 12, height = '450px' }) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#1F2C45] shadow-lg" style={{ height }}>
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
          <Marker key={`dam-${dam.id}`} position={[dam.latitude, dam.longitude]}>
            <Popup>
              <div className="text-[#0B1220] p-1 font-sans">
                <h3 className="font-bold text-sm">{dam.name}</h3>
                <p className="text-xs">Capacity: {dam.capacityMegaLitres} ML</p>
                {dam.latestLevel != null && (
                  <p className="text-xs font-semibold mt-1">Current Level: {dam.latestLevel}%</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Truck Markers */}
        {trucks.map((truck) => (
          truck.lastLatitude && truck.lastLongitude ? (
            <Marker key={`truck-${truck.id}`} position={[truck.lastLatitude, truck.lastLongitude]}>
              <Popup>
                <div className="text-[#0B1220] p-1 font-sans">
                  <h3 className="font-bold text-sm">🚚 Truck {truck.registrationNumber}</h3>
                  <p className="text-xs">Capacity: {truck.capacityLitres} L</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">Status: {truck.status}</p>
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
