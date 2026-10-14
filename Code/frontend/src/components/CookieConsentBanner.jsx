import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check, X, Lock } from 'lucide-react';
import { initGoogleAnalytics } from '../services/analytics';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('aquabophelo_cookie_consent');
    if (consent === 'granted') {
      initGoogleAnalytics();
    } else if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('aquabophelo_cookie_consent', 'granted');
    initGoogleAnalytics();
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('aquabophelo_cookie_consent', 'denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 shadow-2xl p-4 sm:p-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center shrink-0 border border-[#2e7d32]/20 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#152e52] flex items-center gap-1.5">
              <span>POPIA Privacy & Cookie Notice</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Sol Plaatje Municipality
              </span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              We use essential cookies to maintain secure sessions and water alert preferences under the South African Protection of Personal Information Act (POPIA). With your consent, we also collect anonymized performance telemetry. Learn more in our{' '}
              <Link to="/privacy" className="text-[#1d70b8] underline font-medium hover:text-[#152e52]">
                Privacy Notice
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#152e52] hover:bg-[#0f223d] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>

          <button
            onClick={handleEssentialOnly}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Essential Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
