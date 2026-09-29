import React, { useState } from 'react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import { Bell, ShieldCheck, AlertTriangle, Clock, Filter } from 'lucide-react';

export function AlertsPage() {
  const [selectedArea, setSelectedArea] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const alerts = [
    {
      id: 'alt-1',
      title: 'Water Tanker Dispatched to Galeshewe Zone 3',
      message: 'Tanker 542-KM NC (10,000L) is en route to Galeshewe Community Hall and Kagisho Clinic. Residents are requested to bring clean storage containers.',
      severity: 'Healthy',
      area: 'Galeshewe',
      timestamp: 'Today, 09:15 CAT',
    },
    {
      id: 'alt-2',
      title: 'Nightly Water Pressure Reduction (Kimberley Central)',
      message: 'Sol Plaatje Municipality will implement water throttling between 21:00 and 04:00 to replenish Newton Reservoir levels.',
      severity: 'Watch',
      area: 'Kimberley Central',
      timestamp: 'Today, 06:00 CAT',
    },
    {
      id: 'alt-3',
      title: 'Emergency Pipe Leak Repair — Barkley Road',
      message: 'Municipal maintenance crew on site repairing high-pressure mainline near Roodepan. Supply interruption expected for 3 hours.',
      severity: 'Low',
      area: 'Roodepan',
      timestamp: 'Yesterday, 14:20 CAT',
    },
    {
      id: 'alt-4',
      title: 'Riverton Water Works Purification Update',
      message: 'Water treatment pumps operating normally with storage level at 82.0%. Water quality tests meet national SANS 241 standards.',
      severity: 'Healthy',
      area: 'Sol Plaatje Municipality',
      timestamp: 'Yesterday, 08:00 CAT',
    },
  ];

  const filteredAlerts =
    selectedArea === 'All'
      ? alerts
      : alerts.filter((a) => a.area === selectedArea || a.area.includes('Sol Plaatje'));

  return (
    <div className="space-y-6">
      {/* Header and Subscription CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Municipal Water Alerts &amp; Notices
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Official SMS, email, and portal announcements for Sol Plaatje residents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#152e52] hover:bg-[#0f223d] text-white font-medium rounded-md text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Bell className="w-4 h-4 text-white" />
          <span>Subscription Preferences</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Bulletins"
          value={`${alerts.length} Published`}
          subtitle="Sol Plaatje Municipality"
          icon={Bell}
          accentColor="#1d70b8"
        />
        <StatCard
          title="System Water Advisory"
          value="Watch (Advisory)"
          subtitle="Evening conservation active"
          icon={AlertTriangle}
          accentColor="#d97706"
        />
        <StatCard
          title="Water Quality Index"
          value="SANS 241 Compliant"
          subtitle="Riverton Treatment verified"
          icon={ShieldCheck}
          accentColor="#2e7d32"
        />
      </div>

      {/* Area Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {['All', 'Galeshewe', 'Kimberley Central', 'Roodepan'].map((areaName) => (
          <button
            key={areaName}
            onClick={() => setSelectedArea(areaName)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedArea === areaName
                ? 'bg-[#152e52] text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {areaName}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2.5">
                <StatusBadge status={alert.severity} />
                <h3 className="font-serif font-bold text-base text-[#152e52]">{alert.title}</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-normal">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {alert.area}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{alert.timestamp}</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-1">{alert.message}</p>
          </div>
        ))}
      </div>

      <AlertSubscriptionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default AlertsPage;
