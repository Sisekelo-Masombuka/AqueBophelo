import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LiveMap from '../components/LiveMap';
import ReportIssueModal from '../components/ReportIssueModal';
import StatusBadge from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import {
  Droplet,
  Truck,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Menu,
  X,
  AlertCircle,
  Bell,
  ChevronRight,
  Building2,
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  /* PLACEHOLDER: Operational telemetry data for Sol Plaatje Municipality dams & tankers */
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
    <div className="min-h-screen bg-white text-brand-navy font-sans antialiased selection:bg-brand-accent selection:text-white">
      {/* 1. Civic Top Header Ribbon */}
      <div className="bg-brand-navy-dark text-white text-xs py-2 px-4 sm:px-8 border-b border-brand-navy/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-brand-accent uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Sol Plaatje Municipality
            </span>
            <span className="hidden sm:inline text-brand-accent/50">|</span>
            <span className="hidden sm:inline text-blue-100">Kimberley Water Operations</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            {/* PLACEHOLDER: Verify official municipal emergency hotline with Sol Plaatje team */}
            <a
              href="tel:0538306100"
              className="flex items-center space-x-1 font-semibold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>Emergency: 053 830 6100</span>
            </a>
            <span className="text-brand-accent/50 hidden md:inline">|</span>
            <Link to="/contact" className="hidden md:inline hover:underline text-blue-100">
              Contact Desk
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Readable Brand Logo */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Real Logo Asset displayed at readable size */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-brand-navy block leading-tight font-heading">
                AquaBophelo
              </span>
              <span className="text-[11px] text-brand-green font-semibold italic block">
                Sol Plaatje Water Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-brand-navy">
            <Link to="/" className="text-brand-navy border-b-2 border-brand-navy pb-0.5 font-bold">
              Home
            </Link>
            <a href="#water-status" className="hover:text-brand-navy transition-colors">
              Water Status
            </a>
            <a href="#tankers" className="hover:text-brand-navy transition-colors">
              Live Map
            </a>
            <Link to="/about" className="hover:text-brand-navy transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-brand-navy transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Single Primary CTA (Filled Navy) + Secondary Link */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-surface-blue transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
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

      {/* 3. HERO SECTION with Tagline & Artwork Visual Scene */}
      <section className="bg-gradient-to-b from-surface-blue/70 via-white to-white py-12 md:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Clear Resident Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Featured Tagline */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-green border border-brand-green/30 text-brand-green-dark text-xs font-bold font-heading">
                <Droplet className="w-3.5 h-3.5 fill-current text-brand-green" />
                <span>&ldquo;Elke druppel tel • Metsi ke bophelo&rdquo;</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-brand-navy-dark tracking-tight leading-tight font-heading">
                Kimberley Water Supply &amp; Tanker Tracking
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                Check daily dam levels, track emergency water tankers in your area, and receive instant updates for Sol Plaatje Municipality.
              </p>

              {/* Single Primary CTA + Outline Link */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a href="#water-status">
                  <Button size="lg" variant="default" className="w-full sm:w-auto font-bold h-12 px-6">
                    <span>Check Water Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>

                <a href="#tankers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold h-12 px-6">
                    <Truck className="w-4 h-4 text-brand-navy" />
                    <span>Track Active Tankers</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Scene with Designed Truck Artwork */}
            <div className="lg:col-span-5">
              {/*
                PLACEHOLDER FOR KIMBERLEY SCENIC PHOTO:
                To add a real Kimberley photograph (e.g., Big Hole or Newton Reservoir):
                1. Place the high-res image in `/public/images/kimberley_reservoir.jpg`
                2. Replace the visual container below with: `<img src="/images/kimberley_reservoir.jpg" alt="Newton Reservoir Kimberley" className="w-full h-full object-cover rounded-2xl" />`
              */}
              <Card className="border-2 border-brand-accent/30 shadow-md bg-white overflow-hidden p-6 text-center space-y-4">
                <div className="bg-surface-blue p-6 rounded-2xl border border-brand-accent/20 relative overflow-hidden flex flex-col items-center justify-center space-y-3">
                  {/* Tanker driving along wave illustration */}
                  <img src="/truck_map_icon.svg" alt="AquaBophelo Mobile Water Tanker" className="w-24 h-24 object-contain animate-pulse" />
                  <div className="w-full h-1.5 bg-brand-navy/20 rounded-full relative overflow-hidden">
                    <div className="h-full bg-brand-green w-3/4 rounded-full" />
                  </div>
                  <p className="text-xs font-bold text-brand-navy font-heading">
                    Sol Plaatje Fleet Operational Radar
                  </p>
                </div>

                <div className="space-y-1 text-xs text-muted">
                  <p className="font-bold text-brand-navy text-sm">Newton Reservoir Level: 62.5%</p>
                  <p>Riverton Water Works: 82.0% Storage</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Service Alert Banner */}
      <section id="notices" className="bg-amber-50 border-y border-amber-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center space-x-3">
            <span className="shrink-0 p-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div className="text-amber-900 font-medium text-xs sm:text-sm">
              <span className="font-bold">Scheduled Maintenance Notice:</span> Pipe repairs in Galeshewe Zone 3. Mobile water tankers dispatched for backup supply.
            </div>
          </div>

          <Link to="/notices" className="shrink-0 text-xs font-bold text-amber-800 underline hover:text-amber-950">
            Read Details
          </Link>
        </div>
      </section>

      {/* 5. Water Status Section */}
      <section id="water-status" className="py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark font-heading">
              Current Kimberley Water Status
            </h2>
            <p className="text-sm text-muted">
              Live status overview across major Kimberley suburb zones and reservoirs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:border-brand-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">Galeshewe</span>
                  <StatusBadge status="Healthy" />
                </div>
                <CardTitle className="text-base font-bold mt-1">Zone 3 Suburb</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted">Tap water available. Tanker NC-542-KM delivering backup supply.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">Roodepan</span>
                  <StatusBadge status="Watch" />
                </div>
                <CardTitle className="text-base font-bold mt-1">Roodepan Depot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted">Low pressure reported. Standby tanker on standby.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">Kimberley CBD</span>
                  <StatusBadge status="Healthy" />
                </div>
                <CardTitle className="text-base font-bold mt-1">Central Commercial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted">Normal supply operating across central business district.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-accent transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">Bulk Storage</span>
                  <StatusBadge levelPercent={62.5} />
                </div>
                <CardTitle className="text-base font-bold mt-1">Newton Reservoir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted">57.8 ML stored of 92.5 ML capacity.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Live Tanker Radar */}
      <section id="tankers" className="py-16 bg-surface-blue/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
                Interactive Fleet Radar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark font-heading">
                Track Water Tankers Live
              </h2>
            </div>
            <p className="text-xs text-muted max-w-md">
              Click vehicle pins to see registration details, driver ratings, and route stops.
            </p>
          </div>

          <LiveMap dams={dams} trucks={trucks} height="520px" />
        </div>
      </section>

      {/* 7. Footer with Real Logo Asset */}
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
            <p>&copy; {new Date().getFullYear()} AquaBophelo Water Portal. Sol Plaatje Municipality.</p>
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
