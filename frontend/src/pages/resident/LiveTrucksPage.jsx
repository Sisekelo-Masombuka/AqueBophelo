import React, { useState } from 'react';
import LiveMap from '../../components/LiveMap';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Truck, MapPin, Radio, ShieldCheck, User } from 'lucide-react';

export function LiveTrucksPage() {
  const dams = [
    { id: 1, name: 'Newton Reservoir', latitude: -28.7511, longitude: 24.7612, capacityMegaLitres: 92.5, latestLevel: 62.5 },
    { id: 2, name: 'Riverton Water Works', latitude: -28.5369, longitude: 24.7061, capacityMegaLitres: 150.0, latestLevel: 82.0 },
  ];

  const [trucks] = useState([
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      route: 'Galeshewe Zone 3 Morning Route',
      estimatedArrival: '15 mins',
    },
    {
      id: 2,
      registrationNumber: 'NC-882-KM',
      capacityLitres: 15000,
      status: 'OnTrip',
      lastLatitude: -28.7419,
      lastLongitude: 24.7719,
      driverName: 'Lerato Motsepe',
      route: 'Kimberley Central Bulk Delivery',
      estimatedArrival: '30 mins',
    },
    {
      id: 3,
      registrationNumber: 'NC-104-KM',
      capacityLitres: 10000,
      status: 'Available',
      lastLatitude: -28.6921,
      lastLongitude: 24.7088,
      driverName: 'Tshepo Khumalo',
      route: 'Roodepan Depot Standby',
      estimatedArrival: 'Standby',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-Time GPS Fleet Stream</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
          Live Water Tanker Tracking
        </h2>
        <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
          Monitor moving water delivery tankers and community water drop points across Sol Plaatje.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Tankers"
          value="2 On Route"
          subtitle="Galeshewe & Kimberley Central"
          icon={Truck}
          accentColor="#22C55E"
        />
        <StatCard
          title="Standby Fleet"
          value="1 Available"
          subtitle="Roodepan Municipal Depot"
          icon={ShieldCheck}
          accentColor="#22D3EE"
        />
        <StatCard
          title="GPS Refresh Rate"
          value="Every 5s"
          subtitle="SignalR /hubs/trucks active"
          icon={Radio}
          accentColor="#F59E0B"
        />
      </div>

      {/* Map View */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#E6EDF7] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#22D3EE]" />
            <span>Interactive Fleet Tracking Map</span>
          </h3>
          <span className="text-xs text-[#8A9BB8]">Centered on Kimberley, Northern Cape</span>
        </div>
        <LiveMap dams={dams} trucks={trucks} height="480px" />
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trucks.map((truck) => (
          <div
            key={truck.id}
            className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-5 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30">
                  {truck.registrationNumber}
                </span>
                <StatusBadge status={truck.status} />
              </div>
              <h4 className="font-bold text-base text-[#E6EDF7] mb-1">{truck.route}</h4>
              <p className="text-xs text-[#8A9BB8] flex items-center gap-1.5 mb-3">
                <User className="w-3.5 h-3.5" />
                <span>Driver: {truck.driverName}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#1F2C45] flex items-center justify-between text-xs text-[#8A9BB8]">
              <span>Capacity: {truck.capacityLitres.toLocaleString()} L</span>
              <span className="text-[#22D3EE] font-medium">ETA: {truck.estimatedArrival}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveTrucksPage;
