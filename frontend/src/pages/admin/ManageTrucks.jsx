import React, { useState, useEffect } from 'react';
import { Truck, Plus, UserCheck, CheckCircle, AlertCircle, Search, X } from 'lucide-react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

export function ManageTrucks() {
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: '542-KM NC',
      capacityLitres: 10000,
      status: 'OnTrip',
      driverId: 'drv-1',
      driverName: 'Sipho Dlamini',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      lastSeenAtFormatted: 'Today at 08:42 AM (CAT)',
    },
    {
      id: 2,
      registrationNumber: '882-KM NC',
      capacityLitres: 15000,
      status: 'OnTrip',
      driverId: 'drv-2',
      driverName: 'Lerato Motsepe',
      lastLatitude: -28.7419,
      lastLongitude: 24.7719,
      lastSeenAtFormatted: 'Today at 08:35 AM (CAT)',
    },
    {
      id: 3,
      registrationNumber: '104-KM NC',
      capacityLitres: 10000,
      status: 'Available',
      driverId: 'drv-3',
      driverName: 'Tshepo Khumalo',
      lastLatitude: -28.6921,
      lastLongitude: 24.7088,
      lastSeenAtFormatted: 'Today at 08:10 AM (CAT)',
    },
  ]);

  // Municipal drivers available for assignment
  const municipalDrivers = [
    { id: 'drv-1', fullName: 'Sipho Dlamini' },
    { id: 'drv-2', fullName: 'Lerato Motsepe' },
    { id: 'drv-3', fullName: 'Tshepo Khumalo' },
    { id: 'drv-4', fullName: 'Kagiso Modise' },
    { id: 'drv-5', fullName: 'Zanele Ndlovu' },
  ];

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);

  // Form states
  const [newReg, setNewReg] = useState('');
  const [newCapacity, setNewCapacity] = useState('10000');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  // Fetch trucks from backend
  useEffect(() => {
    async function loadTrucks() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/trucks');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setTrucks(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded trucks data.', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrucks();
  }, []);

  const handleRegisterTruck = async (e) => {
    e.preventDefault();
    if (!newReg || !newCapacity) return;

    const payload = {
      registrationNumber: newReg.trim().toUpperCase(),
      capacityLitres: parseFloat(newCapacity),
    };

    try {
      const res = await apiClient.post('/api/v1/trucks', payload);
      const created = res.data || {
        id: Date.now(),
        ...payload,
        status: 'Available',
        driverName: 'Unassigned',
        lastSeenAtFormatted: 'Just registered',
      };
      setTrucks((prev) => [...prev, created]);
      setFeedback({ type: 'success', message: `Water tanker ${payload.registrationNumber} registered successfully.` });
      setIsRegisterModalOpen(false);
      setNewReg('');
    } catch (err) {
      console.warn('API error registering truck, applying locally for preview:', err);
      const mockCreated = {
        id: Date.now(),
        ...payload,
        status: 'Available',
        driverName: 'Unassigned',
        lastSeenAtFormatted: 'Just registered (Preview)',
      };
      setTrucks((prev) => [...prev, mockCreated]);
      setFeedback({ type: 'success', message: `Water tanker ${payload.registrationNumber} added (Preview Mode).` });
      setIsRegisterModalOpen(false);
      setNewReg('');
    }
  };

  const handleOpenAssignModal = (truck) => {
    setSelectedTruck(truck);
    setSelectedDriverId(truck.driverId || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedTruck) return;

    const driverObj = municipalDrivers.find((d) => d.id === selectedDriverId);
    const driverName = driverObj ? driverObj.fullName : null;

    try {
      await apiClient.put(`/api/v1/trucks/${selectedTruck.id}/driver`, {
        driverId: selectedDriverId || null,
      });

      setTrucks((prev) =>
        prev.map((t) =>
          t.id === selectedTruck.id
            ? { ...t, driverId: selectedDriverId || null, driverName: driverName || 'Unassigned' }
            : t
        )
      );

      setFeedback({
        type: 'success',
        message: driverName
          ? `Driver ${driverName} assigned to tanker ${selectedTruck.registrationNumber}.`
          : `Driver unassigned from tanker ${selectedTruck.registrationNumber}.`,
      });
      setIsAssignModalOpen(false);
    } catch (err) {
      console.warn('API error assigning driver, applying locally for preview:', err);
      setTrucks((prev) =>
        prev.map((t) =>
          t.id === selectedTruck.id
            ? { ...t, driverId: selectedDriverId || null, driverName: driverName || 'Unassigned' }
            : t
        )
      );
      setFeedback({
        type: 'success',
        message: `Driver updated for ${selectedTruck.registrationNumber} (Preview Mode).`,
      });
      setIsAssignModalOpen(false);
    }
  };

  const filteredTrucks = trucks.filter((truck) =>
    truck.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (truck.driverName && truck.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Municipal Fleet Administration</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Water Tankers &amp; Driver Roster
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
            Register municipal water delivery vehicles, inspect mechanical readiness, and allocate staff drivers.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Register New Tanker</span>
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

      {/* Search & Stats Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by registration (e.g. 542-KM NC) or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#1d70b8]"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-500 font-normal">
          <span>Total Fleet: <strong className="text-[#152e52] font-semibold">{trucks.length}</strong></span>
          <span>·</span>
          <span>Active: <strong className="text-[#2e7d32] font-semibold">{trucks.filter((t) => t.status === 'OnTrip').length}</strong></span>
          <span>·</span>
          <span>Available: <strong className="text-[#1d70b8] font-semibold">{trucks.filter((t) => t.status === 'Available').length}</strong></span>
        </div>
      </div>

      {/* Trucks Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-slate-800">
            <thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Last Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#152e52]">
                    {truck.registrationNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {truck.capacityLitres?.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={truck.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {truck.driverName ? (
                      <span className="inline-flex items-center space-x-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
                        <span>{truck.driverName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 font-normal">
                    {truck.lastSeenAtFormatted || 'Never seen'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(truck)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#152e52]" />
                      <span>Assign Driver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Tanker Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Register Water Tanker
              </h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Add a municipal bulk water truck to the Sol Plaatje delivery fleet.
            </p>

            <form onSubmit={handleRegisterTruck} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Registration Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 942-KM NC"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm uppercase font-mono text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Water Tank Capacity (Litres)
                </label>
                <select
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="5000">5,000 Litres (Compact Tanker)</option>
                  <option value="10000">10,000 Litres (Standard Tanker)</option>
                  <option value="15000">15,000 Litres (Heavy Tanker)</option>
                  <option value="20000">20,000 Litres (Bulk Articulated)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Register Tanker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {isAssignModalOpen && selectedTruck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#152e52]">
                Assign Municipal Driver
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal">
              Allocate a certified driver to operate tanker <strong className="text-[#152e52] font-mono">{selectedTruck.registrationNumber}</strong>.
            </p>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Select Certified Driver
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1d70b8]"
                >
                  <option value="">-- Unassigned (Standby) --</option>
                  {municipalDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Save Driver Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTrucks;
