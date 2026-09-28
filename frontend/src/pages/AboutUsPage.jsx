import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ShieldCheck, MapPin, Truck, AlertTriangle, ArrowRight, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';

export function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#EAF6FC] text-[#0A2A4F] flex flex-col font-sans">
      {/* Sol Plaatje Top Civic Banner */}
      <div className="bg-[#0A2A4F] text-[#F0F7FF] text-xs py-2 px-4 border-b border-[#0E4C8C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-semibold">
            <span className="bg-[#2E9E4F] text-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Official</span>
            <span>SOL PLAATJE MUNICIPALITY — Kimberley, Northern Cape</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-[#A3C7EB]">
            <span>Emergency Water Line: <strong className="text-white">053 830 6100</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Call Centre: <strong className="text-white">053 830 6911</strong></span>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-[#0E4C8C] text-white border-b border-[#0A2A4F] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 p-1 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              <img src="/AquaBophelo_logo.svg" alt="AquaBophelo Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AquaBophelo</span>
                <span className="text-xs bg-[#2E9E4F] text-white px-2 py-0.5 rounded-full font-bold">SPM</span>
              </div>
              <p className="text-[10px] text-[#A3C7EB] font-semibold italic">Elke druppel tel • Metsi ke bophelo</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-[#A3C7EB]">
            <Link to="/landing" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-white border-b-2 border-[#2E9E4F] pb-1">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/landing#status" className="hover:text-white transition-colors">Dam Levels</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A2A4F] text-white border border-[#2991C8]/40 hover:bg-[#2991C8] transition-all">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E9E4F] text-white hover:bg-[#215E22] transition-all shadow-md">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0E4C8C] to-[#0A2A4F] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#2E9E4F]/20 border border-[#2E9E4F]/40 text-[#2E9E4F] text-xs font-bold uppercase tracking-wider">
            About AquaBophelo
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Protecting Kimberley's Water Supply, Drop by Drop.
          </h1>
          <p className="text-base md:text-lg text-[#A3C7EB] leading-relaxed max-w-2xl mx-auto">
            AquaBophelo (<em>Bophelo</em> meaning "Life") is Sol Plaatje Municipality's digital water monitoring and real-time tanker tracking system, engineered for the residents of Kimberley, Northern Cape.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 flex-1">
        {/* Purpose Cards Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#2991C8]/20 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6FC] text-[#0E4C8C] flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6 text-[#2991C8]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A2A4F]">Real-Time Dam Storage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Provides daily storage level monitoring across Newton Reservoir and Riverton Water Works in MegaLitres (ML) with automated alert thresholds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#2E9E4F]/20 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6E3] text-[#2E9E4F] flex items-center justify-center font-bold">
              <Truck className="w-6 h-6 text-[#2E9E4F]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A2A4F]">Live Water Tanker Map</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tracks municipal delivery trucks moving through Galeshewe, Roodepan, and Kimberley Central, giving residents live GPS locations and estimated arrival times.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#2991C8]/20 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6FC] text-[#0E4C8C] flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A2A4F]">Verified Email Notifications</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sends instant email alerts for water outages, delivery route changes, and dam status changes directly to subscribed residents.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white p-8 md:p-12 rounded-3xl border border-[#2991C8]/20 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A2A4F]">Know Your Water System</h2>
            <p className="text-sm text-slate-600">
              How AquaBophelo connects Sol Plaatje Municipality staff, tanker drivers, and Kimberley residents in one transparent ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#EAF6FC] p-5 rounded-2xl border border-[#2991C8]/20 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-[#0E4C8C] text-white font-bold flex items-center justify-center text-xs">1</span>
              <h4 className="font-bold text-[#0A2A4F] text-sm">Dam Level Entry</h4>
              <p className="text-xs text-slate-600">Municipal engineers record dam level readings daily at Newton & Riverton.</p>
            </div>

            <div className="bg-[#EAF6FC] p-5 rounded-2xl border border-[#2991C8]/20 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-[#0E4C8C] text-white font-bold flex items-center justify-center text-xs">2</span>
              <h4 className="font-bold text-[#0A2A4F] text-sm">Automated Thresholds</h4>
              <p className="text-xs text-slate-600">System evaluates levels: Healthy (&ge;60%), Watch (30-60%), Critical (&lt;30%).</p>
            </div>

            <div className="bg-[#EAF6FC] p-5 rounded-2xl border border-[#2991C8]/20 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-[#0E4C8C] text-white font-bold flex items-center justify-center text-xs">3</span>
              <h4 className="font-bold text-[#0A2A4F] text-sm">Live GPS Telemetry</h4>
              <p className="text-xs text-slate-600">Water tanker drivers broadcast live coordinates while making scheduled stops.</p>
            </div>

            <div className="bg-[#EAF6E3] p-5 rounded-2xl border border-[#2E9E4F]/30 space-y-2 relative">
              <span className="w-8 h-8 rounded-full bg-[#2E9E4F] text-white font-bold flex items-center justify-center text-xs">4</span>
              <h4 className="font-bold text-[#215E22] text-sm">Resident Empowerment</h4>
              <p className="text-xs text-slate-600">Residents track trucks on the live map, receive email notices, and report leaks.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A2A4F] text-[#A3C7EB] border-t border-[#0E4C8C] py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white">AquaBophelo — Sol Plaatje Municipality Water Monitoring</p>
            <p className="text-[11px] mt-1">Diploma in ICT Capstone Project · Sol Plaatje University, Kimberley</p>
          </div>
          <div className="flex space-x-6 text-xs font-semibold">
            <Link to="/landing" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutUsPage;
