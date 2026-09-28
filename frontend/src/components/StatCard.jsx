import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#0e4c8c' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,39,63,0.04)] flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,39,63,0.07)]">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
        <h2 className="text-2xl font-black tracking-tight text-brand-navy-dark">{value}</h2>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: `${accentColor}14`,
            color: accentColor,
            borderColor: `${accentColor}24`,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

export default StatCard;
