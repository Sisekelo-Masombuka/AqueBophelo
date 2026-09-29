import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import LiveMap from '../../components/LiveMap';
import StatusBadge from '../../components/StatusBadge';
import { Truck, Radio, Star } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

export function LiveTrucksPage() {
  const dams = [
    { id: 1, name: 'Newton Reservoir', latitude: -28.7511, longitude: 24.7612, capacityMegaLitres: 92.5, latestLevel: 62.5 },
    { id: 2, name: 'Riverton Water Works', latitude: -28.5369, longitude: 24.7061, capacityMegaLitres: 150.0, latestLevel: 82.0 },
  ];

  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: '542-KM NC',
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
      lastSeenAt: new Date(Date.now() - 12000),
    },
    {
      id: 2,
      registrationNumber: '882-KM NC',
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
      lastSeenAt: new Date(Date.now() - 45000),
    },
    {
      id: 3,
      registrationNumber: '104-KM NC',
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
      lastSeenAt: new Date(Date.now() - 360000),
    },
  ]);

  const [selectedTruckId, setSelectedTruckId] = useState(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#2e7d32]" />
            <span>Real-Time Fleet Telemetry Radar</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Live Water Tanker Tracking
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Click any moving tanker to track its real-time position, scheduled route corridor, and driver details.
          </p>
        </div>

        {/* Live GPS Beacon Pill */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-ping" />
            <span>{signalrConnected ? 'SignalR GPS Active' : 'Live Telemetry Stream'}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs overflow-hidden">
        <LiveMap
          dams={dams}
          trucks={trucks}
          height="560px"
          selectedTruckId={selectedTruckId}
          onTruckSelect={(truck) => setSelectedTruckId(truck.id)}
        />
      </div>

      {/* Quick Truck Selector Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trucks.map((truck) => {
          const isSelected = selectedTruckId === truck.id;
          return (
            <div
              key={truck.id}
              onClick={() => setSelectedTruckId(truck.id)}
              className={`rounded-lg p-4 transition-all cursor-pointer shadow-xs flex flex-col justify-between bg-white border ${
                isSelected
                  ? 'border-[#1d70b8] ring-2 ring-[#1d70b8]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {truck.registrationNumber}
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {truck.capacityLitres.toLocaleString()} L
                    </span>
                  </div>
                  <StatusBadge status={truck.status} />
                </div>

                <div className="flex items-center justify-between text-xs text-[#152e52] font-semibold mb-1">
                  <span>{truck.driverName}</span>
                  {truck.driverRating && (
                    <span className="flex items-center text-amber-600 text-xs">
                      <Star className="w-3 h-3 fill-current mr-0.5 text-amber-500" />
                      {truck.driverRating}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 truncate mb-3 font-normal">
                  {truck.route}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[#1d70b8] font-medium">ETA: {truck.estimatedArrival}</span>
                <span className="text-slate-500 font-medium">
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
