import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Calendar, Clock, CheckCircle, AlertCircle, ArrowUpRight, Search } from 'lucide-react';
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
      lastUpdatedSast: 'Today at 08:30 (SAST)',
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
      lastUpdatedSast: 'Today at 07:15 (SAST)',
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

      // Update state locally
      setDams((prev) =>
        prev.map((d) =>
          d.id === selectedDam.id
            ? {
                ...d,
                latestLevelPercent: percent,
                volumeMegaLitres: (percent / 100) * d.capacityMegaLitres,
                statusBand: percent < 30 ? 'Critical' : percent < 60 ? 'Watch' : 'Healthy',
                statusColor: percent < 30 ? 'Red' : percent < 60 ? 'Amber' : 'Green',
                lastUpdatedSast: 'Just now (SAST)',
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
                lastUpdatedSast: 'Just now (SAST)',
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
        lastUpdatedSast: 'Just now (SAST)',
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
        lastUpdatedSast: 'Just now (SAST)',
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Droplet className="w-3.5 h-3.5" />
            <span>Water Resource Administration</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            Dams &amp; Reservoir Readings
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Record certified daily gauge levels and inspect municipal reservoir capacities.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-bold text-xs md:text-sm transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Reservoir</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs md:text-sm ${
            feedback.type === 'success'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
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
              className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/20">
                      ID #{dam.id}
                    </span>
                    <h3 className="text-lg font-bold text-[#E6EDF7] mt-1.5">{dam.name}</h3>
                    <p className="text-xs text-[#8A9BB8]">{dam.areaName || 'Sol Plaatje Municipal Area'}</p>
                  </div>
                  <StatusBadge status={dam.statusBand || 'Healthy'} />
                </div>

                {/* Progress Level Bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8A9BB8]">Current Gauge Capacity</span>
                    <span className="font-bold text-[#E6EDF7]">{level.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#0B1220] rounded-full overflow-hidden border border-[#1F2C45]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        level < 30 ? 'bg-[#EF4444]' : level < 60 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                      }`}
                      style={{ width: `${Math.min(level, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1F2C45] text-xs">
                  <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1F2C45]/60">
                    <p className="text-[#8A9BB8]">Total Capacity</p>
                    <p className="text-sm font-bold text-[#E6EDF7] mt-0.5">
                      {dam.capacityMegaLitres} ML
                    </p>
                  </div>
                  <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1F2C45]/60">
                    <p className="text-[#8A9BB8]">Current Volume</p>
                    <p className="text-sm font-bold text-[#22D3EE] mt-0.5">
                      {(dam.volumeMegaLitres ?? (dam.capacityMegaLitres * (level / 100))).toFixed(1)} ML
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-[#8A9BB8] mt-3">
                  <Clock className="w-3 h-3" />
                  <span>Last Reading: {dam.lastUpdatedSast || 'Today, 08:00 (SAST)'}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-[#1F2C45]">
                <button
                  onClick={() => handleOpenReadingModal(dam)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[#22D3EE] font-semibold text-xs md:text-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Gauge Reading</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Reading Modal */}
      {isReadingModalOpen && selectedDam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#E6EDF7]">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Record Water Level Reading
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Enter the official certified water gauge measurement for <strong className="text-[#22D3EE]">{selectedDam.name}</strong>.
            </p>

            <form onSubmit={handleRecordReading} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-1">
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
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                    placeholder="e.g. 64.5"
                  />
                  <span className="absolute right-3.5 top-2.5 text-sm font-bold text-[#8A9BB8]">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-1">
                  Reading Source
                </label>
                <select
                  value={readingSource}
                  onChange={(e) => setReadingSource(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                >
                  <option value="Manual">Manual Gauge Inspection</option>
                  <option value="Telemetry">Municipal Telemetry Sensor</option>
                  <option value="Scada">SCADA System</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <button
                  type="button"
                  onClick={() => setIsReadingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7] hover:bg-[#1F2C45]/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#E6EDF7]">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Register New Reservoir
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Add a municipal dam or reservoir to the Sol Plaatje monitoring grid.
            </p>

            <form onSubmit={handleCreateDam} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Reservoir / Dam Name
                </label>
                <input
                  type="text"
                  value={newDamName}
                  onChange={(e) => setNewDamName(e.target.value)}
                  required
                  placeholder="e.g. Galeshewe High Tank"
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Capacity (MegaLitres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newDamCapacity}
                  onChange={(e) => setNewDamCapacity(e.target.value)}
                  required
                  placeholder="e.g. 75.0"
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newDamLat}
                    onChange={(e) => setNewDamLat(e.target.value)}
                    required
                    placeholder="-28.7419"
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newDamLng}
                    onChange={(e) => setNewDamLng(e.target.value)}
                    required
                    placeholder="24.7719"
                    className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3 py-2 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22D3EE] text-[#0B1220] font-bold text-xs shadow-md"
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
