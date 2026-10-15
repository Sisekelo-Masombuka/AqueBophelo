import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, AlertTriangle, Plus, X, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import apiClient from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export function ScheduledOutagesComponent({ isAdmin = false }) {
  const { t } = useLanguage();
  const [outages, setOutages] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [areaName, setAreaName] = useState('Galeshewe Zone 1-4');
  const [title, setTitle] = useState('');
  const [cutOffTime, setCutOffTime] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const loadOutages = async () => {
      try {
        const response = await apiClient.get('/api/v1/outages');
        if (isCurrent && Array.isArray(response.data)) {
          setOutages(response.data);
        }
      } catch (err) {
        console.warn('Could not load live outages:', err);
      }
    };
    loadOutages();
    return () => {
      isCurrent = false;
    };
  }, []);

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
      setOutages((prev) => [newOutage, ...prev]);
      setIsAddModalOpen(false);
      setTitle('');
      setCutOffTime('');
      setExpectedReturnTime('');
      setDescription('');
    } catch (err) {
      console.error('Failed to post outage to server:', err);
      alert('Could not post scheduled water interruption notice to the database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOutage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled water interruption notice?')) return;
    try {
      await apiClient.delete(`/api/v1/outages/${id}`);
      setOutages((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete outage:', err);
      alert('Could not delete scheduled outage from database.');
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
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-navy mb-1">
            <Calendar className="w-4 h-4 text-navy" />
            <span>Official Sol Plaatje municipal water schedule</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-navy">
            {t('waterInterruptionSchedule')}
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Track planned water supply shutdowns, cut-off times, and expected return times across Kimberley.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-navy hover:bg-navy-dark text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Post Scheduled Outage</span>
          </button>
        )}
      </div>

      {outages.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 rounded-md bg-slate-50/50">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Scheduled Water Interruptions</p>
          <p className="text-xs text-slate-500 mt-1">Water supply is running on normal schedule across all Sol Plaatje municipal zones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outages.map((item) => (
            <div
              key={item.id}
              className="bg-surface-muted border border-slate-200 rounded-md p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-serif font-bold text-sm text-navy flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-navy shrink-0" />
                    <span>{item.areaName || item.area}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="Watch" />
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteOutage(item.id)}
                        className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Outage Notice"
                        aria-label="Delete Outage Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 leading-snug">{item.title || item.reason}</p>

                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-md border border-slate-200 text-xs">
                  <div>
                    <span className="text-xs text-red-700 font-bold uppercase block">Water Cut Off:</span>
                    <span className="font-mono text-slate-900 font-semibold text-xs">{formatDate(item.cutOffTime || item.cutTime)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-success font-bold uppercase block">Expected Return:</span>
                    <span className="font-mono text-slate-900 font-semibold text-xs">{formatDate(item.expectedReturnTime || item.restoreTime)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 font-normal flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{item.description || 'Water tanker support assigned on schedule.'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

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

            <h3 className="font-serif text-lg font-bold text-navy mb-1">
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
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-navy text-white hover:bg-navy-dark cursor-pointer disabled:opacity-50"
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
