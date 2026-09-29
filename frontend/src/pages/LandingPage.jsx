import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LiveMap from '../components/LiveMap';
import ReportIssueModal from '../components/ReportIssueModal';
import StatusBadge from '../components/StatusBadge';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import ScheduledOutagesComponent from '../components/ScheduledOutagesComponent';
import { Button } from '../components/ui/Button';
import {
  Droplet,
  Truck,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  Menu,
  X,
  AlertCircle,
  Building2,
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  /* Operational telemetry data for Sol Plaatje Municipality dams & tankers */
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
      lastUpdated: 'Today at 10:42 (CAT)',
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
      estimatedArrival: '12 mins',
      speedKmh: 36,
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
      estimatedArrival: '8 mins',
      speedKmh: 42,
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
      estimatedArrival: 'Standby',
      speedKmh: 0,
    },
  ];

  const handlePortalAction = () => {
    if (user) {
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Driver') navigate('/driver/trip');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#1d70b8] selection:text-white flex flex-col justify-between">
      <div>
        {/* ==================== 1. TOP CIVIC UTILITY BANNER ==================== */}
        <div className="bg-[#152e52] text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5 whitespace-nowrap">
                <Building2 className="w-3.5 h-3.5" />
                {t('solPlaatjeMun')}
              </span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span className="hidden sm:inline text-slate-200 truncate font-normal">{t('kimberleyOperations')}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <a
                href="tel:0538306100"
                className="flex items-center gap-1.5 font-medium text-amber-300 hover:text-amber-200 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-amber-300" />
                <span>{t('emergencyLine')}</span>
              </a>
              <span className="text-white/40 hidden md:inline">|</span>
              <Link to="/contact" className="hidden md:inline hover:underline text-slate-200 font-normal">
                {t('submitInquiry')}
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== MAIN NAVIGATION NAVBAR ==================== */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Real Logo Component */}
            <Link to="/" className="flex items-center">
              <BrandLogo variant="full" size="md" />
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
              <Link to="/" className="text-[#152e52] font-semibold">
                {t('home')}
              </Link>
              <a href="#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">
                {t('waterStatus')}
              </a>
              <a href="#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">
                {t('liveMap')}
              </a>
              <Link to="/about" className="text-slate-600 hover:text-[#152e52] transition-colors">
                {t('aboutUs')}
              </Link>
              <Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">
                {t('contactUs')}
              </Link>
            </nav>

            {/* Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              {user ? (
                <button
                  onClick={handlePortalAction}
                  className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t('goToPortal')} ({user.role})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">
                    {t('signIn')}
                  </Link>
                  <Link to="/register">
                    <button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">
                      {t('createAccount')}
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#152e52]">
                {t('home')}
              </Link>
              <a href="#water-status" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700">
                {t('waterStatus')}
              </a>
              <a href="#tankers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700">
                {t('liveMap')}
              </a>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700">
                {t('aboutUs')}
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700">
                {t('contactUs')}
              </Link>
              <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full border border-slate-300 text-slate-700 py-2 rounded-md font-medium text-sm">{t('signIn')}</button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-[#152e52] text-white py-2 rounded-md font-medium text-sm">{t('createAccount')}</button>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ==================== HERO SECTION ==================== */}
        <section className="bg-white py-12 md:py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Headline & Action Column */}
              <div className="lg:col-span-6 space-y-5 text-left">
                {/* Green motto line */}
                <div className="flex items-center gap-2 border-l-2 border-[#2e7d32] pl-2.5">
                  <span className="text-[#2e7d32] font-medium text-sm italic">
                    {t('motto')}
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold text-[#152e52] tracking-tight leading-[1.1]">
                  {t('heroTitle')}
                </h1>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
                  {t('heroDesc')}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a href="#water-status">
                    <button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors shadow-xs cursor-pointer">
                      {t('checkWaterStatus')}
                    </button>
                  </a>

                  <a href="#tankers">
                    <button className="border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 px-5 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer">
                      <Truck className="w-4 h-4 text-[#152e52]" />
                      <span>{t('trackActiveTankers')}</span>
                    </button>
                  </a>
                </div>
              </div>

              {/* Right Hero Image Card with Fill Level Bars */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                  <img
                    src="/images/kimberley_reservoir.jpg"
                    alt="Kimberley Water Landscape"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  
                  {/* Dam fill bars */}
                  <div className="p-5 space-y-4 bg-white border-t border-slate-200">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-slate-700 font-medium">
                        <span>Newton reservoir</span>
                        <span className="font-bold text-[#152e52]">62.5%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#1d70b8] h-full rounded-full" style={{ width: '62.5%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-slate-700 font-medium">
                        <span>Riverton works</span>
                        <span className="font-bold text-[#152e52]">82.0%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#1d70b8] h-full rounded-full" style={{ width: '82.0%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom status bar */}
                  <div className="bg-[#f8fafc] px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-[#152e52]" />
                      <span>3 {t('activeTankersEnRoute')}</span>
                    </div>
                    <span className="flex items-center gap-1.5 font-medium text-[#2e7d32]">
                      <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
                      <span>{t('live')}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. SERVICE INTERRUPTION BANNER (Solid Municipal Bar) ==================== */}
        <section id="notices" className="bg-[#152e52] text-white py-3.5 px-4 sm:px-8 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="text-slate-100 font-normal">
                {t('noticeBanner')}
              </div>
            </div>

            <Link to="/contact" className="shrink-0 font-medium text-amber-300 hover:text-white hover:underline text-xs">
              {t('readNoticeDetails')} &rarr;
            </Link>
          </div>
        </section>

        {/* ==================== 5. MUNICIPAL WATER DISTRIBUTION EXPLANATION ==================== */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block">
                {t('aalRiverJourney')}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#152e52]">
                {t('journeySubtitle')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {t('journeyDesc')}
              </p>
            </div>

            {/* Horizontal Step-by-Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <span className="font-serif text-3xl font-bold text-[#152e52] block">01</span>
                <h3 className="font-serif font-bold text-base text-[#152e52]">{t('step1Title')}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('step1Desc')}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif text-3xl font-bold text-[#152e52] block">02</span>
                <h3 className="font-serif font-bold text-base text-[#152e52]">{t('step2Title')}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('step2Desc')}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif text-3xl font-bold text-[#152e52] block">03</span>
                <h3 className="font-serif font-bold text-base text-[#152e52]">{t('step3Title')}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('step3Desc')}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif text-3xl font-bold text-[#2e7d32] block">04</span>
                <h3 className="font-serif font-bold text-base text-[#152e52]">{t('step4Title')}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('step4Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 6. WATER STATUS SECTION ==================== */}
        <section id="water-status" className="py-16 bg-[#f8fafc] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block mb-1">
                  {t('liveZoneTelemetry')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">
                  {t('waterStatusByArea')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-md font-normal">
                {t('statusVerifiedDesc')}
              </p>
            </div>

            {/* Clean Open Data Rows */}
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Galeshewe Suburb</span>
                  <h3 className="font-serif font-bold text-base text-[#152e52]">Galeshewe Zone 3</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">Tap water operating normally. Tanker 542-KM NC delivering backup supply.</p>
                </div>
                <StatusBadge status="Healthy" />
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Roodepan Suburb</span>
                  <h3 className="font-serif font-bold text-base text-[#152e52]">Roodepan Depot Area</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">Low pressure reported. Standby tanker on standby at Roodepan Depot.</p>
                </div>
                <StatusBadge status="Watch" />
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Commercial Zone</span>
                  <h3 className="font-serif font-bold text-base text-[#152e52]">Kimberley CBD</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">Normal municipal water pressure across commercial district.</p>
                </div>
                <StatusBadge status="Healthy" />
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Bulk Storage</span>
                  <h3 className="font-serif font-bold text-base text-[#152e52]">Newton Reservoir Facility</h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">57.8 MegaLitres stored of 92.5 ML capacity.</p>
                </div>
                <StatusBadge levelPercent={62.5} />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 7. LIVE MAP OPERATIONAL RADAR ==================== */}
        <section id="tankers" className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1d70b8] uppercase tracking-wider block mb-1">
                  {t('realtimeGpsTracking')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">
                  {t('liveTankerRadar')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-md font-normal">
                {t('radarDesc')}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xs">
              <LiveMap dams={dams} trucks={trucks} height="520px" />
            </div>
          </div>
        </section>

        {/* ==================== 8. SCHEDULED WATER OUTAGES CALENDAR ==================== */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScheduledOutagesComponent isAdmin={false} />
          </div>
        </section>

        {/* ==================== 9. REPORT LEAK / INFRASTRUCTURE MAINTENANCE WITH PIPE LEAK IMAGE ==================== */}
        <section className="py-16 bg-[#f8fafc] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 p-6 sm:p-10 space-y-5 text-left">
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider block">
                  {t('infrastructureEmergency')}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#152e52]">
                  {t('noticeBurstTitle')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {t('noticeBurstDesc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full sm:w-auto bg-[#152e52] hover:bg-[#0f223d] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-white" />
                    <span>{t('reportWaterIssueNow')}</span>
                  </button>

                  <Link to="/contact" className="w-full sm:w-auto">
                    <button className="w-full border border-slate-300 bg-white text-[#152e52] hover:bg-slate-50 px-6 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer">
                      {t('contactMunicipalDesk')}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 h-64 sm:h-96">
                <img
                  src="/pipe_leak.jpg"
                  alt="Sol Plaatje Municipal Pipe Leak Repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Unified Municipal Footer */}
      <Footer />

      {/* Report Water Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userArea="Galeshewe"
      />
    </div>
  );
}

export default LandingPage;
