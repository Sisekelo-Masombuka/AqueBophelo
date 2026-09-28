import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import DamPanel from '../../components/DamPanel';
import LiveMap from '../../components/LiveMap';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import ReportIssueModal from '../../components/ReportIssueModal';
import { Button } from '../../components/ui/Button';
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
    <div className="space-y-8 pb-12">
      {/* Open Civic Welcome Section (No heavy card container) */}
      <div className="bg-surface-blue/70 border border-brand-accent/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-brand-green" />
            <span>Sol Plaatje Water Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-navy-dark font-heading">
            Welcome, {user?.fullName || 'Resident'}
          </h1>
          <p className="text-xs md:text-sm text-muted">
            Live storage metrics for Kimberley reservoirs and delivery tracking for <strong className="text-brand-navy">{user?.area || 'Galeshewe'}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <Button
            onClick={() => setIsReportIssueModalOpen(true)}
            variant="outline"
            size="sm"
            className="font-bold border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 h-10 px-4"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Report Leak</span>
          </Button>

          <Button
            onClick={() => setIsSubscribeModalOpen(true)}
            variant="default"
            size="sm"
            className="font-bold h-10 px-4"
          >
            <Bell className="w-4 h-4 text-white" />
            <span>Email Alerts</span>
          </Button>
        </div>
      </div>

      {/* Open Typographic KPI Metrics (No nested card borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2 border-y border-border">
        <div className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">Grid Storage</span>
          <p className="text-2xl font-black text-brand-navy-dark font-heading">74.5% Avg</p>
          <p className="text-xs text-muted">Newton (62.5%) &amp; Riverton (82.0%)</p>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">Active Fleet</span>
          <p className="text-2xl font-black text-brand-green-dark font-heading">2 Delivering</p>
          <p className="text-xs text-muted">1 Standby in Roodepan Depot</p>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">Municipal Supply</span>
          <p className="text-2xl font-black text-amber-800 font-heading">Watch State</p>
          <p className="text-xs text-muted">Night pressure limits 21:00-04:00</p>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">Your Suburb</span>
          <p className="text-2xl font-black text-brand-navy-dark font-heading">{user?.area || 'Galeshewe'}</p>
          <p className="text-xs text-muted">Tanker NC-542-KM on route</p>
        </div>
      </div>

      {/* Reservoir Capacity Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-xl text-brand-navy-dark font-heading flex items-center gap-2">
            <Droplet className="w-5 h-5 text-brand-blue" />
            <span>Key Reservoir Levels</span>
          </h2>
          <Link
            to="/dams"
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>View 90-Day Trends</span>
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
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-xl text-brand-navy-dark font-heading flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-blue" />
              <span>Live Mobile Tanker Radar</span>
            </h2>
            <p className="text-xs text-muted">
              Centred on Sol Plaatje Municipality — Click pins for active status and estimated arrivals
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

        <LiveMap dams={dams} trucks={trucks} height="440px" />
      </div>

      {/* Community Notices List (Open Rows) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-xl text-brand-navy-dark font-heading flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-blue" />
              <span>Recent Community Notices</span>
            </h2>
            <p className="text-xs text-muted">Official broadcasts for Kimberley water users</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 sm:p-5 hover:bg-surface-blue/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2.5">
                  <StatusBadge status={alert.severity} />
                  <h3 className="font-bold text-sm text-brand-navy font-heading">{alert.title}</h3>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-muted">
                  <span className="px-2 py-0.5 rounded-md bg-surface-blue font-medium text-brand-navy border border-brand-accent/20">
                    {alert.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed pl-1">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

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
