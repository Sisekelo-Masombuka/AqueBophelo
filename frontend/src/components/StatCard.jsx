import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          {Icon && <Icon className="w-4 h-4 shrink-0 text-[#152e52]" aria-hidden="true" />}
        </div>
        <div className="text-2xl sm:text-3xl font-sans font-bold text-[#152e52]">{value}</div>
      </div>
      {subtitle && <p className="text-xs text-slate-500 font-normal mt-2 pt-2 border-t border-slate-100">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
