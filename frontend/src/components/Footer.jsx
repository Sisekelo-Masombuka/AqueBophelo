import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#152e52] border-t-4 border-[#2e7d32] text-slate-200 font-sans selection:bg-[#1d70b8] selection:text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Municipal Identity */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-block bg-white p-2 rounded-md">
              <BrandLogo variant="full" size="md" />
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {t('heroDesc')}
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-[#62d26f] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#62d26f]" />
              <span>Sol Plaatje Municipality Verified</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide border-b border-slate-700/60 pb-1.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-normal">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <a href="/#water-status" className="hover:text-white hover:underline transition-colors">
                  {t('waterStatus')}
                </a>
              </li>
              <li>
                <a href="/#tankers" className="hover:text-white hover:underline transition-colors">
                  {t('liveMap')}
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white hover:underline transition-colors text-amber-300 font-medium">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide border-b border-slate-700/60 pb-1.5">
              {t('emergencyHotlines')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-normal">
              <li className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">{t('response247')}:</span>
                  <a href="tel:0538306100" className="hover:underline text-sky-300">053 830 6100</a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">{t('callCentre')}:</span>
                  <a href="tel:0538306911" className="hover:underline text-sky-300">053 830 6911</a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#62d26f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email Inquiries:</span>
                  <a href="mailto:water@solplaatje.org.za" className="hover:underline text-sky-300">water@solplaatje.org.za</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Civic Office Location */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide border-b border-slate-700/60 pb-1.5">
              Civic Centre Location
            </h4>
            <div className="text-xs text-slate-300 space-y-1 font-normal leading-relaxed">
              <p className="font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#62d26f]" />
                <span>Sol Plaatje Civic Centre</span>
              </p>
              <p>Sol Plaatje Drive, City Hall</p>
              <p>Kimberley, 8301</p>
              <p>Northern Cape, South Africa</p>
            </div>
            <div className="pt-2">
              <span className="inline-block text-[11px] bg-[#2e7d32] text-white px-2.5 py-1 rounded-md font-medium">
                SANS 241 Water Quality Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-normal gap-3">
          <p>© 2026 Sol Plaatje Local Municipality. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-white hover:underline text-slate-300 font-medium">
              {t('privacy')}
            </Link>
            <span>·</span>
            <Link to="/login" className="hover:text-white hover:underline">
              {t('signIn')}
            </Link>
            <span>·</span>
            <Link to="/register" className="hover:text-white hover:underline">
              {t('createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
