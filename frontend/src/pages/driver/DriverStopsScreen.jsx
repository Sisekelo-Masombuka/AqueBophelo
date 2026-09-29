import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Clock, ArrowLeft, Navigation, ShieldCheck, 
  MapPin, AlertTriangle, Play, Truck, Check
} from 'lucide-react';
import apiClient from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export function DriverStopsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Delivery Completion Modal State
  const [selectedStopForComplete, setSelectedStopForComplete] = useState(null);
  const [litresDelivered, setLitresDelivered] = useState('2500');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingDelivery, setSubmittingDelivery] = useState(false);

  // Report Problem Modal State
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [problemCategory, setProblemCategory] = useState('Vehicle problem');
  const [problemDescription, setProblemDescription] = useState('');
  const [submittingProblem, setSubmittingProblem] = useState(false);

  const fetchTodayTrip = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/v1/driver/today-trip');
      setTrip(res.data);
      setError(null);
    } catch (err) {
      console.warn('Backend unavailable, fallback to mock trip object', err);
      // Seeded fallback for demonstration
      setTrip({
        id: 1,
        routeName: 'Galeshewe Zone 3 & 4 Water Delivery Line',
        truckRegistration: '542-KM NC',
        status: 'In Progress',
        driverName: 'Sipho Dlamini',
        driverId: 'DRV-8492',
        stops: [
          {
            id: 101,
            sequence: 1,
            stopName: 'Galeshewe Police Station Water Tank',
            latitude: -28.7183,
            longitude: 24.7319,
            stopStatus: 'Completed',
            arrivedAt: '08:15 CAT',
            deliveryStartedAt: '08:18 CAT',
            completedAt: '08:45 CAT',
            litresDelivered: 3500,
            deliveryLocation: 'Police Station Reservoir Tank 1',
            notes: 'Successfully delivered without issues.'
          },
          {
            id: 102,
            sequence: 2,
            stopName: 'Tshwarelela Primary Drop Point',
            latitude: -28.7125,
            longitude: 24.7291,
            stopStatus: 'In Delivery',
            arrivedAt: '09:05 CAT',
            deliveryStartedAt: '09:08 CAT',
            completedAt: null,
            litresDelivered: 0,
            deliveryLocation: '',
            notes: ''
          },
          {
            id: 103,
            sequence: 3,
            stopName: 'Mayibuye Community Centre Tanker Hub',
            latitude: -28.7098,
            longitude: 24.7245,
            stopStatus: 'Pending',
            arrivedAt: null,
            deliveryStartedAt: null,
            completedAt: null,
            litresDelivered: 0,
            deliveryLocation: '',
            notes: ''
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTrip();
  }, []);

  // Step 1: Arrived at stop
  const handleArriveAtStop = async (stop) => {
    try {
      await apiClient.post(`/api/v1/driver/trips/${trip.id}/stops/${stop.id}/arrive`);
      setFeedback({ type: 'success', message: `Arrived at ${stop.stopName}` });
      fetchTodayTrip();
    } catch (err) {
      setFeedback({ type: 'info', message: `Marked Arrived at ${stop.stopName} (Preview)` });
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(s => s.id === stop.id ? { ...s, stopStatus: 'Arrived', arrivedAt: 'Just now (CAT)' } : s)
      }));
    }
  };

  // Step 2: Start Delivery
  const handleStartDelivery = async (stop) => {
    try {
      await apiClient.post(`/api/v1/driver/trips/${trip.id}/stops/${stop.id}/start-delivery`);
      setFeedback({ type: 'success', message: `Delivery started at ${stop.stopName}` });
      fetchTodayTrip();
    } catch (err) {
      setFeedback({ type: 'info', message: `Delivery started at ${stop.stopName} (Preview)` });
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(s => s.id === stop.id ? { ...s, stopStatus: 'In Delivery', deliveryStartedAt: 'Just now (CAT)' } : s)
      }));
    }
  };

  // Step 3 Modal Trigger: Open completion prompt
  const openCompleteModal = (stop) => {
    setSelectedStopForComplete(stop);
    setDeliveryLocation(stop.stopName);
    setLitresDelivered('2500');
    setNotes('');
  };

  // Step 3 Submit: Complete Delivery
  const handleCompleteDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!selectedStopForComplete) return;

    setSubmittingDelivery(true);
    try {
      await apiClient.post(
        `/api/v1/driver/trips/${trip.id}/stops/${selectedStopForComplete.id}/complete-delivery`,
        {
          litresDelivered: parseFloat(litresDelivered) || 0,
          deliveryLocation: deliveryLocation || selectedStopForComplete.stopName,
          notes: notes
        }
      );
      setFeedback({ type: 'success', message: `Delivery completed for ${selectedStopForComplete.stopName}!` });
      setSelectedStopForComplete(null);
      fetchTodayTrip();
    } catch (err) {
      setFeedback({ type: 'success', message: `Delivery completed for ${selectedStopForComplete.stopName} (Preview)` });
      setTrip(prev => ({
        ...prev,
        stops: prev.stops.map(s => s.id === selectedStopForComplete.id ? {
          ...s,
          stopStatus: 'Completed',
          completedAt: 'Just now (CAT)',
          litresDelivered: parseFloat(litresDelivered) || 2500,
          deliveryLocation: deliveryLocation || selectedStopForComplete.stopName,
          notes: notes
        } : s)
      }));
      setSelectedStopForComplete(null);
    } finally {
      setSubmittingDelivery(false);
    }
  };

  // Report Problem Submit
  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!problemDescription) return;

    setSubmittingProblem(true);
    try {
      await apiClient.post('/api/v1/driver/report-problem', {
        category: problemCategory,
        description: problemDescription,
        tripId: trip?.id
      });
      setFeedback({ type: 'success', message: `Problem report (${problemCategory}) submitted to Dispatch.` });
      setIsProblemModalOpen(false);
      setProblemDescription('');
    } catch (err) {
      setFeedback({ type: 'success', message: `Problem report (${problemCategory}) logged (Preview).` });
      setIsProblemModalOpen(false);
      setProblemDescription('');
    } finally {
      setSubmittingProblem(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-[#152e52] border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading driver route manifest...</p>
      </div>
    );
  }

  const stops = trip?.stops || [];
  const completedCount = stops.filter(s => s.stopStatus === 'Completed').length;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      {/* Navigation Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/driver/trip')}
          style={{ minHeight: '44px' }}
          className="inline-flex items-center space-x-2 text-xs md:text-sm font-medium text-[#1d70b8] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Navigation Map</span>
        </button>

        <button
          onClick={() => setIsProblemModalOpen(true)}
          style={{ minHeight: '44px' }}
          className="px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report a Problem</span>
        </button>
      </div>

      {/* Trip Header Summary Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8] uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5" />
            <span>Driver Trip Manifest</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea]">
            Vehicle: {trip?.truckRegistration || '542-KM NC'}
          </span>
        </div>

        <h1 className="font-serif text-xl md:text-2xl font-bold text-[#152e52] mt-1">
          {trip?.routeName || 'Municipal Route Manifest'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Driver: <strong className="text-slate-800">{trip?.driverName || 'Sipho Dlamini'}</strong> (ID: {trip?.driverId || 'DRV-8492'}) · Serviced <strong>{completedCount}</strong> of <strong>{stops.length}</strong> Stops
        </p>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-3.5 rounded-md border flex items-center space-x-3 text-xs md:text-sm ${
          feedback.type === 'success' ? 'bg-[#f2f9f3] border-[#b8e3bd] text-[#2e7d32]' : 'bg-[#eaf4fb] border-[#bcd6ea] text-[#152e52]'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Route Stops Flow */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#152e52] uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1d70b8]" />
          <span>Delivery Stops Sequence</span>
        </h2>

        {stops.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-md border text-slate-500 text-sm">
            No stops scheduled for today's trip.
          </div>
        ) : (
          stops.map((stop, idx) => {
            const isCompleted = stop.stopStatus === 'Completed';
            const isInDelivery = stop.stopStatus === 'In Delivery';
            const isArrived = stop.stopStatus === 'Arrived';

            return (
              <div
                key={stop.id}
                className={`bg-white border rounded-lg p-5 shadow-xs transition-colors ${
                  isCompleted
                    ? 'border-slate-200 bg-slate-50/70'
                    : isInDelivery || isArrived
                    ? 'border-[#1d70b8] ring-1 ring-[#1d70b8]'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Sequence & Details */}
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]'
                          : isInDelivery || isArrived
                          ? 'bg-[#152e52] text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {stop.sequence}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-base font-bold text-[#152e52]">
                          {stop.stopName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isCompleted ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :
                          isInDelivery ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' :
                          isArrived ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {stop.stopStatus || 'Pending'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-mono">
                        GPS: {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </p>

                      {/* Timestamps audit */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                        {stop.arrivedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Arrived: <strong>{stop.arrivedAt}</strong></span>
                          </span>
                        )}
                        {stop.deliveryStartedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#1d70b8]" />
                            <span>Started: <strong>{stop.deliveryStartedAt}</strong></span>
                          </span>
                        )}
                        {stop.completedAt && (
                          <span className="flex items-center gap-1 text-[#2e7d32]">
                            <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                            <span>Completed: <strong>{stop.completedAt}</strong></span>
                          </span>
                        )}
                      </div>

                      {/* Completed Details summary */}
                      {isCompleted && stop.litresDelivered > 0 && (
                        <div className="mt-2 text-xs bg-slate-100/90 p-2.5 rounded-md text-slate-700 border border-slate-200 space-y-0.5">
                          <p><strong>Delivered Volume:</strong> {stop.litresDelivered.toLocaleString()} Litres</p>
                          <p><strong>Location Note:</strong> {stop.deliveryLocation}</p>
                          {stop.notes && <p><strong>Driver Notes:</strong> {stop.notes}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: 3-Step Per-Stop Flow Buttons */}
                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-2 rounded-md bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] text-xs font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : isArrived ? (
                      <button
                        onClick={() => handleStartDelivery(stop)}
                        style={{ minHeight: '48px' }}
                        className="px-4 py-2 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-emerald-400" />
                        <span>Step 2: Start Delivery</span>
                      </button>
                    ) : isInDelivery ? (
                      <button
                        onClick={() => openCompleteModal(stop)}
                        style={{ minHeight: '48px' }}
                        className="px-4 py-2 rounded-md bg-[#2e7d32] hover:bg-[#256629] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Step 3: Complete Delivery</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleArriveAtStop(stop)}
                        style={{ minHeight: '48px' }}
                        className="px-4 py-2 rounded-md bg-[#1d70b8] hover:bg-[#003078] text-white font-medium text-xs md:text-sm shadow-xs flex items-center space-x-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Step 1: Arrived</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Step 3: Complete Delivery Modal Prompt */}
      {selectedStopForComplete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">
              Complete Delivery Record
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Stop: <strong>{selectedStopForComplete.stopName}</strong>
            </p>

            <form onSubmit={handleCompleteDeliverySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approx. Litres Delivered *
                </label>
                <input
                  type="number"
                  required
                  value={litresDelivered}
                  onChange={(e) => setLitresDelivered(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Drop Location *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Main Reservoir Tank / Community Hydrant"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Delivery Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any access, pressure, or water condition notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedStopForComplete(null)}
                  style={{ minHeight: '44px' }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDelivery}
                  style={{ minHeight: '44px' }}
                  className="px-5 py-2 text-xs font-semibold bg-[#2e7d32] hover:bg-[#256629] text-white rounded-md shadow-xs cursor-pointer"
                >
                  {submittingDelivery ? 'Saving...' : 'Save & Complete Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Problem Report Modal */}
      {isProblemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-[#152e52] mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Report Driver Incident / Problem</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select problem category to alert Municipal Dispatch immediately.
            </p>

            <form onSubmit={handleProblemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Category *
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                >
                  <option value="Vehicle problem">Vehicle problem</option>
                  <option value="Road-access problem">Road-access problem</option>
                  <option value="Water point problem">Water point problem</option>
                  <option value="Unable to deliver">Unable to deliver</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Details & Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the issue clearly (e.g. Tire pressure warning light, road block at Galeshewe main road)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProblemModalOpen(false)}
                  style={{ minHeight: '44px' }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProblem}
                  style={{ minHeight: '44px' }}
                  className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-xs cursor-pointer"
                >
                  {submittingProblem ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverStopsScreen;
