import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import {
  ShieldCheck,
  Droplet,
  Truck,
  AlertTriangle,
  Radio,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  Activity,
  Layers,
} from 'lucide-react';
import apiClient from '../../api/client';
import LiveMap from '../../components/LiveMap';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import BroadcastAlertModal from '../../components/BroadcastAlertModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

export function AdminOverview() {
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Dams data
  const [dams, setDams] = useState([
    {
      id: 1,
      name: 'Newton Reservoir',
      latitude: -28.7511,
      longitude: 24.7612,
      capacityMegaLitres: 92.5,
      latestLevel: 62.5,
      statusBand: 'Healthy',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      latitude: -28.5369,
      longitude: 24.7061,
      capacityMegaLitres: 150.0,
      latestLevel: 82.0,
      statusBand: 'Healthy',
    },
  ]);

  // Water tankers data
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      route: 'Galeshewe Zone 3 Morning Route',
      speedKmh: 32,
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
      speedKmh: 28,
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
      speedKmh: 0,
    },
  ]);

  const [activeAlertsCount, setActiveAlertsCount] = useState(2);
  const [signalrConnected, setSignalrConnected] = useState(false);

  // Load initial backend data
  useEffect(() => {
    async function loadData() {
      try {
        const [damsRes, trucksRes] = await Promise.allSettled([
          apiClient.get('/api/v1/dams'),
          apiClient.get('/api/v1/trucks'),
        ]);

        if (damsRes.status === 'fulfilled' && Array.isArray(damsRes.value.data) && damsRes.value.data.length > 0) {
          setDams(
            damsRes.value.data.map((d) => ({
              ...d,
              latestLevel: d.latestLevelPercent ?? d.latestLevel ?? 50,
            }))
          );
        }

        if (trucksRes.status === 'fulfilled' && Array.isArray(trucksRes.value.data) && trucksRes.value.data.length > 0) {
          setTrucks(trucksRes.value.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded state.', err);
      }
    }
    loadData();
  }, []);

  // Listen for real-time truck GPS coordinates over SignalR
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
                speedKmh: payload.speedKmh,
                status: payload.status || t.status,
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
        console.warn('SignalR Hub unavailable for command center map:', err);
      }
    }

    startSignalR();

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  const onTripCount = trucks.filter((t) => t.status === 'OnTrip' || t.status === 'Active').length;
  const availableCount = trucks.filter((t) => t.status === 'Available').length;
  const avgDamLevel = dams.length > 0
    ? Math.round(dams.reduce((acc, d) => acc + (d.latestLevel || 0), 0) / dams.length)
    : 72;

  return (
    <div className="space-y-6">
      {/* Top Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Grid Water Storage"
          value={`${avgDamLevel}% Avg`}
          subtitle="Newton (62.5%) & Riverton (82%)"
          icon={Droplet}
          accentColor={avgDamLevel < 30 ? '#EF4444' : avgDamLevel < 60 ? '#F59E0B' : '#22C55E'}
        />
        <StatCard
          title="Active Tankers on Road"
          value={`${onTripCount} Deployed`}
          subtitle="Delivering to Galeshewe & Central"
          icon={Truck}
          accentColor="#22C55E"
        />
        <StatCard
          title="Fleet at Municipal Depot"
          value={`${availableCount} Available`}
          subtitle="Roodepan Support Center"
          icon={ShieldCheck}
          accentColor="#22D3EE"
        />
        <StatCard
          title="Live GPS Fleet Stream"
          value={signalrConnected ? 'Connected' : 'Live Sync'}
          subtitle="SignalR /hubs/trucks active"
          icon={Radio}
          accentColor="#F59E0B"
        />
      </div>

      {/* Main Interactive Radar Map */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#22D3EE]/15 rounded-lg text-[#22D3EE]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#E6EDF7]">
                Sol Plaatje Live Operational Map
              </h3>
              <p className="text-xs text-[#8A9BB8]">
                Real-time tracking of water tankers moving across Kimberley and reservoir capacities.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 text-xs font-bold transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
            <button
              onClick={() => navigate('/admin/trucks')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/30 text-xs font-semibold transition-all"
            >
              <span>Manage Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <LiveMap dams={dams} trucks={trucks} height="480px" />
      </div>

      {/* Two Column Grid: Reservoir Levels & Moving Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dam Levels Card */}
        <div className="lg:col-span-6 bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2C45] mb-4">
              <h3 className="font-bold text-sm text-[#E6EDF7] flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-[#22D3EE]" />
                <span>Municipal Reservoir Health</span>
              </h3>
              <button
                onClick={() => navigate('/admin/dams')}
                className="text-xs text-[#22D3EE] hover:underline inline-flex items-center space-x-1"
              >
                <span>Log Reading</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {dams.map((dam) => {
                const level = dam.latestLevel || 50;
                return (
                  <div key={dam.id} className="bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3.5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-[#E6EDF7]">{dam.name}</h4>
                        <p className="text-[11px] text-[#8A9BB8]">Capacity: {dam.capacityMegaLitres} ML</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          level < 30
                            ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                            : level < 60
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                            : 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                        }`}
                      >
                        {level}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#111B2E] rounded-full overflow-hidden border border-[#1F2C45]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          level < 30 ? 'bg-[#EF4444]' : level < 60 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                        }`}
                        style={{ width: `${Math.min(level, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Moving Tankers Card */}
        <div className="lg:col-span-6 bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2C45] mb-4">
              <h3 className="font-bold text-sm text-[#E6EDF7] flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#22C55E]" />
                <span>Active Water Delivery Tankers</span>
              </h3>
              <button
                onClick={() => navigate('/admin/trucks')}
                className="text-xs text-[#22D3EE] hover:underline inline-flex items-center space-x-1"
              >
                <span>View All Fleet</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {trucks.map((truck) => (
                <div
                  key={truck.id}
                  className="bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/20">
                      {truck.registrationNumber}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#E6EDF7]">{truck.route || 'Kimberley Route'}</p>
                      <p className="text-[11px] text-[#8A9BB8]">
                        Driver: {truck.driverName || 'Unassigned'} · {truck.capacityLitres?.toLocaleString() || 10000} L
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <StatusBadge status={truck.status} />
                    {truck.speedKmh != null && truck.speedKmh > 0 && (
                      <p className="text-[10px] text-[#22C55E] mt-1 font-mono">
                        {Math.round(truck.speedKmh)} km/h
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      <BroadcastAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onAlertSent={() => setActiveAlertsCount((prev) => prev + 1)}
      />
    </div>
  );
}

export default AdminOverview;
