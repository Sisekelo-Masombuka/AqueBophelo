import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, AlertTriangle, Truck, MapPin, Calendar, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export function DriverActivityPage() {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'deliveries' | 'problems'
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    completedTrips: [],
    previousDeliveries: [],
    reportedProblems: []
  });

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/v1/driver/activity');
        if (res.data) {
          setActivityData({
            completedTrips: res.data.completedTrips || [],
            previousDeliveries: res.data.previousDeliveries || [],
            reportedProblems: res.data.reportedProblems || [],
          });
        }
      } catch (err) {
        console.info('No driver activity logs found or backend offline:', err?.response?.status || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  const completedTrips = activityData?.completedTrips || [];
  const previousDeliveries = activityData?.previousDeliveries || [];
  const reportedProblems = activityData?.reportedProblems || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#152e52] flex items-center gap-2">
          <History className="w-6 h-6 text-[#1d70b8]" />
          <span>Driver Activity &amp; Delivery Log</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical Log of Completed Trips, Deliveries, and Reported Incidents
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
          Completed Trips ({completedTrips.length})
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'deliveries'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Previous Deliveries ({previousDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`pb-3 px-4 text-xs md:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'problems'
              ? 'border-[#152e52] text-[#152e52]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Reported Problems ({reportedProblems.length})
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
              {completedTrips.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No completed trips logged yet.
                </p>
              ) : (
                completedTrips.map((trip) => (
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
                          {(trip.totalLitres || 0).toLocaleString()} Litres Total
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
              {previousDeliveries.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No delivery drop-offs recorded yet.
                </p>
              ) : (
                previousDeliveries.map((del) => (
                  <div key={del.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
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
                      {del.proofPhotoUrl && (
                        <div className="pt-2 flex items-center gap-2">
                          <img
                            src={del.proofPhotoUrl}
                            alt="Proof of Delivery"
                            className="w-16 h-16 object-cover rounded-md border border-slate-200 shadow-2xs"
                          />
                          <span className="text-[11px] font-semibold text-[#2e7d32] bg-[#f2f9f3] px-2 py-0.5 rounded border border-[#b8e3bd]">
                            Proof Photo Verified
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea] block">
                        {(del.litres || 0).toLocaleString()} Litres
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
              {reportedProblems.length === 0 ? (
                <p className="text-sm text-slate-500 bg-white p-6 rounded-md border text-center">
                  No problems reported by driver.
                </p>
              ) : (
                reportedProblems.map((prob) => (
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
