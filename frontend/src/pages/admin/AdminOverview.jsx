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
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

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
          accentColor="#0e4c8c"
        />
        <StatCard
          title="Active Tankers Deployed"
          value={`${onTripCount} Tankers`}
          subtitle="Delivering to Galeshewe & Central"
          icon={Truck}
          accentColor="#2e9e4f"
        />
        <StatCard
          title="Fleet at Depot Standby"
          value={`${availableCount} Available`}
          subtitle="Roodepan Support Center"
          icon={ShieldCheck}
          accentColor="#2991c8"
        />
        <StatCard
          title="Live GPS SignalR Stream"
          value={signalrConnected ? 'Connected' : 'Live Sync'}
          subtitle="SignalR /hubs/trucks active"
          icon={Radio}
          accentColor="#b45309"
        />
      </div>

      {/* Main Interactive Radar Map */}
      <Card className="p-5 border-brand-accent/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-surface-blue rounded-lg text-brand-blue border border-brand-accent/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-navy">
                Sol Plaatje Live Operational Map
              </h3>
              <p className="text-xs text-muted">
                Real-time tracking of water tankers moving across Kimberley and reservoir capacities.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <Button
              onClick={() => setIsAlertModalOpen(true)}
              variant="danger"
              size="sm"
              className="font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </Button>
            <Button
              onClick={() => navigate('/admin/trucks')}
              variant="outline"
              size="sm"
              className="font-bold text-brand-blue"
            >
              <span>Manage Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <LiveMap dams={dams} trucks={trucks} height="480px" />
      </Card>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dam Health Card */}
        <Card className="lg:col-span-6 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="font-bold text-sm text-brand-navy flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-brand-blue" />
              <span>Municipal Reservoir Health</span>
            </h3>
            <Button
              onClick={() => navigate('/admin/dams')}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-brand-blue p-0 h-auto"
            >
              <span>Log Reading</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="space-y-4">
            {dams.map((dam) => {
              const level = dam.latestLevel || 50;
              return (
                <div key={dam.id} className="bg-surface-blue/30 border border-border rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs md:text-sm text-brand-navy">{dam.name}</h4>
                      <p className="text-[11px] text-muted">Capacity: {dam.capacityMegaLitres} ML</p>
                    </div>
                    <StatusBadge levelPercent={level} />
                  </div>

                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        level < 30 ? 'bg-red-600' : level < 60 ? 'bg-amber-500' : 'bg-brand-green'
                      }`}
                      style={{ width: `${Math.min(level, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active Tankers Card */}
        <Card className="lg:col-span-6 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="font-bold text-sm text-brand-navy flex items-center space-x-2">
              <Truck className="w-4 h-4 text-brand-green" />
              <span>Active Water Delivery Tankers</span>
            </h3>
            <Button
              onClick={() => navigate('/admin/trucks')}
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-brand-blue p-0 h-auto"
            >
              <span>View All Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="space-y-3">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-surface-blue/30 border border-border rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-brand-blue bg-surface-blue px-2 py-0.5 rounded border border-brand-accent/30">
                    {truck.registrationNumber}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{truck.route || 'Kimberley Route'}</p>
                    <p className="text-[11px] text-muted">
                      Driver: {truck.driverName || 'Unassigned'} · {truck.capacityLitres?.toLocaleString() || 10000} L
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <StatusBadge status={truck.status} />
                  {truck.speedKmh != null && truck.speedKmh > 0 && (
                    <p className="text-[10px] text-brand-green-dark mt-1 font-mono font-semibold">
                      {Math.round(truck.speedKmh)} km/h
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
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
