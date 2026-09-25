import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle, AlertCircle, Navigation, ChevronRight, Layers } from 'lucide-react';
import apiClient from '../../api/client';

export function ManageRoutes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Galeshewe Zone 3 Morning Route',
      areaId: 1,
      areaName: 'Galeshewe',
      isActive: true,
      stops: [
        { id: 101, sequence: 1, name: 'Galeshewe Police Station Water Point', latitude: -28.7183, longitude: 24.7319 },
        { id: 102, sequence: 2, name: 'Tshwarelela Primary Drop Point', latitude: -28.7125, longitude: 24.7291 },
        { id: 103, sequence: 3, name: 'Mayibuye Community Centre', latitude: -28.7098, longitude: 24.7245 },
      ],
    },
    {
      id: 2,
      name: 'Kimberley Central Bulk Delivery',
      areaId: 2,
      areaName: 'Kimberley Central',
      isActive: true,
      stops: [
        { id: 201, sequence: 1, name: 'Sol Plaatje Civic Centre Reservoir', latitude: -28.7419, longitude: 24.7719 },
        { id: 202, sequence: 2, name: 'Kimberley Hospital Water Reserve', latitude: -28.7388, longitude: 24.7645 },
      ],
    },
    {
      id: 3,
      name: 'Roodepan Standby & Emergency Grid',
      areaId: 3,
      areaName: 'Roodepan',
      isActive: true,
      stops: [
        { id: 301, sequence: 1, name: 'Roodepan Municipal Depot', latitude: -28.6921, longitude: 24.7088 },
        { id: 302, sequence: 2, name: 'Lerato Park Water Tanks', latitude: -28.6854, longitude: 24.7012 },
      ],
    },
  ]);

  const municipalAreas = [
    { id: 1, name: 'Galeshewe' },
    { id: 2, name: 'Kimberley Central' },
    { id: 3, name: 'Roodepan' },
  ];

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [routeName, setRouteName] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('1');
  const [stops, setStops] = useState([
    { name: '', latitude: '-28.7419', longitude: '24.7719' },
  ]);

  // Fetch routes from backend
  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/routes');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setRoutes(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded routes data.', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  const handleAddStopField = () => {
    setStops((prev) => [...prev, { name: '', latitude: '-28.7419', longitude: '24.7719' }]);
  };

  const handleRemoveStopField = (index) => {
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStopChange = (index, field, value) => {
    setStops((prev) =>
      prev.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop))
    );
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!routeName.trim()) {
      setFeedback({ type: 'error', message: 'Route name is required.' });
      return;
    }

    const formattedStops = stops
      .filter((s) => s.name.trim() !== '')
      .map((s, idx) => ({
        sequence: idx + 1,
        name: s.name.trim(),
        latitude: parseFloat(s.latitude) || -28.7419,
        longitude: parseFloat(s.longitude) || 24.7719,
      }));

    if (formattedStops.length === 0) {
      setFeedback({ type: 'error', message: 'Please add at least one delivery stop.' });
      return;
    }

    const payload = {
      name: routeName.trim(),
      areaId: parseInt(selectedAreaId),
      stops: formattedStops,
    };

    const areaName = municipalAreas.find((a) => a.id === parseInt(selectedAreaId))?.name || 'Municipal Area';

    try {
      const res = await apiClient.post('/api/v1/routes', payload);
      const created = res.data || {
        id: Date.now(),
        ...payload,
        areaName,
        isActive: true,
      };
      setRoutes((prev) => [...prev, created]);
      setFeedback({ type: 'success', message: `Route "${routeName}" created with ${formattedStops.length} stops.` });
      setIsCreateModalOpen(false);
      setRouteName('');
      setStops([{ name: '', latitude: '-28.7419', longitude: '24.7719' }]);
    } catch (err) {
      console.warn('API error creating route, applying locally for preview:', err);
      const mockCreated = {
        id: Date.now(),
        ...payload,
        areaName,
        isActive: true,
      };
      setRoutes((prev) => [...prev, mockCreated]);
      setFeedback({ type: 'success', message: `Route "${routeName}" added (Preview Mode).` });
      setIsCreateModalOpen(false);
      setRouteName('');
      setStops([{ name: '', latitude: '-28.7419', longitude: '24.7719' }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Distribution Network</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            Delivery Routes &amp; Water Drop Points
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Configure scheduled routes, municipal zone coverage, and sequenced community collection points.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-bold text-xs md:text-sm transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Create New Route</span>
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

      {/* Routes List */}
      <div className="space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1F2C45]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#22D3EE]/10 rounded-xl text-[#22D3EE]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#E6EDF7]">{route.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5 text-xs text-[#8A9BB8]">
                    <span className="text-[#22D3EE] font-medium">{route.areaName}</span>
                    <span>·</span>
                    <span>{route.stops?.length || 0} scheduled drop points</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 self-start sm:self-auto">
                Active Route
              </span>
            </div>

            {/* Sequence of stops */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider mb-3">
                Sequenced Drop Points
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {route.stops?.map((stop, idx) => (
                  <div
                    key={stop.id || idx}
                    className="bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3 flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {stop.sequence || idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#E6EDF7] truncate">{stop.name}</p>
                      <p className="text-[10px] text-[#8A9BB8] mt-0.5 font-mono">
                        {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Route Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-xl shadow-2xl text-[#E6EDF7] my-8">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Create Scheduled Route
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Define a new delivery corridor and add community drop points.
            </p>

            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Route Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Galeshewe Zone 4 Afternoon Circuit"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  required
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Municipal Area
                </label>
                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                >
                  {municipalAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[#8A9BB8] uppercase">
                    Delivery Stops
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStopField}
                    className="inline-flex items-center space-x-1 text-xs text-[#22D3EE] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stop</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0B1220] border border-[#1F2C45] rounded-xl p-3 flex items-center space-x-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Stop name (e.g. Clinic Water Tank)"
                        value={stop.name}
                        onChange={(e) => handleStopChange(idx, 'name', e.target.value)}
                        required
                        className="flex-1 bg-[#111B2E] border border-[#1F2C45] rounded-lg px-2.5 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lat"
                        value={stop.latitude}
                        onChange={(e) => handleStopChange(idx, 'latitude', e.target.value)}
                        className="w-20 bg-[#111B2E] border border-[#1F2C45] rounded-lg px-2 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lng"
                        value={stop.longitude}
                        onChange={(e) => handleStopChange(idx, 'longitude', e.target.value)}
                        className="w-20 bg-[#111B2E] border border-[#1F2C45] rounded-lg px-2 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden"
                      />
                      {stops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStopField(idx)}
                          className="p-1 text-[#8A9BB8] hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRoutes;
