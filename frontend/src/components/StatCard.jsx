import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#152e52' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-slate-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          {Icon && <Icon className="h-4 h-4 shrink-0 text-[#152e52]" aria-hidden="true" />}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#152e52]">{value}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-500 font-normal mt-2 pt-2 border-t border-slate-100">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
