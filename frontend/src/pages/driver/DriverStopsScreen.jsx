import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, ArrowLeft, Navigation, ShieldCheck } from 'lucide-react';
import apiClient from '../../api/client';

export function DriverStopsScreen() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState({
    id: 1,
    truckRegistration: 'NC-542-KM',
    routeName: 'Galeshewe Zone 3 Morning Route',
    stops: [
      {
        id: 101,
        sequence: 1,
        stopName: 'Galeshewe Police Station Water Point',
        latitude: -28.7183,
        longitude: 24.7319,
        completed: true,
        arrivedAtFormatted: '08:15 AM (CAT)',
      },
      {
        id: 102,
        sequence: 2,
        stopName: 'Tshwarelela Primary Drop Point',
        latitude: -28.7125,
        longitude: 24.7291,
        completed: false,
        arrivedAtFormatted: 'Pending Arrival',
      },
      {
        id: 103,
        sequence: 3,
        stopName: 'Mayibuye Community Centre',
        latitude: -28.7098,
        longitude: 24.7245,
        completed: false,
        arrivedAtFormatted: 'Pending Arrival',
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadTrip() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/trips/active');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setTrip(res.data[0]);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded stops.', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, []);

  const handleCompleteStop = async (stopId, stopName) => {
    try {
      await apiClient.post(`/api/v1/trips/${trip.id}/stops/${stopId}/complete`);
      setTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === stopId ? { ...s, completed: true, arrivedAtFormatted: 'Completed Just Now' } : s
        ),
      }));
      setFeedback({ type: 'success', message: `Stop "${stopName}" marked as completed!` });
    } catch (err) {
      console.warn('API error completing stop, updating locally:', err);
      setTrip((prev) => ({
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === stopId ? { ...s, completed: true, arrivedAtFormatted: 'Completed (Preview)' } : s
        ),
      }));
      setFeedback({ type: 'success', message: `Stop "${stopName}" marked complete (Preview Mode).` });
    }
  };

  const completedCount = trip.stops.filter((s) => s.completed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Back to Trip Screen Bar */}
      <button
        onClick={() => navigate('/driver/trip')}
        style={{ minHeight: '48px' }}
        className="inline-flex items-center space-x-2 text-xs md:text-sm font-semibold text-[#22D3EE] hover:text-[#22D3EE]/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Active Driver Navigation</span>
      </button>

      {/* Header Card */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>Trip Route Manifest</span>
        </div>
        <h2 className="text-xl font-bold text-[#E6EDF7]">{trip.routeName}</h2>
        <p className="text-xs text-[#8A9BB8] mt-1">
          Vehicle: <strong className="font-mono text-[#22D3EE]">{trip.truckRegistration}</strong> · {completedCount} of {trip.stops.length} Stops Serviced
        </p>
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
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Ordered Stops List with Oversized Action Buttons (>= 48px) */}
      <div className="space-y-3.5">
        {trip.stops.map((stop, idx) => (
          <div
            key={stop.id}
            className={`border rounded-2xl p-4 md:p-5 shadow-md transition-all ${
              stop.completed
                ? 'bg-[#111B2E]/60 border-[#1F2C45] opacity-80'
                : 'bg-[#111B2E] border-[#22D3EE]/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    stop.completed
                      ? 'bg-[#22C55E]/20 text-[#22C55E]'
                      : 'bg-[#22D3EE]/20 text-[#22D3EE]'
                  }`}
                >
                  {stop.sequence}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#E6EDF7]">{stop.stopName}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-[#8A9BB8]">
                    <span className="font-mono text-[11px]">{stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</span>
                    <span>·</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{stop.arrivedAtFormatted}</span>
                    </span>
                  </div>
                </div>
              </div>

              {stop.completed ? (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              ) : (
                <button
                  onClick={() => handleCompleteStop(stop.id, stop.stopName)}
                  style={{ minHeight: '48px', minWidth: '130px' }}
                  className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0B1220] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 shrink-0"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverStopsScreen;
