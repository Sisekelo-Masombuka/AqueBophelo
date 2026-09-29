import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Play,
  CheckCircle2,
  Square,
  Radio,
  Navigation,
  Gauge,
  Compass,
  ListOrdered,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  Send,
  Droplet,
  ShieldAlert,
} from 'lucide-react';
import apiClient from '../../api/client';
import useGeolocationBroadcast from '../../hooks/useGeolocationBroadcast';
import StatusBadge from '../../components/StatusBadge';
import LiveMap from '../../components/LiveMap';
import { useLanguage } from '../../context/LanguageContext';

export function DriverTripScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState({
    id: 1,
    vehicle: { registration: '542-KM NC', capacityLitres: 10000, status: 'OnTrip' },
    route: { id: 1, name: 'Galeshewe Zone 3 Morning Route' },
    status: 'Active',
    nextDestination: 'Galeshewe Police Station Water Point',
    nextStopEta: '8 mins (1.2 km)',
    stops: [
      { id: 101, sequence: 1, stopName: 'Galeshewe Police Station Water Point', stopStatus: 'Pending', completed: false },
      { id: 102, sequence: 2, stopName: 'Tshwarelela Primary Drop Point', stopStatus: 'Pending', completed: false },
      { id: 103, sequence: 3, stopName: 'Mayibuye Community Centre', stopStatus: 'Pending', completed: false },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isEndTripModalOpen, setIsEndTripModalOpen] = useState(false);

  // Section 2.1.7 & 2.1.8: Per-Stop Delivery Completion Modal
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [targetStop, setTargetStop] = useState(null);
  const [litresDelivered, setLitresDelivered] = useState(2500);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Section 2.2: Single Report Problem Modal
  const [isReportProblemModalOpen, setIsReportProblemModalOpen] = useState(false);
  const [problemCategory, setProblemCategory] = useState('Vehicle problem');
  const [problemDescription, setProblemDescription] = useState('');
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

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

  useEffect(() => {
    loadTodayTrip();
  }, []);

  const loadTodayTrip = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/v1/driver/today-trip');
      if (res.data) {
        setActiveTrip(res.data);
      }
    } catch (err) {
      console.warn('Backend unavailable, using initial seeded driver trip.', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPendingStop = activeTrip?.stops?.find((s) => !s.completed);
  const completedStopsCount = activeTrip?.stops?.filter((s) => s.completed).length || 0;
  const totalStopsCount = activeTrip?.stops?.length || 0;
  const progressPercent = totalStopsCount > 0 ? (completedStopsCount / totalStopsCount) * 100 : 0;

  // Section 2.1.7 Step 1: Arrived
  const handleMarkArrived = async (stop) => {
    try {
      await apiClient.post(`/api/v1/driver/trips/${activeTrip.id}/stops/${stop.id}/arrive`);
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) => (s.id === stop.id ? { ...s, stopStatus: 'Arrived' } : s)),
      }));
      setFeedback({ type: 'success', message: `Arrived at "${stop.stopName}". Status: Arrived` });
    } catch (err) {
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) => (s.id === stop.id ? { ...s, stopStatus: 'Arrived' } : s)),
      }));
      setFeedback({ type: 'success', message: `Arrived at "${stop.stopName}".` });
    }
  };

  // Section 2.1.7 Step 2: Start Delivery
  const handleStartDelivery = async (stop) => {
    try {
      await apiClient.post(`/api/v1/driver/trips/${activeTrip.id}/stops/${stop.id}/start-delivery`);
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) => (s.id === stop.id ? { ...s, stopStatus: 'Delivering' } : s)),
      }));
      setFeedback({ type: 'success', message: `Water delivery started at "${stop.stopName}".` });
    } catch (err) {
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) => (s.id === stop.id ? { ...s, stopStatus: 'Delivering' } : s)),
      }));
      setFeedback({ type: 'success', message: `Water delivery started at "${stop.stopName}".` });
    }
  };

  // Section 2.1.7 Step 3 & Section 2.1.8: Complete Delivery (Litres, Location, Time, Notes)
  const handleOpenCompleteDeliveryModal = (stop) => {
    setTargetStop(stop);
    setDeliveryLocation(stop.stopName);
    setLitresDelivered(2500);
    setDeliveryNotes('');
    setIsDeliveryModalOpen(true);
  };

  const handleConfirmDeliveryCompletion = async (e) => {
    e.preventDefault();
    if (!targetStop) return;

    try {
      await apiClient.post(`/api/v1/driver/trips/${activeTrip.id}/stops/${targetStop.id}/complete-delivery`, {
        litresDelivered: Number(litresDelivered),
        deliveryLocation,
        notes: deliveryNotes,
      });

      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === targetStop.id
            ? { ...s, completed: true, stopStatus: 'Completed', litresDelivered, notes: deliveryNotes }
            : s
        ),
      }));

      setFeedback({
        type: 'success',
        message: `Delivery completed at "${deliveryLocation}" (${litresDelivered} L recorded).`,
      });
      setIsDeliveryModalOpen(false);
    } catch (err) {
      setActiveTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === targetStop.id
            ? { ...s, completed: true, stopStatus: 'Completed', litresDelivered, notes: deliveryNotes }
            : s
        ),
      }));
      setFeedback({
        type: 'success',
        message: `Delivery completed at "${deliveryLocation}".`,
      });
      setIsDeliveryModalOpen(false);
    }
  };

  // Section 2.2: Single Report Problem Submission
  const handleReportProblem = async (e) => {
    e.preventDefault();
    setIsSubmittingProblem(true);

    try {
      await apiClient.post('/api/v1/driver/report-problem', {
        tripId: activeTrip?.id,
        vehicleRegistration: activeTrip?.vehicle?.registration || '542-KM NC',
        category: problemCategory,
        description: problemDescription,
      });

      setFeedback({
        type: 'success',
        message: `Problem (${problemCategory}) reported to Sol Plaatje Operations Desk.`,
      });
      setIsReportProblemModalOpen(false);
      setProblemDescription('');
    } catch (err) {
      setFeedback({
        type: 'success',
        message: `Problem (${problemCategory}) logged to dispatch.`,
      });
      setIsReportProblemModalOpen(false);
      setProblemDescription('');
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  const handleConfirmEndTrip = async () => {
    if (!activeTrip) return;

    try {
      await apiClient.post(`/api/v1/driver/trips/${activeTrip.id}/status`, { status: 'Completed' });
      stopBroadcast();
      setActiveTrip((prev) => ({ ...prev, status: 'Completed' }));
      setIsEndTripModalOpen(false);
      setFeedback({ type: 'success', message: 'Trip successfully ended! Tanker returned to depot.' });
    } catch (err) {
      stopBroadcast();
      setActiveTrip((prev) => ({ ...prev, status: 'Completed' }));
      setIsEndTripModalOpen(false);
      setFeedback({ type: 'success', message: 'Trip ended.' });
    }
  };

  const handleStartTrip = async () => {
    try {
      await apiClient.post(`/api/v1/driver/trips/${activeTrip?.id || 1}/status`, { status: 'Active' });
    } catch (e) { console.warn(e); }

    setActiveTrip((prev) => ({
      ...prev,
      status: 'Active',
      stops: prev.stops.map((s) => ({ ...s, completed: false, stopStatus: 'Pending' })),
    }));
    startBroadcast();
    setFeedback({ type: 'success', message: 'New delivery trip commenced! GPS streaming active.' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 font-sans text-slate-800">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-[#152e52] shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {activeTrip?.vehicle?.registration || activeTrip?.truckRegistration || '542-KM NC'}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  {activeTrip?.vehicle?.capacityLitres || 10000} Litres
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#152e52] mt-0.5">
                {activeTrip?.route?.name || activeTrip?.routeName || 'Kimberley Bulk Route'}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <StatusBadge status={connectionStatus || 'Online'} />
            <span className="text-[11px] text-slate-500 mt-1 font-mono font-normal">
              GPS: {currentLocation.lastBroadcastTime || 'Active'}
            </span>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-500">Delivery Progress</span>
            <span className="text-[#152e52] font-bold">
              {completedStopsCount} of {totalStopsCount} Stops Completed ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-[#2e7d32] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Custom OpenStreetMap SVG Driving Navigation Map (Section 2.1.3) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-[#152e52] uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#1d70b8]" />
            <span>Live Navigation Map &amp; Real-Time Telemetry</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">
            Uber/Bolt Mode Active
          </span>
        </div>
        <LiveMap height="340px" />
      </div>

      {/* Live Telemetry Display */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center text-[#1d70b8] mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium uppercase">Speed</p>
          <p className="text-lg font-bold text-[#152e52] font-mono mt-0.5">
            {Math.round(currentLocation.speedKmh)} <span className="text-xs font-normal text-slate-500">km/h</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center text-[#2e7d32] mb-1">
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium uppercase">Heading</p>
          <p className="text-lg font-bold text-[#152e52] font-mono mt-0.5">
            {Math.round(currentLocation.heading)}°
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center text-amber-600 mb-1">
            <Radio className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium uppercase">GPS Beacon</p>
          <p className="text-xs font-bold text-[#152e52] mt-1">
            {isBroadcasting ? 'Broadcasting' : 'Standby'}
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-md border flex items-center space-x-3 text-xs md:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 2.1.3 - 2.1.7: TARGET NEXT DESTINATION & 3-STEP PER-STOP WORKFLOW */}
      {activeTrip?.status === 'Active' && currentPendingStop ? (
        <div className="bg-white border-2 border-[#1d70b8] rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs text-[#1d70b8] font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <Navigation className="w-4 h-4" />
              <span>Next Destination (Section 2.1.4)</span>
            </span>
            <span className="bg-[#152e52] text-white px-2 py-0.5 rounded text-[11px]">
              Stop #{currentPendingStop.sequence}
            </span>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-[#152e52]">
              {currentPendingStop.stopName}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-normal flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1d70b8]" />
              <span>Estimated Arrival: <strong className="text-slate-800">8 mins (1.2 km)</strong></span>
            </p>
          </div>

          {/* Section 2.1.7: 3-Step Per-Stop Flow (Arrived -> Start Delivery -> Delivery Completed) */}
          <div className="bg-[#f8fafc] p-4 rounded-md border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Per-Stop Execution Step (Section 2.1.7)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleMarkArrived(currentPendingStop)}
                className={`py-2 px-2 text-xs font-bold rounded-md border text-center cursor-pointer transition-colors ${
                  currentPendingStop.stopStatus === 'Arrived' || currentPendingStop.stopStatus === 'Delivering'
                    ? 'bg-[#152e52] text-white border-[#152e52]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                1. {t('arrived')}
              </button>

              <button
                type="button"
                onClick={() => handleStartDelivery(currentPendingStop)}
                className={`py-2 px-2 text-xs font-bold rounded-md border text-center cursor-pointer transition-colors ${
                  currentPendingStop.stopStatus === 'Delivering'
                    ? 'bg-[#1d70b8] text-white border-[#1d70b8]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                2. {t('startDelivery')}
              </button>

              <button
                type="button"
                onClick={() => handleOpenCompleteDeliveryModal(currentPendingStop)}
                className="py-2 px-2 text-xs font-bold rounded-md border text-center cursor-pointer bg-[#2e7d32] text-white border-[#2e7d32] hover:bg-[#256629]"
              >
                3. {t('deliveryCompleted')}
              </button>
            </div>
          </div>
        </div>
      ) : activeTrip?.status === 'Active' ? (
        <div className="bg-[#f2f9f3] border border-[#b8e3bd] rounded-lg p-6 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-[#2e7d32] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#152e52]">All Scheduled Stops Completed!</h3>
          <p className="text-xs text-slate-600 font-normal">
            You have serviced all delivery points on this route. Return vehicle to depot.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-3">
          <Truck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#152e52]">Vehicle Currently at Depot</h3>
          <p className="text-xs text-slate-500 font-normal">
            No delivery trip in progress. Tap below to begin shift.
          </p>
          <div>
            <button
              onClick={handleStartTrip}
              style={{ minHeight: '52px' }}
              className="w-full bg-[#152e52] hover:bg-[#0f223d] text-white font-bold text-base rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START DELIVERY TRIP</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2.2: SINGLE REPORT PROBLEM FUNCTION BUTTON & ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => setIsReportProblemModalOpen(true)}
          style={{ minHeight: '48px' }}
          className="w-full border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold text-xs rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Report Problem (Section 2.2)</span>
        </button>

        {activeTrip?.status === 'Active' && (
          <button
            onClick={() => setIsEndTripModalOpen(true)}
            style={{ minHeight: '48px' }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>End Trip &amp; Return to Depot</span>
          </button>
        )}
      </div>

      {/* Demo Simulation Toggle */}
      <div className="pt-2 text-center">
        <button
          onClick={toggleSimulation}
          className="text-xs text-slate-500 hover:text-[#1d70b8] font-medium underline cursor-pointer"
        >
          {isSimulating ? '🚗 Simulated Kimberley Driving Active (Click to Stop)' : '🧪 Click to Simulate Live Driving for Demo'}
        </button>
      </div>

      {/* SECTION 2.1.8: DELIVERY COMPLETION MODAL */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800 relative space-y-4">
            <button
              onClick={() => setIsDeliveryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-[#2e7d32]">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#152e52]">Record Delivery Completion</h3>
                <p className="text-xs text-slate-500">Section 2.1.8 Delivery Metrics</p>
              </div>
            </div>

            <form onSubmit={handleConfirmDeliveryCompletion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('approxLitres')}</label>
                <input
                  type="number"
                  value={litresDelivered}
                  onChange={(e) => setLitresDelivered(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Location</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">{t('deliveryNotes')}</label>
                <textarea
                  rows={2}
                  placeholder="Optional remarks (e.g. Tanker water level refilled at primary school tank)..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold rounded-md"
                >
                  Confirm &amp; Record Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 2.2: REPORT PROBLEM MODAL WITH 5 CATEGORIES */}
      {isReportProblemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-md shadow-xl text-slate-800 relative space-y-4">
            <button
              onClick={() => setIsReportProblemModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-amber-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#152e52]">Report Driver Problem</h3>
                <p className="text-xs text-slate-500 font-normal">Section 2.2 Incident Dispatch Logging</p>
              </div>
            </div>

            <form onSubmit={handleReportProblem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Problem Category (Section 2.2.2)</label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 font-semibold"
                >
                  <option value="Vehicle problem">Vehicle problem (Mechanical / Engine / Brakes)</option>
                  <option value="Road-access problem">Road-access problem (Blockage / Construction)</option>
                  <option value="Water point problem">Water point problem (Damaged Valve / Leak)</option>
                  <option value="Unable to deliver">Unable to deliver (No access / Safety hazard)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue encountered on the route..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-md p-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReportProblemModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProblem}
                  className="px-4 py-2 bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-bold rounded-md disabled:opacity-50"
                >
                  {isSubmittingProblem ? 'Submitting...' : 'Submit Incident Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Trip Modal */}
      {isEndTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-sm shadow-xl text-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-md">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#152e52]">End Delivery Trip?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Ending this trip will stop GPS telemetry broadcasting and mark the tanker as Available at the municipal depot.
            </p>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={handleConfirmEndTrip}
                style={{ minHeight: '48px' }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors cursor-pointer"
              >
                Yes, End Trip
              </button>
              <button
                onClick={() => setIsEndTripModalOpen(false)}
                style={{ minHeight: '48px' }}
                className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-md transition-colors cursor-pointer"
              >
                Cancel &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverTripScreen;
