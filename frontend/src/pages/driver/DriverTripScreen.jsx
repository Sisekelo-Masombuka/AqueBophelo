import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Play,
  CheckCircle2,
  Square,
  Radio,
  Navigation,
  MapPin,
  AlertTriangle,
  Clock,
  Gauge,
  Compass,
  ArrowRight,
  ListOrdered,
} from 'lucide-react';
import apiClient from '../../api/client';
import useGeolocationBroadcast from '../../hooks/useGeolocationBroadcast';

export function DriverTripScreen() {
  const navigate = useNavigate();

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState({
    id: 1,
    truckId: 1,
    truckRegistration: 'NC-542-KM',
    routeName: 'Galeshewe Zone 3 Morning Route',
    status: 'Active',
    startedAtFormatted: 'Today at 08:00 AM (CAT)',
    stops: [
      { id: 101, sequence: 1, stopName: 'Galeshewe Police Station Water Point', completed: true, arrivedAtFormatted: '08:15 AM' },
      { id: 102, sequence: 2, stopName: 'Tshwarelela Primary Drop Point', completed: false, arrivedAtFormatted: 'En Route' },
      { id: 103, sequence: 3, stopName: 'Mayibuye Community Centre', completed: false, arrivedAtFormatted: 'Pending' },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isEndTripModalOpen, setIsEndTripModalOpen] = useState(false);

  // GPS Broadcast Hook
  const {
    isBroadcasting,
    isSimulating,
    connectionStatus,
    currentLocation,
    startBroadcast,
    stopBroadcast,
    toggleSimulation,
  } = useGeolocationBroadcast({
    tripId: activeTrip?.id,
    initialActive: true,
  });

  // Fetch active trips on mount
  useEffect(() => {
    async function loadActiveTrip() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/trips/active');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setActiveTrip(res.data[0]);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded trip.', err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveTrip();
  }, []);

  // Compute next pending stop
  const currentPendingStop = activeTrip?.stops?.find((s) => !s.completed);
  const completedStopsCount = activeTrip?.stops?.filter((s) => s.completed).length || 0;
  const totalStopsCount = activeTrip?.stops?.length || 0;
  const progressPercent = totalStopsCount > 0 ? (completedStopsCount / totalStopsCount) * 100 : 0;

  // Complete current stop
  const handleMarkStopComplete = async () => {
    if (!activeTrip || !currentPendingStop) return;

    try {
      await apiClient.post(
        `/api/v1/trips/${activeTrip.id}/stops/${currentPendingStop.id}/complete`
      );

      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === currentPendingStop.id ? { ...s, completed: true, arrivedAtFormatted: 'Completed Just Now' } : s
        ),
      }));

      setFeedback({
        type: 'success',
        message: `Stop "${currentPendingStop.stopName}" marked complete!`,
      });
    } catch (err) {
      console.warn('API error completing stop, updating locally:', err);
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === currentPendingStop.id ? { ...s, completed: true, arrivedAtFormatted: 'Completed (Preview)' } : s
        ),
      }));
      setFeedback({
        type: 'success',
        message: `Stop "${currentPendingStop.stopName}" completed (Preview Mode).`,
      });
    }
  };

  // End entire trip
  const handleConfirmEndTrip = async () => {
    if (!activeTrip) return;

    try {
      await apiClient.post(`/api/v1/trips/${activeTrip.id}/end`);
      stopBroadcast();
      setActiveTrip((prev) => ({ ...prev, status: 'Completed' }));
      setIsEndTripModalOpen(false);
      setFeedback({ type: 'success', message: 'Trip successfully ended! Water tanker returned to depot.' });
    } catch (err) {
      console.warn('API error ending trip, applying locally:', err);
      stopBroadcast();
      setActiveTrip((prev) => ({ ...prev, status: 'Completed' }));
      setIsEndTripModalOpen(false);
      setFeedback({ type: 'success', message: 'Trip ended (Preview Mode).' });
    }
  };

  // Start new trip
  const handleStartTrip = () => {
    setActiveTrip((prev) => ({
      ...prev,
      status: 'Active',
      stops: prev.stops.map((s) => ({ ...s, completed: false })),
    }));
    startBroadcast();
    setFeedback({ type: 'success', message: 'New delivery trip commenced! GPS streaming active.' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Top Driver Status Bar */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-4 md:p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-xl text-[#22C55E]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/20">
                  {activeTrip?.truckRegistration || 'NC-542-KM'}
                </span>
                <span className="text-xs text-[#8A9BB8]">10,000 Litres</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-[#E6EDF7] mt-0.5">
                {activeTrip?.routeName || 'Kimberley Bulk Route'}
              </h2>
            </div>
          </div>

          {/* Connection Status Pill */}
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span>{connectionStatus}</span>
            </div>
            <span className="text-[10px] text-[#8A9BB8] mt-1 font-mono">
              GPS: {currentLocation.lastBroadcastTime || 'Active'}
            </span>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="mt-4 pt-4 border-t border-[#1F2C45]">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#8A9BB8]">Delivery Progress</span>
            <span className="font-bold text-[#22D3EE]">
              {completedStopsCount} of {totalStopsCount} Stops Completed ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#0B1220] rounded-full overflow-hidden border border-[#1F2C45]">
            <div
              className="h-full bg-gradient-to-r from-[#22D3EE] to-[#22C55E] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Live Telemetry Display */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-3.5 text-center shadow-md">
          <div className="flex items-center justify-center text-[#22D3EE] mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#8A9BB8] uppercase font-bold tracking-wider">Speed</p>
          <p className="text-lg font-black text-[#E6EDF7] font-mono mt-0.5">
            {Math.round(currentLocation.speedKmh)} <span className="text-xs font-normal text-[#8A9BB8]">km/h</span>
          </p>
        </div>

        <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-3.5 text-center shadow-md">
          <div className="flex items-center justify-center text-[#22C55E] mb-1">
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#8A9BB8] uppercase font-bold tracking-wider">Heading</p>
          <p className="text-lg font-black text-[#E6EDF7] font-mono mt-0.5">
            {Math.round(currentLocation.heading)}°
          </p>
        </div>

        <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-3.5 text-center shadow-md">
          <div className="flex items-center justify-center text-[#F59E0B] mb-1">
            <Radio className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#8A9BB8] uppercase font-bold tracking-wider">GPS Beacon</p>
          <p className="text-xs font-bold text-[#E6EDF7] mt-1.5">
            {isBroadcasting ? 'Broadcasting' : 'Standby'}
          </p>
        </div>
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
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Target Next Stop Card */}
      {activeTrip?.status === 'Active' && currentPendingStop ? (
        <div className="bg-gradient-to-br from-[#111B2E] to-[#16233B] border-2 border-[#22D3EE]/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#22D3EE] font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5">
              <Navigation className="w-4 h-4" />
              <span>Next Scheduled Destination</span>
            </span>
            <span className="bg-[#22D3EE]/20 px-2 py-0.5 rounded text-[11px]">
              Stop #{currentPendingStop.sequence}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#E6EDF7]">
            {currentPendingStop.stopName}
          </h3>
          <p className="text-xs text-[#8A9BB8] mt-1">
            Community bulk water drop-off tank. Confirm filling completion once finished.
          </p>

          {/* OVERSIZED TOUCH TARGET BUTTON: Complete Stop (>= 56px height) */}
          <div className="mt-5">
            <button
              onClick={handleMarkStopComplete}
              style={{ minHeight: '56px' }}
              className="w-full flex items-center justify-center space-x-3 rounded-2xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0B1220] font-black text-base md:text-lg shadow-xl shadow-[#22C55E]/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span>MARK STOP COMPLETED</span>
            </button>
          </div>
        </div>
      ) : activeTrip?.status === 'Active' ? (
        <div className="bg-[#111B2E] border border-[#22C55E]/40 rounded-2xl p-6 text-center shadow-lg">
          <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto mb-2" />
          <h3 className="text-lg font-bold text-[#E6EDF7]">All Scheduled Stops Completed!</h3>
          <p className="text-xs text-[#8A9BB8] mt-1">
            You have serviced all delivery points on this route. Please return tanker to the municipal depot.
          </p>
        </div>
      ) : (
        <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 text-center shadow-lg">
          <Truck className="w-12 h-12 text-[#8A9BB8] mx-auto mb-2" />
          <h3 className="text-lg font-bold text-[#E6EDF7]">Vehicle Currently at Depot</h3>
          <p className="text-xs text-[#8A9BB8] mt-1">
            No delivery trip is currently in progress. Tap below to start your shift.
          </p>
          <div className="mt-4">
            <button
              onClick={handleStartTrip}
              style={{ minHeight: '56px' }}
              className="w-full flex items-center justify-center space-x-3 rounded-2xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0B1220] font-black text-base shadow-lg transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START DELIVERY TRIP</span>
            </button>
          </div>
        </div>
      )}

      {/* Trip Actions & Stops Navigation */}
      {activeTrip?.status === 'Active' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Quick Route Stops View */}
          <button
            onClick={() => navigate('/driver/stops')}
            style={{ minHeight: '48px' }}
            className="flex items-center justify-center space-x-2 rounded-xl bg-[#111B2E] hover:bg-[#16233B] border border-[#1F2C45] text-[#22D3EE] font-bold text-xs md:text-sm transition-all"
          >
            <ListOrdered className="w-4 h-4" />
            <span>View All Route Stops ({totalStopsCount})</span>
          </button>

          {/* OVERSIZED TOUCH TARGET BUTTON: End Trip (>= 48px height) */}
          <button
            onClick={() => setIsEndTripModalOpen(true)}
            style={{ minHeight: '48px' }}
            className="flex items-center justify-center space-x-2 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#EF4444] font-bold text-xs md:text-sm transition-all"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>End Trip &amp; Return to Depot</span>
          </button>
        </div>
      )}

      {/* Simulation / Testing Toggle (Handy for presentation demo) */}
      <div className="pt-2">
        <button
          onClick={toggleSimulation}
          className="w-full text-center text-xs text-[#8A9BB8] hover:text-[#22D3EE] transition-colors py-2"
        >
          {isSimulating ? '🚗 Simulated Kimberley Driving: [Active (Click to Stop)]' : '🧪 Click to Simulate Moving GPS for Presentation Demo'}
        </button>
      </div>

      {/* End Trip Safety Confirmation Modal (HCI Error Prevention) */}
      {isEndTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-[#E6EDF7]">
            <div className="flex items-center space-x-3 text-[#EF4444] mb-3">
              <div className="p-2.5 bg-[#EF4444]/10 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">End Delivery Trip?</h3>
            </div>
            <p className="text-xs text-[#8A9BB8] mb-5">
              Ending this trip will stop GPS telemetry broadcasting and mark the tanker as Available at the municipal depot.
            </p>

            <div className="flex flex-col space-y-2.5">
              <button
                onClick={handleConfirmEndTrip}
                style={{ minHeight: '48px' }}
                className="w-full rounded-xl bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Yes, End Trip
              </button>
              <button
                onClick={() => setIsEndTripModalOpen(false)}
                style={{ minHeight: '48px' }}
                className="w-full rounded-xl bg-[#0B1220] border border-[#1F2C45] text-[#8A9BB8] hover:text-[#E6EDF7] font-semibold text-sm transition-all"
              >
                Cancel &amp; Continue Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverTripScreen;
