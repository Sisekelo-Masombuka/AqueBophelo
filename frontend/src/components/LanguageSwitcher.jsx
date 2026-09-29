import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center space-x-1 border border-slate-300 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-2xs ${className || ''}`}>
      <Globe className="w-3.5 h-3.5 text-[#152e52] shrink-0" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent text-[#152e52] font-semibold focus:outline-none cursor-pointer text-xs"
        aria-label="Select System Language"
      >
        <option value="EN">EN (English)</option>
        <option value="AF">AF (Afrikaans)</option>
        <option value="TN">TN (Setswana)</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
