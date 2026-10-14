import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ShieldCheck, MapPin, Truck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <BrandLogo variant="full" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <Link to="/" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('home')}
            </Link>
            <a href="/#water-status" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('waterStatus')}
            </a>
            <a href="/#tankers" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('liveMap')}
            </a>
            <Link to="/about" className="text-[#152e52] font-semibold">
              {t('aboutUs')}
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-[#152e52] transition-colors">
              {t('contactUs')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-[#152e52]">
              {t('signIn')}
            </Link>
            <Link to="/register">
              <button className="bg-[#152e52] hover:bg-[#0f223d] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer">
                {t('createAccount')}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-[#f8fafc] border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 border-l-2 border-[#2e7d32] pl-2 mx-auto w-fit">
            <span className="text-[#2e7d32] font-medium text-sm italic">
              {t('motto')}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#152e52]">
            {t('aboutTitle')}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            {t('aboutDesc')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 flex-1">
        {/* Purpose Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-xs">
            <div className="text-[#152e52] flex items-center gap-2">
              <Droplet className="w-5 h-5 text-[#152e52]" />
              <h3 className="font-serif text-lg font-bold text-[#152e52]">{t('realtimeStorage')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('realtimeStorageDesc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-xs">
            <div className="text-[#152e52] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#152e52]" />
              <h3 className="font-serif text-lg font-bold text-[#152e52]">{t('liveTankerMap')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('liveTankerMapDesc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3 shadow-xs">
            <div className="text-[#152e52] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#152e52]" />
              <h3 className="font-serif text-lg font-bold text-[#152e52]">{t('verifiedEmailNotifications')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('verifiedEmailNotificationsDesc')}
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#152e52]">{t('knowYourSystem')}</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {t('knowYourSystemDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">1</span>
              <h4 className="font-serif font-bold text-[#152e52] text-sm">{t('damLevelEntry')}</h4>
              <p className="text-xs text-slate-600 font-normal">{t('damLevelEntryDesc')}</p>
            </div>

            <div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">2</span>
              <h4 className="font-serif font-bold text-[#152e52] text-sm">{t('autoThresholds')}</h4>
              <p className="text-xs text-slate-600 font-normal">{t('autoThresholdsDesc')}</p>
            </div>

            <div className="bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-md bg-[#152e52] text-white font-bold flex items-center justify-center text-xs">3</span>
              <h4 className="font-serif font-bold text-[#152e52] text-sm">{t('liveGpsTelemetry')}</h4>
              <p className="text-xs text-slate-600 font-normal">{t('liveGpsTelemetryDesc')}</p>
            </div>

            <div className="bg-[#f2f9f3] p-5 rounded-lg border border-[#c3e6c8] space-y-2">
              <span className="w-7 h-7 rounded-md bg-[#2e7d32] text-white font-bold flex items-center justify-center text-xs">4</span>
              <h4 className="font-serif font-bold text-[#2e7d32] text-sm">{t('residentEmpowerment')}</h4>
              <p className="text-xs text-slate-600 font-normal">{t('residentEmpowermentDesc')}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Municipal Footer */}
      <Footer />
    </div>
  );
}

export default AboutUsPage;
