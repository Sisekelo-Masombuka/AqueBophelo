import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import DamPanel from '../../components/DamPanel';
import LiveMap from '../../components/LiveMap';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import { Droplet, Truck, AlertTriangle, MapPin, Bell, Radio, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResidentDashboard() {
  const { user } = useAuth();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Dams data matching backend DbSeeder
  const dams = [
    {
      id: 1,
      name: 'Newton Reservoir',
      areaName: 'Kimberley Central / Sol Plaatje',
      latitude: -28.7511,
      longitude: 24.7612,
      capacityMegaLitres: 92.5,
      volumeMegaLitres: 57.8,
      latestLevel: 62.5,
      lastUpdated: 'Today at 08:30 (SAST)',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      areaName: 'Vaal River Extraction Plant',
      latitude: -28.5369,
      longitude: 24.7061,
      capacityMegaLitres: 150.0,
      volumeMegaLitres: 123.0,
      latestLevel: 82.0,
      lastUpdated: 'Today at 07:15 (SAST)',
    },
  ];

  // Active water trucks matching backend seeded fleet
  const trucks = [
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      route: 'Galeshewe Zone 3 Morning Route',
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
    },
  ];

  // Municipal alerts feed
  const alerts = [
    {
      id: 'alt-1',
      title: 'Water Tanker Dispatched to Galeshewe',
      message: 'Tanker NC-542-KM has departed for Galeshewe Zone 3. Scheduled stops: Community Hall and Kagisho Clinic.',
      severity: 'Healthy',
      area: 'Galeshewe',
      timestamp: 'Today, 09:15 SAST',
    },
    {
      id: 'alt-2',
      title: 'Newton Reservoir Scheduled Evening Pressure Reduction',
      message: 'Nightly pressure management between 21:00 and 04:00 to conserve Newton Reservoir reserves.',
      severity: 'Watch',
      area: 'Kimberley Central',
      timestamp: 'Today, 06:00 SAST',
    },
    {
      id: 'alt-3',
      title: 'Riverton Purification Output Normal',
      message: 'Water treatment pumps at Riverton Water Works operating at full capacity (82.0% storage).',
      severity: 'Healthy',
      area: 'Sol Plaatje Municipality',
      timestamp: 'Yesterday, 17:30 SAST',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Subscription Action */}
      <div className="bg-gradient-to-r from-[#111B2E] to-[#1F2C45]/70 border border-[#1F2C45] rounded-2xl p-5 md:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Sol Plaatje Live Water Portal</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            Welcome, {user?.fullName || 'Resident'}
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Live storage metrics for Kimberley reservoirs and real-time delivery tracking for <span className="text-[#E6EDF7] font-semibold">{user?.area || 'Galeshewe'}</span>.
          </p>
        </div>

        <button
          onClick={() => setIsSubscribeModalOpen(true)}
          className="min-h-[44px] px-4 py-2.5 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all self-start md:self-auto shadow-xs active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span>Manage Alert Subscriptions</span>
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Dam Reserve"
          value="74.5%"
          subtitle="Newton (62.5%) & Riverton (82.0%)"
          icon={Droplet}
          accentColor="#22D3EE"
        />
        <StatCard
          title="Water Tankers on Route"
          value="2 Delivering"
          subtitle="1 Standby in Roodepan"
          icon={Truck}
          accentColor="#22C55E"
        />
        <StatCard
          title="Municipal Supply Alert"
          value="Normal (Watch)"
          subtitle="Pressure restrictions 21:00-04:00"
          icon={AlertTriangle}
          accentColor="#F59E0B"
        />
        <StatCard
          title="Your Delivery Zone"
          value={user?.area || 'Galeshewe'}
          subtitle="Truck NC-542-KM en route"
          icon={MapPin}
          accentColor="#22D3EE"
        />
      </div>

      {/* Reservoir Capacity Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-[#E6EDF7] flex items-center gap-2">
            <Droplet className="w-4 h-4 text-[#22D3EE]" />
            <span>Key Reservoir Levels</span>
          </h3>
          <Link
            to="/dams"
            className="text-xs text-[#22D3EE] hover:underline font-medium flex items-center gap-1"
          >
            <span>View 90-day Trends</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dams.map((dam) => (
            <DamPanel key={dam.id} dam={dam} />
          ))}
        </div>
      </div>

      {/* Live Tanker & Reservoir Tracking Map */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-[#E6EDF7] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#22D3EE]" />
              <span>Live Fleet &amp; Reservoir Map</span>
            </h3>
            <p className="text-xs text-[#8A9BB8]">
              Centred on Sol Plaatje Municipality — Click pins for capacity and live status
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#8A9BB8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></span>
              <span>Reservoirs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
              <span>Active Tankers</span>
            </span>
          </div>
        </div>

        <LiveMap dams={dams} trucks={trucks} height="420px" />
      </div>

      {/* Active Municipal Alerts Feed */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#E6EDF7] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#22D3EE]" />
              <span>Recent Community Notices &amp; Alerts</span>
            </h3>
            <p className="text-xs text-[#8A9BB8]">
              Official broadcasts for Kimberley water users
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#0B1220] border border-[#1F2C45] text-[#8A9BB8]">
            CAT / SAST
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-[#0B1220] border border-[#1F2C45] rounded-xl hover:border-[#22D3EE]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={alert.severity} />
                  <h4 className="font-semibold text-sm text-[#E6EDF7]">{alert.title}</h4>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-[#8A9BB8]">
                  <span className="px-2 py-0.5 rounded-md bg-[#111B2E] border border-[#1F2C45]">
                    {alert.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#8A9BB8] leading-relaxed pl-1">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Preferences Modal */}
      <AlertSubscriptionsModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </div>
  );
}

export default ResidentDashboard;
