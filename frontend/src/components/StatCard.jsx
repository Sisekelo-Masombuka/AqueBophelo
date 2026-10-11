import React from 'react';
import StatusBadge from './StatusBadge';

export function StatCard({ title, value, subtitle, icon: Icon, status }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <div className="flex items-center gap-1.5">
            {status && <StatusBadge status={status} />}
            {Icon && <Icon className="w-4 h-4 shrink-0 text-navy" aria-hidden="true" />}
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-sans font-bold text-navy">{value}</div>
      </div>
      {subtitle && <p className="text-xs text-slate-500 font-normal mt-2 pt-2 border-t border-slate-100">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
