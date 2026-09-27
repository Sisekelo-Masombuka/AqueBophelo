import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LiveMap from '../components/LiveMap';
import ReportIssueModal from '../components/ReportIssueModal';
import {
  Droplet,
  Truck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  ExternalLink,
  Users,
  Layers,
  PhoneCall,
  Menu,
  X,
  AlertCircle,
  HelpCircle,
  Bell,
  Activity,
  ChevronDown,
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Mock live data matching backend DbSeeder for public landing view
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
      lastUpdated: 'Today at 10:42 (SAST)',
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
      lastUpdated: 'Today at 07:15 (SAST)',
    },
  ];

  const trucks = [
    {
      id: 1,
      registrationNumber: 'NC-542-KM',
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
      registrationNumber: 'NC-882-KM',
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
      registrationNumber: 'NC-104-KM',
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
    <div className="min-h-screen bg-[#0B1220] text-[#E6EDF7] font-sans antialiased selection:bg-[#0284C7] selection:text-white">
      {/* ==================== 1. TOP CIVIC EMERGENCY RIBBON ==================== */}
      <div className="bg-[#070D18] border-b border-[#1F2C45] text-xs text-[#8A9BB8] py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sky-400 tracking-wider uppercase text-[11px]">
              Sol Plaatje Municipality
            </span>
            <span className="hidden sm:inline text-[#1F2C45]">|</span>
            <span className="hidden sm:inline text-[11px] text-[#8A9BB8]">Kimberley, Northern Cape</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a href="tel:0800123456" className="flex items-center space-x-1 hover:text-rose-400 transition-colors">
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>Emergency: 0800 123 456</span>
            </a>
            <span className="text-[#1F2C45]">|</span>
            <a href="#about" className="hover:text-sky-400 transition-colors">
              Contact Municipal Water Desk
            </a>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN NAVIGATION NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur-md border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 p-1 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#E6EDF7] block leading-none">
                AquaBophelo
              </span>
              <span className="text-[10px] text-[#16A34A] font-semibold italic mt-1 block">
                Sol Plaatje Water Portal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#8A9BB8]">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#water-status" className="hover:text-white transition-colors">
              Water Status
            </a>
            <a href="#tankers" className="hover:text-white transition-colors">
              Tankers Map
            </a>
            <a href="#notices" className="hover:text-white transition-colors">
              Notices
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </nav>

          {/* Resident Portal CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handlePortalAction}
              className="min-h-[44px] px-6 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#0284C7]/20 flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <span>{user ? `Resident Portal (${user.role})` : 'Resident Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-[#8A9BB8] hover:text-white hover:bg-[#1F2C45] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111B2E] border-b border-[#1F2C45] px-4 py-4 space-y-3">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#8A9BB8] py-1">
              Home
            </a>
            <a href="#water-status" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#8A9BB8] py-1">
              Water Status
            </a>
            <a href="#tankers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#8A9BB8] py-1">
              Tankers Map
            </a>
            <a href="#notices" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#8A9BB8] py-1">
              Notices
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-[#8A9BB8] py-1">
              About
            </a>
            <button
              onClick={handlePortalAction}
              className="w-full text-center py-2.5 text-sm font-bold bg-[#0284C7] text-white rounded-xl mt-2"
            >
              Resident Portal
            </button>
          </div>
        )}
      </header>

      {/* ==================== 3. HERO SECTION ==================== */}
      <section id="hero" className="relative overflow-hidden py-16 md:py-24 border-b border-[#1F2C45]">
        {/* Large Decorative Water & Kimberley Blueprint Image Graphic Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl mx-auto">
          {/* Large Hero Graphic Frame / Image Banner */}
          <div className="w-full max-w-3xl mx-auto h-48 md:h-64 rounded-3xl bg-gradient-to-r from-[#0C4E8C] via-[#0284C7] to-[#16A34A] p-1 shadow-2xl mb-8 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0B1220]/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0284C7]/20 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
                <Droplet className="w-10 h-10 animate-bounce" />
              </div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-widest bg-sky-950/80 px-3 py-1 rounded-full border border-sky-400/30">
                Sol Plaatje Municipal Water System
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#E6EDF7] tracking-tight uppercase mb-4">
            Water Information For Kimberley
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg text-[#8A9BB8] leading-relaxed max-w-2xl mx-auto mb-8">
            Stay informed about water availability, service interruptions and municipal water services across Sol Plaatje.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#water-status"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#0284C7]/25 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>View Water Status</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#tankers"
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#111B2E] hover:bg-[#1F2C45] text-[#E6EDF7] font-bold text-sm border border-[#1F2C45] rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Track Water Tankers</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 4. WATER SERVICE ALERT BANNER ==================== */}
      <section id="notices" className="py-6 bg-rose-500/10 border-b border-rose-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-extrabold text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>🔴 WATER SERVICE ALERT</span>
            </span>
            <p className="text-sm font-semibold text-[#E6EDF7]">
              Planned interruption — <span className="text-rose-400 font-bold">Galeshewe Zone 3 &amp; Kimberley Central</span>
            </p>
          </div>

          <a
            href="#water-status"
            className="self-start sm:self-auto px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1"
          >
            <span>View Notice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ==================== 5. CURRENT WATER STATUS GRID ==================== */}
      <section id="water-status" className="py-16 border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#E6EDF7] tracking-tight uppercase">
              Current Water Status
            </h2>
            <p className="text-xs text-[#8A9BB8] mt-1">Live supply indicator across Kimberley zones</p>
          </div>

          {/* 4 Column Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* GALESHEWE */}
            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-sm hover:border-[#0284C7]/40 transition-colors">
              <p className="text-xs font-bold text-[#8A9BB8] uppercase tracking-wider mb-2">GALESHEWE</p>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-extrabold text-emerald-400">🟢 Normal</span>
              </div>
              <p className="text-[11px] text-[#8A9BB8] mt-2">Tanker NC-542-KM delivering in Zone 3</p>
            </div>

            {/* ROODEPAN */}
            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-sm hover:border-amber-500/40 transition-colors">
              <p className="text-xs font-bold text-[#8A9BB8] uppercase tracking-wider mb-2">ROODEPAN</p>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-lg font-extrabold text-amber-400">🟡 Tankers Active</span>
              </div>
              <p className="text-[11px] text-[#8A9BB8] mt-2">Standby vehicle at Roodepan Depot</p>
            </div>

            {/* KIMBERLEY CENTRAL */}
            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-sm hover:border-[#0284C7]/40 transition-colors">
              <p className="text-xs font-bold text-[#8A9BB8] uppercase tracking-wider mb-2">KIMBERLEY CENTRAL</p>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-extrabold text-emerald-400">🟢 Normal</span>
              </div>
              <p className="text-[11px] text-[#8A9BB8] mt-2">Bulk delivery active in commercial zone</p>
            </div>

            {/* NEWTON RESERVOIR */}
            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-sm hover:border-[#0284C7]/40 transition-colors">
              <p className="text-xs font-bold text-[#8A9BB8] uppercase tracking-wider mb-2">NEWTON RESERVOIR</p>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-extrabold text-[#0284C7]">🟢 62.5%</span>
              </div>
              <p className="text-[11px] text-[#8A9BB8] mt-2">57.8 ML stored of 92.5 ML capacity</p>
            </div>
          </div>

          <p className="text-center text-xs text-[#8A9BB8]">
            Last updated: <span className="font-bold text-[#E6EDF7]">10:42 SAST</span> (Verified by Sol Plaatje Telemetry)
          </p>
        </div>
      </section>

      {/* ==================== 6. WATER SERVICES DIRECTORY ==================== */}
      <section className="py-16 border-b border-[#1F2C45] bg-[#0B1220]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#E6EDF7] tracking-tight uppercase">
              Water Services
            </h2>
            <p className="text-xs text-[#8A9BB8] mt-1">Quick access to Sol Plaatje municipal tools</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="#water-status"
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-[#0284C7]/40 transition-all flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Water Availability</h3>
                <p className="text-xs text-[#8A9BB8]">Reservoir volume &amp; capacity</p>
              </div>
            </a>

            <a
              href="#tankers"
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-[#0284C7]/40 transition-all flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Water Tankers</h3>
                <p className="text-xs text-[#8A9BB8]">Live GPS vehicle radar</p>
              </div>
            </a>

            <a
              href="#notices"
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-[#0284C7]/40 transition-all flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Water Interruptions</h3>
                <p className="text-xs text-[#8A9BB8]">Planned &amp; emergency repairs</p>
              </div>
            </a>

            <a
              href="#tankers"
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-[#0284C7]/40 transition-all flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Water Points</h3>
                <p className="text-xs text-[#8A9BB8]">Community distribution stops</p>
              </div>
            </a>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-amber-500/40 transition-all flex items-center space-x-4 group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Report a Problem</h3>
                <p className="text-xs text-[#8A9BB8]">Log pipe bursts or leaks</p>
              </div>
            </button>

            <a
              href="#notices"
              className="p-5 bg-[#111B2E] border border-[#1F2C45] rounded-2xl hover:border-[#0284C7]/40 transition-all flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#E6EDF7]">Water Alerts</h3>
                <p className="text-xs text-[#8A9BB8]">SMS &amp; Email broadcasts</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 7. KNOW YOUR WATER SYSTEM (VERTICAL FLOW) ==================== */}
      <section className="py-16 border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#E6EDF7] tracking-tight uppercase mb-8">
            Know Your Water System
          </h2>

          {/* Vertical Visual Pipeline Diagram */}
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-8 shadow-xl space-y-4 max-w-lg mx-auto">
            <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl font-bold text-sm text-sky-400 flex items-center justify-center space-x-2">
              <Droplet className="w-4 h-4" />
              <span>Vaal River (Raw Water Source)</span>
            </div>
            <div className="text-sky-400 font-black text-xl">↓</div>

            <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl font-bold text-sm text-emerald-400 flex items-center justify-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Riverton Water Works (Purification Plant)</span>
            </div>
            <div className="text-sky-400 font-black text-xl">↓</div>

            <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl font-bold text-sm text-sky-400 flex items-center justify-center space-x-2">
              <Droplet className="w-4 h-4" />
              <span>Newton Reservoir (Bulk Storage)</span>
            </div>
            <div className="text-sky-400 font-black text-xl">↓</div>

            <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl font-bold text-sm text-[#E6EDF7] flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Municipal Network (Pipelines)</span>
            </div>
            <div className="text-sky-400 font-black text-xl">↓</div>

            <div className="p-3 bg-[#0B1220] border border-[#1F2C45] rounded-xl font-bold text-sm text-emerald-400 flex items-center justify-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Water Tankers (Mobile Telemetry Fleet)</span>
            </div>
            <div className="text-sky-400 font-black text-xl">↓</div>

            <div className="p-3 bg-[#0B1220] border border-[#16A34A]/40 rounded-xl font-extrabold text-sm text-[#16A34A] flex items-center justify-center space-x-2 shadow-inner">
              <Users className="w-4 h-4" />
              <span>Residents (Kimberley Community)</span>
            </div>
          </div>

          <p className="text-xs text-[#8A9BB8] mt-6 italic">
            Learn how Kimberley&apos;s water system works from river extraction to delivery.
          </p>
        </div>
      </section>

      {/* ==================== 8. LIVE TANKERS MAP SECTION ==================== */}
      <section id="tankers" className="py-16 border-b border-[#1F2C45] bg-[#0B1220]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider block mb-1">
                Sol Plaatje Live Fleet Radar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#E6EDF7] uppercase">
                Track Water Tankers
              </h2>
            </div>
            <p className="text-xs text-[#8A9BB8] max-w-md">
              Click vehicle markers to inspect active capacity, driver ratings, and route stops.
            </p>
          </div>

          <LiveMap dams={dams} trucks={trucks} height="500px" />
        </div>
      </section>

      {/* ==================== 9. ABOUT AQUABOPHELO SECTION ==================== */}
      <section id="about" className="py-20 border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center mx-auto mb-4 p-2 shadow-lg">
            <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-12 h-12 object-contain" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#E6EDF7] tracking-tight uppercase mb-4">
            About AquaBophelo
          </h2>

          <p className="text-sm sm:text-base text-[#8A9BB8] leading-relaxed mb-8">
            AquaBophelo provides residents with accessible information about municipal water supply, reservoir levels, tanker services and water availability across Sol Plaatje Municipality.
          </p>

          <button
            onClick={handlePortalAction}
            className="min-h-[48px] px-8 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#0284C7]/20 inline-flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <span>Learn More in Resident Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ==================== 10. FOOTER ==================== */}
      <footer className="py-12 bg-[#070D18] text-[#8A9BB8] text-xs border-t border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 p-1 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl flex items-center justify-center shrink-0">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#E6EDF7]">AquaBophelo</p>
              <p className="text-[11px] text-[#8A9BB8]">Sol Plaatje Municipality — Kimberley, Northern Cape</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-semibold text-[#8A9BB8]">
            <a href="#water-status" className="hover:text-white transition-colors">Water Services</a>
            <span>|</span>
            <a href="#tankers" className="hover:text-white transition-colors">Tankers</a>
            <span>|</span>
            <a href="#notices" className="hover:text-white transition-colors">Notices</a>
            <span>|</span>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="text-center md:text-right">
            <p className="italic font-bold text-[#16A34A] mb-1">
              &ldquo;Elke druppel tel • Metsi ke bophelo&rdquo;
            </p>
            <p className="text-[11px]">&copy; {new Date().getFullYear()} AquaBophelo. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
