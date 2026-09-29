import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

export function ManageDams() {
  const [dams, setDams] = useState([
    {
      id: 1,
      name: 'Newton Reservoir',
      areaName: 'Kimberley Central / Sol Plaatje',
      latitude: -28.7511,
      longitude: 24.7612,
      capacityMegaLitres: 92.5,
      volumeMegaLitres: 57.8,
      latestLevelPercent: 62.5,
      statusBand: 'Healthy',
      statusColor: 'Green',
      lastUpdatedCAT: 'Today at 08:30 (CAT)',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      areaName: 'Vaal River Extraction Plant',
      latitude: -28.5369,
      longitude: 24.7061,
      capacityMegaLitres: 150.0,
      volumeMegaLitres: 123.0,
      latestLevelPercent: 82.0,
      statusBand: 'Healthy',
      statusColor: 'Green',
      lastUpdatedCAT: 'Today at 07:15 (CAT)',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedDam, setSelectedDam] = useState(null);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for adding manual reading
  const [readingPercent, setReadingPercent] = useState('');
  const [readingSource, setReadingSource] = useState('Manual');

  // Form states for creating dam
  const [newDamName, setNewDamName] = useState('');
  const [newDamLat, setNewDamLat] = useState('');
  const [newDamLng, setNewDamLng] = useState('');
  const [newDamCapacity, setNewDamCapacity] = useState('');

  // Fetch dams from backend
  useEffect(() => {
    async function loadDams() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/dams');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDams(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded dams data.', err);
      } finally {
        setLoading(false);
      }
    }
    loadDams();
  }, []);

  const handleOpenReadingModal = (dam) => {
    setSelectedDam(dam);
    setReadingPercent(dam.latestLevelPercent?.toString() || '50');
    setIsReadingModalOpen(true);
    setFeedback(null);
  };

  const handleRecordReading = async (e) => {
    e.preventDefault();
    if (!selectedDam) return;

    const percent = parseFloat(readingPercent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      setFeedback({ type: 'error', message: 'Please enter a valid percentage between 0 and 100.' });
      return;
    }

    try {
      const payload = {
        levelPercent: percent,
        volumeMegaLitres: (percent / 100) * selectedDam.capacityMegaLitres,
        source: readingSource,
      };

      await apiClient.post(`/api/v1/dams/${selectedDam.id}/readings`, payload);

      setDams((prev) =>
        prev.map((d) =>
          d.id === selectedDam.id
            ? {
                ...d,
                latestLevelPercent: percent,
                volumeMegaLitres: (percent / 100) * d.capacityMegaLitres,
                statusBand: percent < 30 ? 'Critical' : percent < 60 ? 'Watch' : 'Healthy',
                statusColor: percent < 30 ? 'Red' : percent < 60 ? 'Amber' : 'Green',
                lastUpdatedCAT: 'Just now (CAT)',
              }
            : d
        )
      );

      setFeedback({ type: 'success', message: `Reading of ${percent}% successfully logged for ${selectedDam.name}.` });
      setIsReadingModalOpen(false);
    } catch (err) {
      console.warn('API error recording reading, applying locally for preview:', err);
      setDams((prev) =>
        prev.map((d) =>
          d.id === selectedDam.id
            ? {
                ...d,
                latestLevelPercent: percent,
                volumeMegaLitres: (percent / 100) * d.capacityMegaLitres,
                statusBand: percent < 30 ? 'Critical' : percent < 60 ? 'Watch' : 'Healthy',
                statusColor: percent < 30 ? 'Red' : percent < 60 ? 'Amber' : 'Green',
                lastUpdatedCAT: 'Just now (CAT)',
              }
            : d
        )
      );
      setFeedback({ type: 'success', message: `Reading logged for ${selectedDam.name} (Preview Mode).` });
      setIsReadingModalOpen(false);
    }
  };

  const handleCreateDam = async (e) => {
    e.preventDefault();
    if (!newDamName || !newDamLat || !newDamLng || !newDamCapacity) {
      setFeedback({ type: 'error', message: 'Please fill in all dam creation fields.' });
      return;
    }

    const payload = {
      name: newDamName,
      latitude: parseFloat(newDamLat),
      longitude: parseFloat(newDamLng),
      capacityMegaLitres: parseFloat(newDamCapacity),
    };

    try {
      const res = await apiClient.post('/api/v1/dams', payload);
      const created = res.data || {
        id: Date.now(),
        ...payload,
        latestLevelPercent: 50.0,
        volumeMegaLitres: payload.capacityMegaLitres * 0.5,
        statusBand: 'Watch',
        statusColor: 'Amber',
        lastUpdatedCAT: 'Just now (CAT)',
      };
      setDams((prev) => [...prev, created]);
      setFeedback({ type: 'success', message: `Reservoir "${newDamName}" registered successfully.` });
      setIsCreateModalOpen(false);
      setNewDamName('');
      setNewDamCapacity('');
    } catch (err) {
      console.warn('API error creating dam, applying locally for preview:', err);
      const mockDam = {
        id: Date.now(),
        ...payload,
        latestLevelPercent: 50.0,
        volumeMegaLitres: payload.capacityMegaLitres * 0.5,
        statusBand: 'Watch',
        statusColor: 'Amber',
        lastUpdatedCAT: 'Just now (CAT)',
      };
      setDams((prev) => [...prev, mockDam]);
      setFeedback({ type: 'success', message: `Reservoir "${newDamName}" added (Preview Mode).` });
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>Water Resource Administration</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Dams &amp; Reservoir Readings
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Record certified daily gauge levels and inspect municipal reservoir capacities.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Reservoir</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-md border flex items-center space-x-3 text-xs md:text-sm ${
            feedback.type === 'success'
              ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Dams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {dams.map((dam) => {
          const level = dam.latestLevelPercent ?? 0;
          return (
            <div
              key={dam.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      ID #{dam.id}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#152e52] mt-1.5">{dam.name}</h3>
                    <p className="text-xs text-slate-500 font-normal">{dam.areaName || 'Sol Plaatje Municipal Area'}</p>
                  </div>
                  <StatusBadge status={dam.statusBand || 'Healthy'} />
                </div>

                {/* Progress Level Bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Current Gauge Capacity</span>
                    <span className="font-serif font-bold text-[#152e52]">{level.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        level < 30 ? 'bg-red-600' : level < 60 ? 'bg-amber-500' : 'bg-[#2e7d32]'
                      }`}
                      style={{ width: `${Math.min(level, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
                  <div className="bg-[#f8fafc] p-2.5 rounded-md border border-slate-200">
                    <p className="text-slate-500">Total Capacity</p>
                    <p className="text-sm font-serif font-bold text-[#152e52] mt-0.5">
                      {dam.capacityMegaLitres} ML
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] p-2.5 rounded-md border border-slate-200">
                    <p className="text-slate-500">Current Volume</p>
                    <p className="text-sm font-serif font-bold text-[#152e52] mt-0.5">
                      {(dam.volumeMegaLitres ?? (dam.capacityMegaLitres * (level / 100))).toFixed(1)} ML
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-3 font-normal">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Last Reading: {dam.lastUpdatedCAT || 'Today, 08:00 (CAT)'}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleOpenReadingModal(dam)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 font-medium text-xs md:text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#152e52]" />
                  <span>Record Gauge Reading</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Reading Modal */}
      {isReadingModalOpen && selectedDam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Record Water Level Reading
              </h3>
              <button onClick={() => setIsReadingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Enter official certified water gauge measurement for <strong className="text-[#152e52]">{selectedDam.name}</strong>.
            </p>

            <form onSubmit={handleRecordReading} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Water Level Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={readingPercent}
                    onChange={(e) => setReadingPercent(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                    placeholder="e.g. 64.5"
                  />
                  <span className="absolute right-3 top-2 text-sm font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Reading Source
                </label>
                <select
                  value={readingSource}
                  onChange={(e) => setReadingSource(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="Manual">Manual Gauge Inspection</option>
                  <option value="Telemetry">Municipal Telemetry Sensor</option>
                  <option value="Scada">SCADA System</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReadingModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Submit Certified Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reservoir Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Register New Reservoir
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Add a municipal dam or reservoir to the Sol Plaatje monitoring grid.
            </p>

            <form onSubmit={handleCreateDam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Reservoir / Dam Name
                </label>
                <input
                  type="text"
                  value={newDamName}
                  onChange={(e) => setNewDamName(e.target.value)}
                  required
                  placeholder="e.g. Galeshewe High Tank"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Capacity (MegaLitres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newDamCapacity}
                  onChange={(e) => setNewDamCapacity(e.target.value)}
                  required
                  placeholder="e.g. 75.0"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newDamLat}
                    onChange={(e) => setNewDamLat(e.target.value)}
                    required
                    placeholder="-28.7419"
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newDamLng}
                    onChange={(e) => setNewDamLng(e.target.value)}
                    required
                    placeholder="24.7719"
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Register Reservoir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDams;
