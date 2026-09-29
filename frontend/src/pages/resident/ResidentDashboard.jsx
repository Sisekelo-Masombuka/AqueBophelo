import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import DamPanel from '../../components/DamPanel';
import LiveMap from '../../components/LiveMap';
import AlertSubscriptionsModal from '../../components/AlertSubscriptionsModal';
import ReportIssueModal from '../../components/ReportIssueModal';
import ScheduledOutagesComponent from '../../components/ScheduledOutagesComponent';
import { Droplet, Truck, AlertTriangle, Bell, Radio, ExternalLink, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export function ResidentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isReportIssueModalOpen, setIsReportIssueModalOpen] = useState(false);

  const [myIssues, setMyIssues] = useState([
    {
      id: 1,
      ticketId: '#SPM-2026-1042',
      issueType: 'Low Water Pressure',
      area: 'Galeshewe Zone 3',
      streetAddress: '145 Nobengula Avenue',
      description: 'Low water pressure since early morning.',
      status: 'In Progress',
      adminNotes: 'Municipal engineers dispatched to inspect pressure valve.',
      createdAt: 'Today, 08:30',
    },
  ]);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const response = await apiClient.get('/api/v1/reports/issues/my');
      if (Array.isArray(response.data) && response.data.length > 0) {
        setMyIssues(response.data);
      }
    } catch (err) {
      console.warn('API get my issues fallback:', err);
    }
  };

  const handleIssueReported = (newIssue) => {
    setMyIssues((prev) => [newIssue, ...prev]);
  };

  // Dams data matching backend DbSeeder
  const dams = [
    {
      id: 1,
      name: 'Newton Reservoir',
      areaName: 'Kimberley Central / Sol Plaatje',
      latitude: -28.7511,
      longitude: 24.7612,
      capacityMegaLitres: 92.5,
      volumeMegaLitres: 57.8,
      latestLevel: 62.5,
      lastUpdated: 'Today at 08:30 (CAT)',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      areaName: 'Vaal River Extraction Plant',
      latitude: -28.5369,
      longitude: 24.7061,
      capacityMegaLitres: 150.0,
      volumeMegaLitres: 123.0,
      latestLevel: 82.0,
      lastUpdated: 'Today at 07:15 (CAT)',
    },
  ];

  // Active water trucks matching backend seeded fleet
  const trucks = [
    {
      id: 1,
      registrationNumber: '542-KM NC',
      capacityLitres: 10000,
      status: 'OnTrip',
      lastLatitude: -28.7183,
      lastLongitude: 24.7319,
      driverName: 'Sipho Dlamini',
      route: 'Galeshewe Zone 3 Morning Route',
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
    },
  ];

  const alerts = [
    {
      id: 'alt-1',
      title: 'Water Tanker Dispatched to Galeshewe',
      message: 'Tanker 542-KM NC has departed for Galeshewe Zone 3. Scheduled stops: Community Hall and Kagisho Clinic.',
      severity: 'Healthy',
      area: 'Galeshewe',
      timestamp: 'Today, 09:15 CAT',
    },
    {
      id: 'alt-2',
      title: 'Newton Reservoir Scheduled Evening Pressure Management',
      message: 'Nightly pressure management between 21:00 and 04:00 to conserve Newton Reservoir reserves.',
      severity: 'Watch',
      area: 'Kimberley Central',
      timestamp: 'Today, 06:00 CAT',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Civic Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d70b8]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#2e7d32]" />
            <span>Sol Plaatje Water Portal · Kimberley</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
            Welcome back, {user?.fullName || 'Resident'}
          </h1>
          <div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2 mt-1">
            <span className="text-[#2e7d32] font-medium text-xs italic">
              {t('motto')}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal pt-1">
            Live storage metrics for Kimberley reservoirs and tanker delivery status for <strong className="text-slate-700 font-semibold">{user?.area || 'Galeshewe'}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsReportIssueModalOpen(true)}
            className="border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-medium text-xs px-3.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Report Leak / Issue</span>
          </button>

          <button
            onClick={() => setIsSubscribeModalOpen(true)}
            className="bg-[#152e52] hover:bg-[#0f223d] text-white font-medium text-xs px-3.5 py-2 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-white" />
            <span>Email Alerts</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Grid Storage Average</span>
          <p className="text-2xl font-serif font-bold text-[#152e52]">74.5%</p>
          <p className="text-xs text-slate-500">Newton (62.5%) &amp; Riverton (82.0%)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Active Tanker Fleet</span>
          <p className="text-2xl font-serif font-bold text-[#2e7d32]">2 En Route</p>
          <p className="text-xs text-slate-500">1 Standby in Roodepan Depot</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Municipal Grid Status</span>
          <p className="text-2xl font-serif font-bold text-amber-700">Watch State</p>
          <p className="text-xs text-slate-500">Night pressure limits 21:00-04:00</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Your Suburb Area</span>
          <p className="text-2xl font-serif font-bold text-[#152e52]">{user?.area || 'Galeshewe'}</p>
          <p className="text-xs text-slate-500">Tanker 542-KM NC active nearby</p>
        </div>
      </div>

      {/* ITEM 1.4: View Status of Submitted Issues Updated by Admin */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#152e52]" />
              <span>My Submitted Fault Reports &amp; Live Status</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Track real-time resolution updates from Sol Plaatje municipal engineering dispatch.
            </p>
          </div>
          <button
            onClick={() => setIsReportIssueModalOpen(true)}
            className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Log New Fault</span>
          </button>
        </div>

        {myIssues.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No fault reports logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {myIssues.map((issue) => (
              <div key={issue.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#152e52] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {issue.ticketId}
                    </span>
                    <span className="font-bold text-slate-800">{issue.issueType}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">{issue.area}</span>
                  </div>
                  <p className="text-slate-600">{issue.description}</p>
                  {issue.adminNotes && (
                    <p className="text-[11px] text-[#152e52] font-semibold bg-[#f4f8fb] px-2 py-1 rounded-md border border-[#bcd6ea]">
                      Admin Remarks: {issue.adminNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      issue.status === 'Resolved'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : issue.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservoir Capacity Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">
            <Droplet className="w-5 h-5 text-[#1d70b8] fill-current" />
            <span>Key Reservoir Levels</span>
          </h2>
          <Link
            to="/dams"
            className="text-xs font-medium text-[#1d70b8] hover:underline flex items-center gap-1"
          >
            <span>View 90-Day Trends</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dams.map((dam) => (
            <DamPanel key={dam.id} dam={dam} />
          ))}
        </div>
      </div>

      {/* Live Tanker & Reservoir Tracking Map */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#152e52] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#1d70b8]" />
              <span>Live Mobile Tanker Radar</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Centred on Sol Plaatje Municipality — Click pins for active status and estimated arrivals
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1d70b8]" />
              <span>Reservoirs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />
              <span>Active Tankers</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs overflow-hidden">
          <LiveMap dams={dams} trucks={trucks} height="440px" />
        </div>
      </div>

      {/* Scheduled Outages & Interruptions Calendar */}
      <ScheduledOutagesComponent userRole={user?.role || 'Resident'} />

      {/* Alert Preferences Modal */}
      <AlertSubscriptionsModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      {/* Report Water Issue Modal */}
      <ReportIssueModal
        isOpen={isReportIssueModalOpen}
        onClose={() => setIsReportIssueModalOpen(false)}
        userArea={user?.area}
        onIssueReported={handleIssueReported}
      />
    </div>
  );
}

export default ResidentDashboard;
