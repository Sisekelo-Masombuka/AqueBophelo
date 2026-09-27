import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LiveMap from '../components/LiveMap';
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
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      lastUpdated: 'Today at 08:30 (SAST)',
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

  const handleGetStarted = () => {
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
      {/* ==================== TOP NAVIGATION NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#0B1220]/90 backdrop-blur-md border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Civic Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 p-1 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-[#E6EDF7]">AquaBophelo</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30">
                  Sol Plaatje
                </span>
              </div>
              <p className="text-[11px] text-[#8A9BB8] font-medium italic">Elke druppel tel • Metsi ke bophelo</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#8A9BB8]">
            <a href="#how-it-works" className="hover:text-[#E6EDF7] transition-colors">
              How It Works
            </a>
            <a href="#live-tracking" className="hover:text-[#E6EDF7] transition-colors">
              Live Map
            </a>
            <a href="#reservoirs" className="hover:text-[#E6EDF7] transition-colors">
              Reservoirs
            </a>
            <a href="#accessibility" className="hover:text-[#E6EDF7] transition-colors">
              HCI Accessibility
            </a>
          </nav>

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleGetStarted}
                className="min-h-[44px] px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#0284C7]/20 flex items-center space-x-2 active:scale-95 cursor-pointer"
              >
                <span>Go to Dashboard ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#8A9BB8] hover:text-[#E6EDF7] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="min-h-[44px] px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#0284C7]/20 flex items-center space-x-2 active:scale-95"
                >
                  <span>Resident Signup</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-[#8A9BB8] hover:text-white hover:bg-[#1F2C45] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#111B2E] border-b border-[#1F2C45] px-4 py-4 space-y-3">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#8A9BB8] hover:text-white py-1"
            >
              How It Works
            </a>
            <a
              href="#live-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#8A9BB8] hover:text-white py-1"
            >
              Live Map
            </a>
            <a
              href="#reservoirs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#8A9BB8] hover:text-white py-1"
            >
              Reservoirs
            </a>
            <a
              href="#accessibility"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#8A9BB8] hover:text-white py-1"
            >
              HCI Accessibility
            </a>
            <div className="pt-3 border-t border-[#1F2C45] flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 text-sm font-semibold text-[#8A9BB8] hover:text-white border border-[#1F2C45] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 text-sm font-semibold bg-[#0284C7] text-white rounded-xl"
              >
                Resident Signup
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-[#1F2C45]">
        {/* Subtle Background Glow Gradients matching logo colors */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0284C7]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-[#16A34A]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Sol Plaatje Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/30 text-sky-400 text-xs font-bold mb-6">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#16A34A]" />
              <span>Sol Plaatje Municipality Water Telemetry</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#E6EDF7] tracking-tight leading-[1.15] mb-6">
              Real-Time Water Monitoring &amp; Tanker Tracking for Kimberley
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#8A9BB8] leading-relaxed mb-8">
              Know exactly when water tankers are arriving in your neighborhood. Monitor Newton Reservoir and Riverton Water Works reserves live from any device.
            </p>

            {/* Tagline Box */}
            <div className="inline-block px-4 py-2 rounded-xl bg-[#111B2E] border border-[#1F2C45] text-xs sm:text-sm font-semibold text-[#16A34A] mb-8 shadow-inner">
              <span className="text-[#0284C7] font-bold">Motto:</span> &ldquo;Elke druppel tel • Metsi ke bophelo • Every drop counts&rdquo;
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-[#0284C7]/25 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <span>Access Water Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#live-tracking"
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#111B2E] hover:bg-[#1F2C45] text-[#E6EDF7] font-bold text-base border border-[#1F2C45] rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-98"
              >
                <Truck className="w-5 h-5 text-sky-400" />
                <span>View Live Tanker Map</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111B2E] border border-[#1F2C45] p-5 rounded-2xl text-center">
              <p className="text-xs text-[#8A9BB8] font-semibold uppercase tracking-wider mb-1">Newton Reservoir</p>
              <p className="text-2xl font-black text-sky-400">62.5%</p>
              <p className="text-[11px] text-[#8A9BB8] mt-1">57.8 ML stored of 92.5 ML</p>
            </div>
            <div className="bg-[#111B2E] border border-[#1F2C45] p-5 rounded-2xl text-center">
              <p className="text-xs text-[#8A9BB8] font-semibold uppercase tracking-wider mb-1">Riverton Water Works</p>
              <p className="text-2xl font-black text-[#16A34A]">82.0%</p>
              <p className="text-[11px] text-[#8A9BB8] mt-1">123.0 ML stored of 150 ML</p>
            </div>
            <div className="bg-[#111B2E] border border-[#1F2C45] p-5 rounded-2xl text-center">
              <p className="text-xs text-[#8A9BB8] font-semibold uppercase tracking-wider mb-1">Active Tankers</p>
              <p className="text-2xl font-black text-sky-400">3 Vehicles</p>
              <p className="text-[11px] text-[#8A9BB8] mt-1">Galeshewe &amp; Kimberley Central</p>
            </div>
            <div className="bg-[#111B2E] border border-[#1F2C45] p-5 rounded-2xl text-center">
              <p className="text-xs text-[#8A9BB8] font-semibold uppercase tracking-wider mb-1">Service Areas</p>
              <p className="text-2xl font-black text-[#16A34A]">Galeshewe &amp; Roodepan</p>
              <p className="text-[11px] text-[#8A9BB8] mt-1">Sol Plaatje Municipal Zones</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section id="how-it-works" className="py-20 border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E6EDF7] tracking-tight mb-4">
              How AquaBophelo Serves Our Community
            </h2>
            <p className="text-sm sm:text-base text-[#8A9BB8]">
              A complete, transparent telemetry pipeline from raw river extraction to your local water delivery point.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Sequence Cards */}
            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-sky-400 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-[#E6EDF7] mb-2 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-400" />
                <span>Water Extraction</span>
              </h3>
              <p className="text-xs text-[#8A9BB8] leading-relaxed">
                Raw water is pumped from Vaal River and purified at Riverton Water Works plant.
              </p>
            </div>

            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 flex items-center justify-center text-sky-400 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-[#E6EDF7] mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Bulk Reservoir Storage</span>
              </h3>
              <p className="text-xs text-[#8A9BB8] leading-relaxed">
                Purified water feeds Newton Reservoir, supplying municipal pipelines and tanker fill stations.
              </p>
            </div>

            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-[#E6EDF7] mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#16A34A]" />
                <span>Live GPS Tanker Dispatch</span>
              </h3>
              <p className="text-xs text-[#8A9BB8] leading-relaxed">
                Municipal water trucks broadcast real-time location and speed via SignalR as they travel road corridors.
              </p>
            </div>

            <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-[#E6EDF7] mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#16A34A]" />
                <span>Resident Delivery &amp; Alert</span>
              </h3>
              <p className="text-xs text-[#8A9BB8] leading-relaxed">
                Residents see estimated arrival times, stop locations, and emergency water distribution notices on their phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LIVE MAP TRACKING SECTION ==================== */}
      <section id="live-tracking" className="py-20 border-b border-[#1F2C45] bg-[#0B1220]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>MapLibre GL Telemetry</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E6EDF7] tracking-tight">
                Live Kimberley Tanker &amp; Reservoir Map
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#8A9BB8] max-w-md">
              Click any vehicle or reservoir marker to inspect active capacity, driver details, and street delivery route.
            </p>
          </div>

          <LiveMap dams={dams} trucks={trucks} height="520px" />
        </div>
      </section>

      {/* ==================== RESERVOIRS SECTION ==================== */}
      <section id="reservoirs" className="py-20 border-b border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E6EDF7] tracking-tight mb-3">
              Sol Plaatje Reservoir Storage Status
            </h2>
            <p className="text-sm text-[#8A9BB8]">
              Verified capacity readings for main municipal water sources serving Kimberley and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dams.map((dam) => (
              <div
                key={dam.id}
                className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-6 shadow-md hover:border-[#0284C7]/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0284C7]/15 text-sky-400 border border-[#0284C7]/30">
                      {dam.areaName}
                    </span>
                    <h3 className="font-extrabold text-xl text-[#E6EDF7] mt-2">{dam.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#16A34A]">{dam.latestLevel}%</p>
                    <p className="text-[10px] text-[#8A9BB8]">Storage Level</p>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-[#0B1220] h-3 rounded-full overflow-hidden border border-[#1F2C45] mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#0284C7] to-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${dam.latestLevel}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-[#1F2C45]/80">
                  <div>
                    <p className="text-[#8A9BB8]">Total Capacity</p>
                    <p className="font-bold text-[#E6EDF7]">{dam.capacityMegaLitres} ML</p>
                  </div>
                  <div>
                    <p className="text-[#8A9BB8]">Current Volume</p>
                    <p className="font-bold text-[#E6EDF7]">{dam.volumeMegaLitres} ML</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HCI & ACCESSIBILITY SPOTLIGHT ==================== */}
      <section id="accessibility" className="py-20 border-b border-[#1F2C45] bg-[#0B1220]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111B2E] border border-[#1F2C45] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30 text-xs font-bold mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Human-Computer Interaction (HCI) Principles Applied</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E6EDF7] mb-4">
                Designed for All Generations in Sol Plaatje
              </h2>

              <p className="text-sm sm:text-base text-[#8A9BB8] leading-relaxed mb-8">
                AquaBophelo is crafted specifically to serve Kimberley residents ranging from tech-savvy youth to elderly citizens. Usability, accessibility, and clarity are built into every screen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start space-x-3 bg-[#0B1220] p-4 rounded-xl border border-[#1F2C45]">
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#E6EDF7]">Icon + Text Clarity</h4>
                    <p className="text-xs text-[#8A9BB8] mt-1">
                      No standalone ambiguous icons or emojis. Every action has plain-language text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-[#0B1220] p-4 rounded-xl border border-[#1F2C45]">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#E6EDF7]">Accessible Touch Targets</h4>
                    <p className="text-xs text-[#8A9BB8] mt-1">
                      All buttons and tap areas exceed 44px for effortless interaction on mobile phones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-[#0B1220] p-4 rounded-xl border border-[#1F2C45]">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#E6EDF7]">High-Contrast Typography</h4>
                    <p className="text-xs text-[#8A9BB8] mt-1">
                      Derived directly from the official logo for optimal readability under bright outdoor sunlight.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-[#0B1220] p-4 rounded-xl border border-[#1F2C45]">
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#E6EDF7]">Visibility of System Status</h4>
                    <p className="text-xs text-[#8A9BB8] mt-1">
                      Instant feedback for GPS connection, location freshness, and dispatch updates.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                className="min-h-[48px] px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#0284C7]/20 flex items-center space-x-2 active:scale-95 cursor-pointer"
              >
                <span>Enter Resident Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 bg-[#0B1220] text-[#8A9BB8] text-xs border-t border-[#1F2C45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 p-1 bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-xl flex items-center justify-center shrink-0">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#E6EDF7]">AquaBophelo System</p>
              <p className="text-[11px] text-[#8A9BB8]">Sol Plaatje Municipality — Kimberley, Northern Cape</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="italic font-medium text-[#16A34A] mb-1">
              &ldquo;Elke druppel tel • Metsi ke bophelo&rdquo;
            </p>
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} Sol Plaatje Municipal Water Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
