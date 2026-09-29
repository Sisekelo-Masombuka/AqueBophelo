import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, AlertTriangle, Truck, MapPin, Calendar, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export function DriverActivityPage() {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'deliveries' | 'problems'
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    completedTrips: [
      {
        id: 101,
        routeName: 'Galeshewe Zone 3 Morning Route',
        truckRegistration: '542-KM NC',
        dateCompleted: '2026-09-28 14:30 CAT',
        totalStops: 3,
        totalLitres: 9500,
        status: 'Completed'
      },
      {
        id: 100,
        routeName: 'Roodepan Emergency Water Supply',
        truckRegistration: '542-KM NC',
        dateCompleted: '2026-09-27 16:15 CAT',
        totalStops: 4,
        totalLitres: 12000,
        status: 'Completed'
      }
    ],
    previousDeliveries: [
      {
        id: 501,
        locationName: 'Galeshewe Police Station Water Tank',
        litres: 3500,
        completedAt: '2026-09-28 08:45 CAT',
        notes: 'Full tank fill. Flow rate normal.'
      },
      {
        id: 502,
        locationName: 'Tshwarelela Primary Drop Point',
        litres: 3000,
        completedAt: '2026-09-28 10:20 CAT',
        notes: 'Delivered to school reservoir.'
      },
      {
        id: 503,
        locationName: 'Mayibuye Community Centre',
        litres: 3000,
        completedAt: '2026-09-28 14:10 CAT',
        notes: 'Community hydrants serviced.'
      }
    ],
    reportedProblems: [
      {
        id: 801,
        category: 'Road-access problem',
        description: 'Road construction block on Galeshewe main road detour required.',
        reportedAt: '2026-09-28 09:10 CAT',
        status: 'Acknowledged'
      },
      {
        id: 802,
        category: 'Vehicle problem',
        description: 'Low pressure tire warning light on front left tire.',
        reportedAt: '2026-09-25 07:45 CAT',
        status: 'Resolved'
      }
    ]
  });

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/driver/activity');
        if (res.data) {
          setActivityData(res.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial driver activity history', err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#152e52] flex items-center gap-2">
          <History className="w-6 h-6 text-[#1d70b8]" />
          <span>Driver Activity & Delivery Log</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Section 2.5 Historical Log of Completed Trips, Deliveries, and Reported Incidents
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('trips')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'trips'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Completed Trips ({activityData.completedTrips.length})
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'deliveries'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Previous Deliveries ({activityData.previousDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'problems'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Reported Problems ({activityData.reportedProblems.length})
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Loading driver activity logs...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tab 1: Completed Trips */}
          {activeTab === 'trips' && (
            <div className="space-y-3">
              {activityData.completedTrips.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No completed trips logged yet.
                </p>
              ) : (
                activityData.completedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-[#1d70b8]" />
                        <h3 className="font-serif text-base font-bold text-[#152e52]">{trip.routeName}</h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        Vehicle: <strong className="font-mono text-slate-800">{trip.truckRegistration}</strong> · {trip.totalStops} Stops Serviced
                      </p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{trip.dateCompleted}</span>
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-[#2e7d32]">
                          {trip.totalLitres.toLocaleString()} Litres Total
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd] shrink-0 self-start md:self-center flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Previous Deliveries */}
          {activeTab === 'deliveries' && (
            <div className="space-y-3">
              {activityData.previousDeliveries.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No delivery drop-offs recorded yet.
                </p>
              ) : (
                activityData.previousDeliveries.map((del) => (
                  <div key={del.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#2e7d32]" />
                        <h3 className="font-serif text-base font-bold text-[#152e52]">{del.locationName}</h3>
                      </div>
                      {del.notes && <p className="text-xs text-slate-600">Note: {del.notes}</p>}
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{del.completedAt}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea] block">
                        {del.litres.toLocaleString()} Litres
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Reported Problems */}
          {activeTab === 'problems' && (
            <div className="space-y-3">
              {activityData.reportedProblems.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No problems reported by driver.
                </p>
              ) : (
                activityData.reportedProblems.map((prob) => (
                  <div key={prob.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          {prob.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium pt-1">{prob.description}</p>
                      <p className="text-[11px] text-slate-500 pt-1">Reported: {prob.reportedAt}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 self-start md:self-center ${
                      prob.status === 'Resolved' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {prob.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DriverActivityPage;
