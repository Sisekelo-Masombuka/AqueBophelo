import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Navigation, Layers, X } from 'lucide-react';
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Distribution Network</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Delivery Routes &amp; Water Drop Points
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Configure scheduled routes, municipal zone coverage, and sequenced community collection points.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Create New Route</span>
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

      {/* Routes List */}
      <div className="space-y-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <Layers className="w-5 h-5 text-[#152e52] shrink-0" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#152e52]">{route.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500 font-normal">
                    <span className="text-[#1d70b8] font-medium">{route.areaName}</span>
                    <span>·</span>
                    <span>{route.stops?.length || 0} scheduled drop points</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] self-start sm:self-auto">
                Active Route
              </span>
            </div>

            {/* Sequence of stops */}
            <div className="mt-4">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                Sequenced Drop Points
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {route.stops?.map((stop, idx) => (
                  <div
                    key={stop.id || idx}
                    className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#152e52] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {stop.sequence || idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#152e52] truncate">{stop.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono font-normal">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-xl shadow-xl text-slate-800 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Create Scheduled Route
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Define a new delivery corridor and add community drop points.
            </p>

            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Route Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Galeshewe Zone 4 Afternoon Circuit"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Municipal Area
                </label>
                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
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
                  <label className="block text-xs font-medium text-slate-700">
                    Delivery Stops
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStopField}
                    className="inline-flex items-center space-x-1 text-xs text-[#1d70b8] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stop</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {stops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center space-x-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#152e52] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Stop name (e.g. Clinic Water Tank)"
                        value={stop.name}
                        onChange={(e) => handleStopChange(idx, 'name', e.target.value)}
                        required
                        className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lat"
                        value={stop.latitude}
                        onChange={(e) => handleStopChange(idx, 'latitude', e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none"
                      />
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Lng"
                        value={stop.longitude}
                        onChange={(e) => handleStopChange(idx, 'longitude', e.target.value)}
                        className="w-20 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none"
                      />
                      {stops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStopField(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
