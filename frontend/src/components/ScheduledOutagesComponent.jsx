import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle, Plus, CheckCircle2, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import apiClient from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export function ScheduledOutagesComponent({ isAdmin = false }) {
  const { t } = useLanguage();
  const [outages, setOutages] = useState([
    {
      id: 1,
      areaName: 'Galeshewe Zone 3 & Zone 4',
      title: 'Newton Pumping Station Main Valve Replacement',
      cutOffTime: '2026-09-29T08:00:00',
      expectedReturnTime: '2026-09-29T16:30:00',
      description: 'Pipe repairs and pressure testing',
      postedBy: 'Sol Plaatje Municipal Admin',
    },
    {
      id: 2,
      areaName: 'Kimberley Central (Sol Plaatje Drive)',
      title: 'Scheduled Bulk Main Pipe Flushing & Pressure Testing',
      cutOffTime: '2026-09-30T07:00:00',
      expectedReturnTime: '2026-09-30T13:00:00',
      description: 'Scheduled maintenance for water quality assurance',
      postedBy: 'Sol Plaatje Municipal Admin',
    },
    {
      id: 3,
      areaName: 'Roodepan Suburb (Blocks A-D)',
      title: 'Filter Bed Maintenance at Riverton Treatment Facility',
      cutOffTime: '2026-10-02T09:00:00',
      expectedReturnTime: '2026-10-02T17:00:00',
      description: 'Filter bed flushing',
      postedBy: 'Sol Plaatje Municipal Admin',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [areaName, setAreaName] = useState('Galeshewe Zone 1-4');
  const [title, setTitle] = useState('');
  const [cutOffTime, setCutOffTime] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    try {
      const response = await apiClient.get('/api/v1/outages');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setOutages(response.data);
      }
    } catch (err) {
      console.warn('Live API outages fallback to initial state:', err);
    }
  };

  const handleAddOutage = async (e) => {
    e.preventDefault();
    if (!title || !cutOffTime || !expectedReturnTime) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/api/v1/outages', {
        title,
        areaName,
        cutOffTime: new Date(cutOffTime).toISOString(),
        expectedReturnTime: new Date(expectedReturnTime).toISOString(),
        description,
      });

      const newOutage = response.data;
      setOutages([newOutage, ...outages]);
      setIsAddModalOpen(false);
      setTitle('');
      setCutOffTime('');
      setExpectedReturnTime('');
      setDescription('');
    } catch (err) {
      console.warn('Backend outage post fallback:', err);
      const fallbackOutage = {
        id: Date.now(),
        areaName,
        title,
        cutOffTime,
        expectedReturnTime,
        description,
        postedBy: 'Sol Plaatje Municipal Admin',
      };
      setOutages([fallbackOutage, ...outages]);
      setIsAddModalOpen(false);
      setTitle('');
      setCutOffTime('');
      setExpectedReturnTime('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return dateStr;
      return dt.toLocaleString('en-ZA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#152e52] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-[#152e52]" />
            <span>Official Sol Plaatje Municipal Water Schedule</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-[#152e52]">
            {t('waterInterruptionSchedule')}
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Track planned water supply shutdowns, cut-off times, and expected return times across Kimberley.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Post Scheduled Outage</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outages.map((item) => (
          <div
            key={item.id}
            className="bg-[#f8fafc] border border-slate-200 rounded-md p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif font-bold text-sm text-[#152e52] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#152e52] shrink-0" />
                  <span>{item.areaName || item.area}</span>
                </span>
                <StatusBadge status="Watch" />
              </div>

              <p className="text-xs font-semibold text-slate-800 leading-snug">{item.title || item.reason}</p>

              <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-md border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-red-700 font-bold uppercase block">Water Cut Off:</span>
                  <span className="font-mono text-slate-900 font-semibold text-[11px]">{formatDate(item.cutOffTime || item.cutTime)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#2e7d32] font-bold uppercase block">Expected Return:</span>
                  <span className="font-mono text-slate-900 font-semibold text-[11px]">{formatDate(item.expectedReturnTime || item.restoreTime)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-normal flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{item.description || 'Water tanker support assigned on schedule.'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Post Outage Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">
              Post Scheduled Water Interruption
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Dispatches scheduled water cut and restoration times to Kimberley residents.
            </p>

            <form onSubmit={handleAddOutage} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Suburb / Area</label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900"
                >
                  <option value="Galeshewe Zone 1-4">Galeshewe Zone 1-4</option>
                  <option value="Kimberley Central">Kimberley Central</option>
                  <option value="Roodepan Suburb">Roodepan Suburb</option>
                  <option value="Hadison Park & Monument Heights">Hadison Park &amp; Monument Heights</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Interruption Cause / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Main Pipeline Leak Repair on Barkly Road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Water Cut-Off Time</label>
                  <input
                    type="datetime-local"
                    value={cutOffTime}
                    onChange={(e) => setCutOffTime(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Expected Return Time</label>
                  <input
                    type="datetime-local"
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Outage Details &amp; Tanker Plan</label>
                <textarea
                  rows={2}
                  placeholder="Describe maintenance scope and tanker availability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#152e52] text-white hover:bg-[#0f223d] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduledOutagesComponent;
