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
import StatusBadge from '../../components/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

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

  const currentPendingStop = activeTrip?.stops?.find((s) => !s.completed);
  const completedStopsCount = activeTrip?.stops?.filter((s) => s.completed).length || 0;
  const totalStopsCount = activeTrip?.stops?.length || 0;
  const progressPercent = totalStopsCount > 0 ? (completedStopsCount / totalStopsCount) * 100 : 0;

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
      {/* Driver Status Card */}
      <Card className="p-5 border-brand-accent/30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-surface-green border border-brand-green/30 rounded-xl text-brand-green-dark">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-brand-blue bg-surface-blue px-2 py-0.5 rounded border border-brand-accent/30">
                  {activeTrip?.truckRegistration || 'NC-542-KM'}
                </span>
                <span className="text-xs text-muted font-medium">10,000 Litres</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-brand-navy mt-0.5">
                {activeTrip?.routeName || 'Kimberley Bulk Route'}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <StatusBadge status={connectionStatus || 'Online'} />
            <span className="text-[11px] text-muted mt-1 font-mono font-medium">
              GPS: {currentLocation.lastBroadcastTime || 'Active'}
            </span>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
            <span className="text-muted">Delivery Progress</span>
            <span className="text-brand-blue font-bold">
              {completedStopsCount} of {totalStopsCount} Stops Completed ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-surface-blue rounded-full overflow-hidden border border-brand-accent/20">
            <div
              className="h-full bg-brand-green transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Live Telemetry Display */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3.5 text-center">
          <div className="flex items-center justify-center text-brand-blue mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Speed</p>
          <p className="text-lg font-black text-brand-navy font-mono mt-0.5">
            {Math.round(currentLocation.speedKmh)} <span className="text-xs font-normal text-muted">km/h</span>
          </p>
        </Card>

        <Card className="p-3.5 text-center">
          <div className="flex items-center justify-center text-brand-green-dark mb-1">
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-wider">Heading</p>
          <p className="text-lg font-black text-brand-navy font-mono mt-0.5">
            {Math.round(currentLocation.heading)}°
          </p>
        </Card>

        <Card className="p-3.5 text-center">
          <div className="flex items-center justify-center text-amber-700 mb-1">
            <Radio className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-muted uppercase font-bold tracking-wider">GPS Beacon</p>
          <p className="text-xs font-bold text-brand-navy mt-1">
            {isBroadcasting ? 'Broadcasting' : 'Standby'}
          </p>
        </Card>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs md:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-surface-green border-brand-green/30 text-brand-green-dark'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Target Next Stop Card */}
      {activeTrip?.status === 'Active' && currentPendingStop ? (
        <Card className="border-2 border-brand-blue/50 p-6 bg-gradient-to-br from-surface-blue/60 to-white shadow-md">
          <div className="flex items-center justify-between text-xs text-brand-blue font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5">
              <Navigation className="w-4 h-4" />
              <span>Next Scheduled Destination</span>
            </span>
            <span className="bg-brand-blue text-white px-2 py-0.5 rounded text-[11px]">
              Stop #{currentPendingStop.sequence}
            </span>
          </div>

          <h3 className="text-xl font-black text-brand-navy">
            {currentPendingStop.stopName}
          </h3>
          <p className="text-xs text-muted mt-1">
            Community bulk water drop-off point. Tap below once filling is complete.
          </p>

          <div className="mt-5">
            <Button
              onClick={handleMarkStopComplete}
              variant="success"
              className="w-full h-14 text-base font-black shadow-md tracking-wide"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span>MARK STOP COMPLETED</span>
            </Button>
          </div>
        </Card>
      ) : activeTrip?.status === 'Active' ? (
        <Card className="p-6 text-center border-brand-green/40 bg-surface-green/40">
          <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-2" />
          <h3 className="text-lg font-bold text-brand-navy">All Scheduled Stops Completed!</h3>
          <p className="text-xs text-muted mt-1">
            You have serviced all delivery points on this route. Return vehicle to depot.
          </p>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <Truck className="w-12 h-12 text-muted mx-auto mb-2" />
          <h3 className="text-lg font-bold text-brand-navy">Vehicle Currently at Depot</h3>
          <p className="text-xs text-muted mt-1">
            No delivery trip in progress. Tap below to begin shift.
          </p>
          <div className="mt-4">
            <Button
              onClick={handleStartTrip}
              variant="success"
              className="w-full h-14 text-base font-black"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START DELIVERY TRIP</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Trip Actions */}
      {activeTrip?.status === 'Active' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => navigate('/driver/stops')}
            variant="outline"
            className="h-12 font-bold text-brand-blue"
          >
            <ListOrdered className="w-4 h-4" />
            <span>View Route Stops ({totalStopsCount})</span>
          </Button>

          <Button
            onClick={() => setIsEndTripModalOpen(true)}
            variant="danger"
            className="h-12 font-bold"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>End Trip &amp; Return to Depot</span>
          </Button>
        </div>
      )}

      {/* Demo Simulation Link */}
      <div className="pt-2 text-center">
        <button
          onClick={toggleSimulation}
          className="text-xs text-muted hover:text-brand-blue font-semibold underline cursor-pointer"
        >
          {isSimulating ? '🚗 Simulated Kimberley Driving Active (Click to Stop)' : '🧪 Click to Simulate Live Driving for Demo'}
        </button>
      </div>

      {/* End Trip Modal */}
      {isEndTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
          <Card className="w-full max-w-sm p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">End Delivery Trip?</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Ending this trip will stop GPS telemetry broadcasting and mark the tanker as Available at the municipal depot.
            </p>

            <div className="flex flex-col space-y-2 pt-2">
              <Button onClick={handleConfirmEndTrip} variant="danger" className="h-12 font-bold">
                Yes, End Trip
              </Button>
              <Button onClick={() => setIsEndTripModalOpen(false)} variant="outline" className="h-12 font-semibold">
                Cancel &amp; Continue
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DriverTripScreen;
