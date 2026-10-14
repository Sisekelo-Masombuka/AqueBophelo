import React from 'react';
import { ShieldCheck, Lock, Eye, MapPin, Database, FileText } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-[#1d70b8] selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <BrandLogo variant="full" size="md" />
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login" className="text-sm font-medium text-[#152e52]">
              {t('signIn')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-10">
        {/* Header Title */}
        <div className="space-y-3 text-left border-b border-slate-200 pb-6">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2e7d32] bg-[#f2f9f3] px-3 py-1 rounded-md border border-[#2e7d32]/30">
            <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
            <span>{t('popiaPrivacyTitle')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152e52]">
            {t('privacySubtitle')}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t('privacySummary')}
          </p>
        </div>

        {/* Section Grid */}
        <div className="space-y-8 text-sm text-slate-700">
          <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#152e52]" />
              <span>{t('whoCanSeeInfo')}</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('whoCanSeeInfoDesc')}
            </p>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#152e52]" />
              <span>{t('locationSharing')}</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('locationSharingDesc')}
            </p>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#152e52] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#152e52]" />
              <span>{t('dataSecurity')}</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {t('dataSecurityDesc')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#152e52] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#152e52]" />
              <span>{t('officialPrivacyContacts')}</span>
            </h3>
            <p className="text-xs text-slate-600 font-normal">
              {t('privacyContactDesc')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPage;
