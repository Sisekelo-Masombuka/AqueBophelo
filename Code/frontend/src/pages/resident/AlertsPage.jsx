import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import { Bell, ShieldCheck, AlertTriangle, Clock, Filter } from 'lucide-react';
import apiClient from '../../api/client';

export function AlertsPage() {
  const [selectedArea, setSelectedArea] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      try {
        const res = await apiClient.get('/api/v1/alerts');
        if (isMounted && Array.isArray(res.data)) {
          setAlerts(res.data.map(a => ({
            id: a.id || `alt-${Math.random()}`,
            title: a.title,
            message: a.message || a.description || '',
            severity: a.severity || 'Healthy',
            area: a.areaName || a.area || 'All Residents',
            timestamp: a.createdAt ? new Date(a.createdAt).toLocaleString('en-ZA') : 'Recently'
          })));
        }
      } catch (err) {
        console.warn('Error loading alerts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAlerts =
    selectedArea === 'All'
      ? alerts
      : alerts.filter((a) => a.area === selectedArea || a.area.includes('All') || a.area.includes('Sol Plaatje'));

  return (
    <div className="space-y-6">
      {/* Header and Subscription CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Municipal Water Alerts &amp; Notices
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Official email and portal announcements for Sol Plaatje residents.
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
        />
        <StatCard
          title="System Water Advisory"
          value="Watch (Advisory)"
          subtitle="Evening conservation active"
          icon={AlertTriangle}
          status="Watch"
        />
        <StatCard
          title="Water Quality Index"
          value="SANS 241 Compliant"
          subtitle="Riverton Treatment verified"
          icon={ShieldCheck}
          status="Healthy"
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
        {loading ? (
          <div className="p-8 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
            <p className="text-xs text-slate-500">Loading water alerts and bulletins...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-[#152e52]">No Active Water Alerts</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are currently no urgent water interruption warnings or rationing bulletins published for this municipal area.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
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
          ))
        )}
      </div>

      <AlertSubscriptionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default AlertsPage;
