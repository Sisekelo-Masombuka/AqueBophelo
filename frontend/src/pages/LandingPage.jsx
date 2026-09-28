import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LiveMap from '../components/LiveMap';
import ReportIssueModal from '../components/ReportIssueModal';
import StatusBadge from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import {
  Droplet,
  Truck,
  AlertTriangle,
  MapPin,
  ArrowRight,
  PhoneCall,
  Menu,
  X,
  AlertCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-white text-brand-navy font-sans selection:bg-brand-accent selection:text-white">
      {/* ==================== 1. TOP CIVIC UTILITY BANNER ==================== */}
      <div className="bg-brand-navy-dark text-white text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-brand-accent uppercase tracking-[0.18em] text-[10px] flex items-center gap-1.5 whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5" />
              Sol Plaatje Municipality
            </span>
            <span className="hidden sm:inline text-white/35">|</span>
            <span className="hidden sm:inline text-slate-200 truncate">Kimberley Water Operations Desk</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="tel:0538306100"
              className="flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>Emergency Hotline: 053 830 6100</span>
            </a>
            <span className="text-white/35 hidden md:inline">|</span>
            <Link to="/contact" className="hidden md:inline hover:underline text-slate-200 font-medium">
              Submit Municipal Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN NAVIGATION NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-slate-200 shadow-[0_8px_24px_rgba(10,42,79,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/AquaBophelo_logo.svg"
              alt="AquaBophelo Logo"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <span className="font-extrabold text-[1.9rem] tracking-tight text-brand-navy block leading-none font-heading">
                AquaBophelo
              </span>
              <span className="text-[11px] text-brand-green font-semibold italic block mt-0.5">
                Sol Plaatje Water Portal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-navy">
            <Link to="/" className="text-brand-navy border-b-2 border-brand-blue pb-1.5 font-bold">
              Home
            </Link>
            <a href="#water-status" className="text-slate-700 hover:text-brand-blue transition-colors">
              Water Status
            </a>
            <a href="#tankers" className="text-slate-700 hover:text-brand-blue transition-colors">
              Live Map
            </a>
            <Link to="/about" className="text-slate-700 hover:text-brand-blue transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-brand-blue transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button onClick={handlePortalAction} variant="default" className="font-bold">
                <span>Go to Portal ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-brand-navy hover:underline">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button variant="default" className="font-bold">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-surface-blue transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-border px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-brand-navy py-1.5">
              Home
            </Link>
            <a href="#water-status" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-brand-navy py-1.5">
              Water Status
            </a>
            <a href="#tankers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-brand-navy py-1.5">
              Live Map
            </a>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-brand-navy py-1.5">
              About Us
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-brand-navy py-1.5">
              Contact Us
            </Link>
            <div className="pt-3 border-t border-border flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full font-bold">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full font-bold">Create Account</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ==================== 3. EDITORIAL ASYMMETRICAL HERO ==================== */}
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(41,145,200,0.12),_transparent_32%),linear-gradient(135deg,#f4f9fd_0%,#ffffff_55%,#edf7fb_100%)] py-14 md:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Headline & Action Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-heading shadow-sm">
                <Droplet className="w-3.5 h-3.5 fill-current text-emerald-600" />
                <span>&ldquo;Elke druppel tel • Metsi ke bophelo&rdquo;</span>
              </div>

              <h1 className="max-w-xl text-4xl md:text-5xl xl:text-[5rem] font-black text-brand-navy-dark tracking-[-0.06em] leading-[0.94] font-heading">
                Kimberley Water Supply &amp; Tanker Operations
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Check daily dam storage levels, view scheduled water service interruptions, and track mobile delivery tankers across Sol Plaatje Municipality in real time.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a href="#water-status">
                  <Button size="lg" variant="default" className="w-full sm:w-auto font-bold h-12 px-7 rounded-xl shadow-[0_14px_30px_rgba(14,76,140,0.18)]">
                    <span>Check Water Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>

                <a href="#tankers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold h-12 px-7 rounded-xl">
                    <Truck className="w-4 h-4 text-brand-navy" />
                    <span>Track Active Tankers</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Hero Visual Scene featuring real Kimberley photograph & telemetry overlay */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,39,63,0.12)] transition-transform duration-300 ease-out hover:-translate-y-1">
                <img
                  src="/images/kimberley_reservoir.jpg"
                  alt="Kimberley City and Water Landscape"
                  className="w-full h-[22rem] sm:h-[25rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy-dark/30 to-transparent p-5 flex flex-col justify-end text-white">
                  <div className="mb-4 flex items-center gap-3">
                    <img src="/truck_map_icon.svg" alt="Tanker Icon" className="w-9 h-9 object-contain" />
                    <div>
                      <h3 className="font-bold text-sm text-white font-heading leading-tight">
                        Sol Plaatje Water Telemetry
                      </h3>
                      <p className="text-[11px] text-blue-100">
                        Newton Reservoir: <strong className="text-brand-accent">62.5%</strong> · Riverton Works: <strong className="text-brand-green">82.0%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-white/20 flex items-center justify-between text-xs text-brand-navy shadow-md">
                    <div className="flex items-center gap-2 font-semibold">
                      <Truck className="w-4 h-4 text-brand-green" />
                      <span>3 Active Water Tankers En Route</span>
                    </div>
                    <span className="font-bold text-brand-blue font-mono">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. SERVICE INTERRUPTION BANNER ==================== */}
      <section id="notices" className="bg-amber-50 border-y border-amber-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center space-x-3">
            <span className="shrink-0 p-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div className="text-amber-900 font-medium text-xs sm:text-sm">
              <span className="font-bold">Scheduled Maintenance Notice:</span> Pipe repairs ongoing in Galeshewe Zone 3. Mobile water tankers are actively delivering backup supply.
            </div>
          </div>

          <Link to="/contact" className="shrink-0 text-xs font-bold text-amber-800 underline hover:text-amber-950">
            Read Notice Details
          </Link>
        </div>
      </section>

      {/* ==================== 5. MUNICIPAL WATER DISTRIBUTION EXPLANATION (OPEN LAYOUT) ==================== */}
      <section className="py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
              How Kimberley Water Reaches Your Home
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy-dark font-heading">
              The Journey from Vaal River to Your Tap
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Sol Plaatje Municipality manages an interconnected purification and distribution network to serve Kimberley residents.
            </p>
          </div>

          {/* Horizontal Step-by-Step Flow (Open Section, No Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-border">
            <div className="space-y-2">
              <span className="text-2xl font-black text-brand-blue font-heading block">01</span>
              <h3 className="font-bold text-base text-brand-navy font-heading">Vaal River Extraction</h3>
              <p className="text-xs text-muted leading-relaxed">
                Raw water is drawn from the Vaal River at the Riverton Extraction Station north of Kimberley.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-brand-blue font-heading block">02</span>
              <h3 className="font-bold text-base text-brand-navy font-heading">Riverton Water Works</h3>
              <p className="text-xs text-muted leading-relaxed">
                Purification, filtration, and quality testing treat water to South African SANS 241 drinking standards.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-brand-blue font-heading block">03</span>
              <h3 className="font-bold text-base text-brand-navy font-heading">Newton Reservoir</h3>
              <p className="text-xs text-muted leading-relaxed">
                Bulk storage tanks hold up to 92.5 MegaLitres to pressurize supply pipelines across Kimberley.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-2xl font-black text-brand-green font-heading block">04</span>
              <h3 className="font-bold text-base text-brand-navy font-heading">Mobile Tankers</h3>
              <p className="text-xs text-muted leading-relaxed">
                During scheduled maintenance or pipe repairs, GPS-tracked tankers deliver clean water directly to suburb distribution stops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. WATER STATUS SECTION (OPEN ROW LAYOUT) ==================== */}
      <section id="water-status" className="py-16 bg-surface-blue/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                Live Zone Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark font-heading">
                Kimberley Water Status by Area
              </h2>
            </div>
            <p className="text-xs text-muted max-w-md">
              Current operational status verified by Sol Plaatje Municipal Control Center.
            </p>
          </div>

          {/* Clean Open Data Rows */}
          <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider block">Galeshewe Suburb</span>
                <h3 className="font-bold text-base text-brand-navy font-heading">Galeshewe Zone 3</h3>
                <p className="text-xs text-muted mt-0.5">Tap water operating normally. Tanker NC-542-KM delivering backup supply.</p>
              </div>
              <StatusBadge status="Healthy" />
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider block">Roodepan Suburb</span>
                <h3 className="font-bold text-base text-brand-navy font-heading">Roodepan Depot Area</h3>
                <p className="text-xs text-muted mt-0.5">Low pressure reported. Standby tanker on standby at Roodepan Depot.</p>
              </div>
              <StatusBadge status="Watch" />
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider block">Commercial Zone</span>
                <h3 className="font-bold text-base text-brand-navy font-heading">Kimberley CBD</h3>
                <p className="text-xs text-muted mt-0.5">Normal municipal water pressure across commercial district.</p>
              </div>
              <StatusBadge status="Healthy" />
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider block">Bulk Storage</span>
                <h3 className="font-bold text-base text-brand-navy font-heading">Newton Reservoir Facility</h3>
                <p className="text-xs text-muted mt-0.5">57.8 MegaLitres stored of 92.5 ML capacity.</p>
              </div>
              <StatusBadge levelPercent={62.5} />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. LIVE MAP OPERATIONAL RADAR ==================== */}
      <section id="tankers" className="py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                Real-Time GPS Tracking
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark font-heading">
                Live Mobile Tanker Radar
              </h2>
            </div>
            <p className="text-xs text-muted max-w-md">
              Click vehicle pins on the map below to inspect driver ratings, active routes, and estimated arrival times.
            </p>
          </div>

          <LiveMap dams={dams} trucks={trucks} height="520px" />
        </div>
      </section>

      {/* ==================== 8. REPORT LEAK / CONTACT CTA SECTION ==================== */}
      <section className="py-16 bg-surface-blue border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-navy-dark font-heading">
            Notice a Pipe Burst or Leaking Main?
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Report infrastructure damage directly to Sol Plaatje municipal engineers to prevent water loss and speed up repairs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              variant="default"
              size="lg"
              className="w-full sm:w-auto font-bold h-12 px-6"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Water Issue</span>
            </Button>

            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold h-12 px-6">
                <span>Contact Municipal Desk</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 9. CIVIC FOOTER WITH REAL BRAND LOGO ==================== */}
      <footer className="bg-brand-navy-dark text-white py-12 border-t border-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center space-x-3.5">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="h-10 w-auto object-contain" />
              <div>
                <h3 className="font-bold text-lg text-white font-heading">AquaBophelo</h3>
                <p className="text-xs text-blue-200">Sol Plaatje Municipality — Kimberley, Northern Cape</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-blue-100 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <a href="#water-status" className="hover:text-white transition-colors">Water Status</a>
              <a href="#tankers" className="hover:text-white transition-colors">Live Map</a>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-200">
            <p>&copy; {new Date().getFullYear()} AquaBophelo. Sol Plaatje Municipality Water Services.</p>
            <p className="font-bold text-brand-green italic font-heading">
              &ldquo;Elke druppel tel • Metsi ke bophelo&rdquo;
            </p>
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
