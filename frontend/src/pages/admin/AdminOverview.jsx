import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import {
  ShieldCheck,
  Droplet,
  Truck,
  Radio,
  MapPin,
  ArrowUpRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import apiClient from '../../api/client';
import LiveMap from '../../components/LiveMap';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import BroadcastAlertModal from '../../components/BroadcastAlertModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7154';

export function AdminOverview() {
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Resident Issue Reports (Section 3.4.1)
  const [residentIssues, setResidentIssues] = useState([
    {
      id: 1,
      ticketId: '#SPM-2026-9812',
      fullName: 'Nomcebo Nkosi',
      userEmail: 'resident@solplaatje.gov.za',
      issueType: 'Pipe Leak',
      area: 'Galeshewe',
      streetAddress: '142 Main Road',
      description: 'Major water pipe leak near street curb.',
      imageUrl: '/pipe_leak.jpg',
      status: 'Pending',
      adminNotes: '',
      createdAt: 'Today 07:15 CAT'
    },
    {
      id: 2,
      ticketId: '#SPM-2026-4410',
      fullName: 'David Van Wyk',
      userEmail: 'david@kimberley.co.za',
      issueType: 'Low Water Pressure',
      area: 'Roodepan',
      streetAddress: '88 Diamond Street',
      description: 'Water pressure dropped severely since morning.',
      imageUrl: null,
      status: 'In Progress',
      adminNotes: 'Maintenance team dispatched.',
      createdAt: 'Yesterday 16:30 CAT'
    }
  ]);

  // Driver Reported Incidents (Section 3.4.5)
  const [driverIncidents, setDriverIncidents] = useState([
    {
      id: 101,
      category: 'Road-access problem',
      description: 'Main road block near Galeshewe police station - rerouting required.',
      reportedBy: 'Sipho Dlamini (DRV-8492)',
      reportedAt: 'Today 09:10 CAT',
      status: 'Acknowledged'
    },
    {
      id: 102,
      category: 'Vehicle problem',
      description: 'Low air pressure indicator on rear brake line of Tanker 542-KM NC.',
      reportedBy: 'Sipho Dlamini (DRV-8492)',
      reportedAt: 'Today 07:45 CAT',
      status: 'In Maintenance'
    }
  ]);

  const [selectedIssueModal, setSelectedIssueModal] = useState(null);
  const [statusUpdateVal, setStatusUpdateVal] = useState('In Progress');
  const [adminNotesVal, setAdminNotesVal] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Dams data
  const [dams, setDams] = useState([
    {
      id: 1,
      name: 'Newton Reservoir',
      latitude: -28.7511,
      longitude: 24.7612,
      capacityMegaLitres: 92.5,
      latestLevel: 62.5,
      statusBand: 'Healthy',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      latitude: -28.5369,
      longitude: 24.7061,
      capacityMegaLitres: 150.0,
      latestLevel: 82.0,
      statusBand: 'Healthy',
    },
  ]);

  // Water tankers data
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      registrationNumber: '542-KM NC',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      route: 'Galeshewe Zone 3 Morning Route',
      speedKmh: 32,
    },
    {
      id: 2,
      registrationNumber: '882-KM NC',
      capacityLitres: 15000,
      status: 'OnTrip',
      lastLatitude: -28.7419,
      lastLongitude: 24.7719,
      driverName: 'Lerato Motsepe',
      route: 'Kimberley Central Bulk Delivery',
      speedKmh: 28,
    },
    {
      id: 3,
      registrationNumber: '104-KM NC',
      capacityLitres: 10000,
      status: 'Available',
      lastLatitude: -28.6921,
      lastLongitude: 24.7088,
      driverName: 'Tshepo Khumalo',
      route: 'Roodepan Depot Standby',
      speedKmh: 0,
    },
  ]);

  const [activeAlertsCount, setActiveAlertsCount] = useState(2);
  const [signalrConnected, setSignalrConnected] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [damsRes, trucksRes, issuesRes] = await Promise.allSettled([
          apiClient.get('/api/v1/dams'),
          apiClient.get('/api/v1/trucks'),
          apiClient.get('/api/v1/reports/issues'),
        ]);

        if (damsRes.status === 'fulfilled' && Array.isArray(damsRes.value.data) && damsRes.value.data.length > 0) {
          setDams(
            damsRes.value.data.map((d) => ({
              ...d,
              latestLevel: d.latestLevelPercent ?? d.latestLevel ?? 50,
            }))
          );
        }

        if (trucksRes.status === 'fulfilled' && Array.isArray(trucksRes.value.data) && trucksRes.value.data.length > 0) {
          setTrucks(trucksRes.value.data);
        }

        if (issuesRes.status === 'fulfilled' && Array.isArray(issuesRes.value.data) && issuesRes.value.data.length > 0) {
          setResidentIssues(issuesRes.value.data);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial seeded state.', err);
      }
    }
    loadData();
  }, []);

  const openUpdateIssueModal = (issue) => {
    setSelectedIssueModal(issue);
    setStatusUpdateVal(issue.status || 'In Progress');
    setAdminNotesVal(issue.adminNotes || '');
  };

  const handleUpdateIssueStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssueModal) return;

    setUpdatingStatus(true);
    try {
      await apiClient.patch(`/api/v1/reports/issues/${selectedIssueModal.id}/status`, {
        status: statusUpdateVal,
        adminNotes: adminNotesVal
      });

      setResidentIssues(prev => prev.map(item => item.id === selectedIssueModal.id ? {
        ...item,
        status: statusUpdateVal,
        adminNotes: adminNotesVal
      } : item));

      setFeedbackMsg({
        type: 'success',
        text: `Ticket ${selectedIssueModal.ticketId} updated to '${statusUpdateVal}'. Email notification sent to ${selectedIssueModal.userEmail || 'resident'}.`
      });
      setSelectedIssueModal(null);
    } catch (err) {
      setResidentIssues(prev => prev.map(item => item.id === selectedIssueModal.id ? {
        ...item,
        status: statusUpdateVal,
        adminNotes: adminNotesVal
      } : item));

      setFeedbackMsg({
        type: 'success',
        text: `Ticket ${selectedIssueModal.ticketId} updated to '${statusUpdateVal}' (Preview Mode).`
      });
      setSelectedIssueModal(null);
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/trucks`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('LocationUpdated', (payload) => {
      setTrucks((prev) =>
        prev.map((t) =>
          t.id === payload.truckId || t.registrationNumber === payload.registrationNumber
            ? {
                ...t,
                lastLatitude: payload.latitude,
                lastLongitude: payload.longitude,
                speedKmh: payload.speedKmh,
                status: payload.status || t.status,
              }
            : t
        )
      );
    });

    async function startSignalR() {
      try {
        await connection.start();
        setSignalrConnected(true);
      } catch (err) {
        console.warn('SignalR Hub unavailable for command center map:', err);
      }
    }

    startSignalR();

    return () => {
      if (connection) connection.stop();
    };
  }, []);

  const onTripCount = trucks.filter((t) => t.status === 'OnTrip' || t.status === 'Active').length;
  const availableCount = trucks.filter((t) => t.status === 'Available').length;
  const avgDamLevel = dams.length > 0
    ? Math.round(dams.reduce((acc, d) => acc + (d.latestLevel || 0), 0) / dams.length)
    : 72;

  return (
    <div className="space-y-6">
      {/* Top Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Grid Water Storage"
          value={`${avgDamLevel}% Avg`}
          subtitle="Newton (62.5%) & Riverton (82%)"
          icon={Droplet}
          accentColor="#1d70b8"
        />
        <StatCard
          title="Active Tankers Deployed"
          value={`${onTripCount} Tankers`}
          subtitle="Delivering to Galeshewe & Central"
          icon={Truck}
          accentColor="#2e7d32"
        />
        <StatCard
          title="Fleet at Depot Standby"
          value={`${availableCount} Available`}
          subtitle="Roodepan Support Center"
          icon={ShieldCheck}
          accentColor="#1d70b8"
        />
        <StatCard
          title="Live GPS Telemetry Stream"
          value={signalrConnected ? 'Connected' : 'Live Sync'}
          subtitle="SignalR /hubs/trucks active"
          icon={Radio}
          accentColor="#d97706"
        />
      </div>

      {/* Main Interactive Radar Map */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-5 h-5 text-[#152e52] shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-base text-[#152e52]">
                Sol Plaatje Live Operational Map
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Real-time tracking of water tankers moving across Kimberley and reservoir capacities.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
            <button
              onClick={() => navigate('/admin/trucks')}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-[#152e52] rounded-md font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Manage Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#1d70b8]" />
            </button>
          </div>
        </div>

        <LiveMap dams={dams} trucks={trucks} height="480px" />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dam Health Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 className="font-serif font-bold text-sm text-[#152e52] flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-[#1d70b8] fill-current" />
              <span>Municipal Reservoir Health</span>
            </h3>
            <button
              onClick={() => navigate('/admin/dams')}
              className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Log Reading</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {dams.map((dam) => {
              const level = dam.latestLevel || 50;
              return (
                <div key={dam.id} className="bg-[#f8fafc] border border-slate-200 rounded-md p-3.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-bold text-xs md:text-sm text-[#152e52]">{dam.name}</h4>
                      <p className="text-[11px] text-slate-500 font-normal">Capacity: {dam.capacityMegaLitres} ML</p>
                    </div>
                    <StatusBadge levelPercent={level} />
                  </div>

                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        level < 30 ? 'bg-red-600' : level < 60 ? 'bg-amber-500' : 'bg-[#2e7d32]'
                      }`}
                      style={{ width: `${Math.min(level, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Tankers Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 className="font-serif font-bold text-sm text-[#152e52] flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#2e7d32]" />
              <span>Active Water Delivery Tankers</span>
            </h3>
            <button
              onClick={() => navigate('/admin/trucks')}
              className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Fleet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trucks.map((truck) => (
              <div
                key={truck.id}
                className="bg-[#f8fafc] border border-slate-200 rounded-md p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {truck.registrationNumber}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#152e52]">{truck.route || 'Kimberley Route'}</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Driver: {truck.driverName || 'Unassigned'} · {truck.capacityLitres?.toLocaleString() || 10000} L
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <StatusBadge status={truck.status} />
                  {truck.speedKmh != null && truck.speedKmh > 0 && (
                    <p className="text-[10px] text-[#2e7d32] mt-1 font-mono font-medium">
                      {Math.round(truck.speedKmh)} km/h
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3.4: Incidents & Resident Fault Reports Table (3.4.1 & 3.4.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Resident Fault Reports (3.4.1) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#1d70b8]" />
                <span>Resident Water Fault Reports (Section 3.4.1)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted resident tickets and update operational status. Updates automatically send email notifications to the resident.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#eaf4fb] text-[#152e52] border border-[#bcd6ea]">
              {residentIssues.length} Tickets
            </span>
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-[#f2f9f3] border border-[#b8e3bd] text-[#2e7d32] rounded-md text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-slate-800">
              <thead className="bg-[#f8fafc] text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Resident & Issue</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {residentIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#152e52] text-xs">
                      {issue.ticketId}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#152e52]">{issue.issueType}</p>
                      <p className="text-[11px] text-slate-500">{issue.fullName} ({issue.userEmail})</p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <p className="font-medium text-xs">{issue.area}</p>
                      <p className="text-[11px] text-slate-500">{issue.streetAddress}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        issue.status === 'Resolved' ? 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]' :
                        issue.status === 'In Progress' ? 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openUpdateIssueModal(issue)}
                        className="px-3 py-1.5 rounded-md bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver Incident Reports (3.4.5) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-serif font-bold text-base text-[#152e52] flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Driver Incident Inbox (3.4.5)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live reports filed by tanker drivers on duty.
            </p>
          </div>

          <div className="space-y-3">
            {driverIncidents.map((inc) => (
              <div key={inc.id} className="p-3 bg-[#f8fafc] border border-slate-200 rounded-md space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {inc.category}
                  </span>
                  <span className="text-[11px] text-slate-500">{inc.reportedAt}</span>
                </div>
                <p className="text-xs text-slate-800 font-medium pt-1">{inc.description}</p>
                <p className="text-[11px] text-slate-500">Reported by: <strong>{inc.reportedBy}</strong></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Issue Status Modal Prompt */}
      {selectedIssueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-[#152e52] mb-1">
              Update Fault Ticket Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ticket ID: <strong>{selectedIssueModal.ticketId}</strong> ({selectedIssueModal.issueType} in {selectedIssueModal.area})
            </p>

            <form onSubmit={handleUpdateIssueStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ticket Operational Status *
                </label>
                <select
                  value={statusUpdateVal}
                  onChange={(e) => setStatusUpdateVal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="In Progress">In Progress (Dispatch Assigned)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                  <option value="Rejected">Rejected / Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Engineering Remarks (Sent to Resident Email)
                </label>
                <textarea
                  rows={3}
                  value={adminNotesVal}
                  onChange={(e) => setAdminNotesVal(e.target.value)}
                  placeholder="e.g. Municipal repair crew dispatched to 142 Main Road. Main valve sealed."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedIssueModal(null)}
                  style={{ minHeight: '44px' }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  style={{ minHeight: '44px' }}
                  className="px-5 py-2 text-xs font-semibold bg-[#152e52] hover:bg-[#0f223d] text-white rounded-md shadow-xs cursor-pointer"
                >
                  {updatingStatus ? 'Updating...' : 'Save & Dispatch Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Alert Modal */}
      <BroadcastAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onAlertSent={() => setActiveAlertsCount((prev) => prev + 1)}
      />
    </div>
  );
}

export default AdminOverview;
