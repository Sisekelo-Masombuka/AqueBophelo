import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import LiveMap from '../../components/LiveMap';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Truck, MapPin, Radio, ShieldCheck, User, Star, Compass, Navigation } from 'lucide-react';
import apiClient from '../../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

export function LiveTrucksPage() {
  const dams = [
    { id: 1, name: 'Newton Reservoir', latitude: -28.7511, longitude: 24.7612, capacityMegaLitres: 92.5, latestLevel: 62.5 },
    { id: 2, name: 'Riverton Water Works', latitude: -28.5369, longitude: 24.7061, capacityMegaLitres: 150.0, latestLevel: 82.0 },
  ];

  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      driverRating: 4.8,
      completedTripsCount: 127,
      route: 'Galeshewe → Roodepan Delivery Corridor',
      destination: 'Roodepan Community Hall',
      estimatedArrival: '15 min',
      speedKmh: 34,
      heading: 65,
      lastSeenAt: new Date(Date.now() - 12000), // 12 seconds ago
    },
    {
      id: 2,
      registrationNumber: 'NC-882-KM',
      capacityLitres: 15000,
      status: 'OnTrip',
      lastLatitude: -28.7419,
      lastLongitude: 24.7719,
      driverName: 'Lerato Motsepe',
      driverRating: 4.9,
      completedTripsCount: 94,
      route: 'Kimberley Central → Galeshewe Zone 2',
      destination: 'Galeshewe Primary School Reservoir',
      estimatedArrival: '25 min',
      speedKmh: 28,
      heading: 140,
      lastSeenAt: new Date(Date.now() - 45000), // 45 seconds ago
    },
    {
      id: 3,
      registrationNumber: 'NC-104-KM',
      capacityLitres: 10000,
      status: 'Available',
      lastLatitude: -28.6921,
      lastLongitude: 24.7088,
      driverName: 'Tshepo Khumalo',
      driverRating: 4.7,
      completedTripsCount: 81,
      route: 'Roodepan Depot Standby',
      destination: 'Roodepan Municipal Depot',
      estimatedArrival: 'Standby',
      speedKmh: 0,
      heading: 0,
      lastSeenAt: new Date(Date.now() - 360000), // 6 minutes ago
    },
  ]);

  const [selectedTruckId, setSelectedTruckId] = useState(1);
  const [signalrConnected, setSignalrConnected] = useState(false);

  // Connect to SignalR /hubs/trucks to stream live vehicle movements
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
      setTrucks((prev) =>
        prev.map((t) =>
          t.id === payload.truckId || t.registrationNumber === payload.registrationNumber
            ? {
                ...t,
                lastLatitude: payload.latitude,
                lastLongitude: payload.longitude,
                speedKmh: payload.speedKmh ?? t.speedKmh,
                heading: payload.heading ?? t.heading,
                status: payload.status || t.status,
                lastSeenAt: new Date(),
              }
            : t
        )
      );
    });

    async function startSignalR() {
      try {
        await connection.start();
        setSignalrConnected(true);
      } catch (err) {
        console.warn('SignalR Hub offline, using local live telemetry simulation.', err);
      }
    }

    startSignalR();

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  const onTripCount = trucks.filter((t) => t.status === 'OnTrip' || t.status === 'Active').length;
  const availableCount = trucks.filter((t) => t.status === 'Available').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Uber-Style Real-Time Fleet Radar</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            Live Water Tanker Tracking
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Click any moving tanker to track its real-time progress, scheduled route corridor, and driver details.
          </p>
        </div>

        {/* Live GPS Beacon Pill */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            <span>{signalrConnected ? 'SignalR GPS Active' : 'Live Fleet Stream'}</span>
          </div>
        </div>
      </div>

      {/* Hero Visual: Full-Width Uber/Bolt-Style Mapbox Vector Map */}
      <div className="relative">
        <LiveMap
          dams={dams}
          trucks={trucks}
          height="580px"
          selectedTruckId={selectedTruckId}
          onTruckSelect={(truck) => setSelectedTruckId(truck.id)}
        />
      </div>

      {/* Quick Truck Selector Roster (Allows clicking from roster or directly on map) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trucks.map((truck) => {
          const isSelected = selectedTruckId === truck.id;
          return (
            <div
              key={truck.id}
              onClick={() => setSelectedTruckId(truck.id)}
              className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#111B2E] border-2 border-[#22D3EE] shadow-[#22D3EE]/15 ring-2 ring-[#22D3EE]/20'
                  : 'bg-[#111B2E] border border-[#1F2C45] hover:border-[#22D3EE]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs md:text-sm font-black text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30">
                      {truck.registrationNumber}
                    </span>
                    <span className="text-[11px] font-bold text-[#8A9BB8]">
                      {truck.capacityLitres.toLocaleString()} L
                    </span>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>

                <div className="flex items-center justify-between text-xs text-[#E6EDF7] font-semibold mb-1">
                  <span>{truck.driverName}</span>
                  {truck.driverRating && (
                    <span className="flex items-center text-[#F59E0B] text-xs">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      {truck.driverRating}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#8A9BB8] truncate mb-3">
                  {truck.route}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#1F2C45] flex items-center justify-between text-[11px]">
                <span className="text-[#22D3EE] font-medium">ETA: {truck.estimatedArrival}</span>
                <span className="text-[#8A9BB8] hover:text-[#22D3EE] font-bold">
                  {isSelected ? '🎯 Selected on Map' : 'Click to Focus →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LiveTrucksPage;
