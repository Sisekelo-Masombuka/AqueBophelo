import React, { useState, useEffect } from 'react';
import { Truck, Plus, UserCheck, ShieldAlert, CheckCircle, AlertCircle, Wrench, Search, Radio } from 'lucide-react';
import apiClient from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

export function ManageTrucks() {
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
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
      registrationNumber: 'NC-882-KM',
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
      registrationNumber: 'NC-104-KM',
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
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Municipal Fleet Administration</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
            Water Tankers &amp; Driver Roster
          </h2>
          <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
            Register municipal water delivery vehicles, inspect mechanical readiness, and allocate staff drivers.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#22D3EE]/90 text-[#0B1220] font-bold text-xs md:text-sm transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Register New Tanker</span>
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

      {/* Search & Stats Bar */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A9BB8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by registration (e.g. NC-542-KM) or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#8A9BB8]">
          <span>Total Fleet: <strong className="text-[#E6EDF7]">{trucks.length}</strong></span>
          <span>·</span>
          <span>Active: <strong className="text-[#22C55E]">{trucks.filter((t) => t.status === 'OnTrip').length}</strong></span>
          <span>·</span>
          <span>Available: <strong className="text-[#22D3EE]">{trucks.filter((t) => t.status === 'Available').length}</strong></span>
        </div>
      </div>

      {/* Trucks Table */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-[#E6EDF7]">
            <thead className="bg-[#0B1220] text-[#8A9BB8] uppercase text-[11px] font-semibold tracking-wider border-b border-[#1F2C45]">
              <tr>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">Last Telemetry</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2C45]">
              {filteredTrucks.map((truck) => (
                <tr key={truck.id} className="hover:bg-[#16233B]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#22D3EE]">
                    {truck.registrationNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#E6EDF7]">
                    {truck.capacityLitres?.toLocaleString()} L
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={truck.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[#E6EDF7]">
                    {truck.driverName ? (
                      <span className="inline-flex items-center space-x-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                        <span>{truck.driverName}</span>
                      </span>
                    ) : (
                      <span className="text-[#8A9BB8] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#8A9BB8]">
                    {truck.lastSeenAtFormatted || 'Never seen'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(truck)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[#22D3EE] font-semibold text-xs transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#E6EDF7]">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Register Water Tanker
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Add a municipal bulk water truck to the Sol Plaatje delivery fleet.
            </p>

            <form onSubmit={handleRegisterTruck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Registration Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. NC-942-KM"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  required
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm uppercase font-mono text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Water Tank Capacity (Litres)
                </label>
                <select
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                >
                  <option value="5000">5,000 Litres (Compact Tanker)</option>
                  <option value="10000">10,000 Litres (Standard Tanker)</option>
                  <option value="15000">15,000 Litres (Heavy Tanker)</option>
                  <option value="20000">20,000 Litres (Bulk Articulated)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22D3EE] text-[#0B1220] font-bold text-xs shadow-md"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#E6EDF7]">
            <h3 className="text-lg font-bold text-[#E6EDF7] mb-1">
              Assign Municipal Driver
            </h3>
            <p className="text-xs text-[#8A9BB8] mb-4">
              Allocate a certified driver to operate tanker <strong className="text-[#22D3EE] font-mono">{selectedTruck.registrationNumber}</strong>.
            </p>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A9BB8] uppercase mb-1">
                  Select Certified Driver
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-[#0B1220] border border-[#1F2C45] rounded-xl px-3.5 py-2.5 text-sm text-[#E6EDF7] focus:outline-hidden focus:border-[#22D3EE]"
                >
                  <option value="">-- Unassigned (Standby) --</option>
                  {municipalDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F2C45]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A9BB8] hover:text-[#E6EDF7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#22D3EE] text-[#0B1220] font-bold text-xs shadow-md"
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
