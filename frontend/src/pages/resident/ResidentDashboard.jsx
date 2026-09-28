import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import DamPanel from '../../components/DamPanel';
import LiveMap from '../../components/LiveMap';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import ReportIssueModal from '../../components/ReportIssueModal';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Droplet, Truck, AlertTriangle, MapPin, Bell, Radio, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResidentDashboard() {
  const { user } = useAuth();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);

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
      lastUpdated: 'Today at 08:30 (CAT)',
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
      lastUpdated: 'Today at 07:15 (CAT)',
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
      timestamp: 'Today, 09:15 CAT',
    },
    {
      id: 'alt-2',
      title: 'Newton Reservoir Scheduled Evening Pressure Management',
      message: 'Nightly pressure management between 21:00 and 04:00 to conserve Newton Reservoir reserves.',
      severity: 'Watch',
      area: 'Kimberley Central',
      timestamp: 'Today, 06:00 CAT',
    },
    {
      id: 'alt-3',
      title: 'Riverton Purification Output Normal',
      message: 'Water treatment pumps at Riverton Water Works operating at full capacity (82.0% storage).',
      severity: 'Healthy',
      area: 'Sol Plaatje Municipality',
      timestamp: 'Yesterday, 17:30 CAT',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Actions */}
      <Card className="bg-gradient-to-r from-surface-blue via-white to-white border-brand-accent/30 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-brand-green" />
              <span>Sol Plaatje Water Portal</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-brand-navy">
              Welcome, {user?.fullName || 'Resident'}
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1">
              Live storage metrics for Kimberley reservoirs and real-time delivery tracking for <strong className="text-brand-navy">{user?.area || 'Galeshewe'}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <Button
              onClick={() => setIsReportIssueModalOpen(true)}
              variant="outline"
              size="sm"
              className="font-bold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            >
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Report Issue</span>
            </Button>

            <Button
              onClick={() => setIsSubscribeModalOpen(true)}
              variant="secondary"
              size="sm"
              className="font-bold"
            >
              <Bell className="w-4 h-4 text-brand-blue" />
              <span>Alert Preferences</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Dam Reserve"
          value="74.5%"
          subtitle="Newton (62.5%) & Riverton (82.0%)"
          icon={Droplet}
          accentColor="#0e4c8c"
        />
        <StatCard
          title="Water Tankers Active"
          value="2 Delivering"
          subtitle="1 Standby in Roodepan"
          icon={Truck}
          accentColor="#2e9e4f"
        />
        <StatCard
          title="Municipal Supply Alert"
          value="Normal (Watch)"
          subtitle="Nightly pressure management 21:00-04:00"
          icon={AlertTriangle}
          accentColor="#b45309"
        />
        <StatCard
          title="Your Suburb Zone"
          value={user?.area || 'Galeshewe'}
          subtitle="Tanker NC-542-KM on route"
          icon={MapPin}
          accentColor="#0e4c8c"
        />
      </div>

      {/* Reservoir Capacity Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
            <Droplet className="w-4 h-4 text-brand-blue" />
            <span>Key Reservoir Levels</span>
          </h3>
          <Link
            to="/dams"
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>View Reservoir History</span>
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
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-blue" />
              <span>Live Fleet &amp; Reservoir Map</span>
            </h3>
            <p className="text-xs text-muted">
              Centred on Sol Plaatje Municipality — Click pins for capacity and live status
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span>Reservoirs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
              <span>Active Tankers</span>
            </span>
          </div>
        </div>

        <LiveMap dams={dams} trucks={trucks} height="420px" />
      </Card>

      {/* Active Municipal Alerts Feed */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-blue" />
              <span>Recent Community Notices &amp; Alerts</span>
            </h3>
            <p className="text-xs text-muted">
              Official broadcasts for Kimberley water users
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-blue border border-brand-accent/20 text-brand-navy font-semibold">
            CAT / SAST
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-surface-blue/30 border border-border rounded-xl hover:border-brand-accent/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={alert.severity} />
                  <h4 className="font-semibold text-sm text-brand-navy">{alert.title}</h4>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-muted">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-border font-medium text-brand-navy">
                    {alert.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed">{alert.message}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Alert Preferences Modal */}
      <AlertSubscriptionsModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      {/* Report Water Issue Modal */}
      <ReportIssueModal
        isOpen={isReportIssueModalOpen}
        onClose={() => setIsReportIssueModalOpen(false)}
        userArea={user?.area}
      />
    </div>
  );
}

export default ResidentDashboard;
