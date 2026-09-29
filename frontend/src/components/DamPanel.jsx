import React from 'react';
import { Droplet, Calendar, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export function DamPanel({ dam, onSelect }) {
  if (!dam) return null;

  const {
    name = 'Municipal Reservoir',
    capacityMegaLitres = 100,
    latestLevel = 65,
    volumeMegaLitres = 65,
    areaName = 'Sol Plaatje District',
    lastUpdated = 'Just now (CAT)',
  } = dam;

  const getBarColor = (level) => {
    if (level >= 50) return 'bg-[#2e7d32]';
    if (level >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs transition-colors hover:border-slate-300 flex flex-col justify-between">
      <div>
        {/* Header: Name, Area & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start space-x-2.5">
            <Droplet className="w-5 h-5 text-[#152e52] fill-current shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-base text-[#152e52] leading-snug">{name}</h3>
              <p className="text-xs text-slate-500 font-normal">{areaName}</p>
            </div>
          </div>
          <StatusBadge levelPercent={latestLevel} />
        </div>

        {/* Level Percentage & Capacity */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-3xl font-serif font-bold text-[#152e52]">{latestLevel}%</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Capacity Fill</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-[#152e52]">{volumeMegaLitres} ML</span>
            <span className="text-xs text-slate-500 block font-normal">of {capacityMegaLitres} ML</span>
          </div>
        </div>

        {/* Visual Water Fill Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(latestLevel)}`}
            style={{ width: `${Math.min(Math.max(latestLevel, 0), 100)}%` }}
            role="progressbar"
            aria-valuenow={latestLevel}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Footer: Timestamp & Action */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1.5 font-normal">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated: {lastUpdated}</span>
        </div>
        {onSelect && (
          <button
            onClick={() => onSelect(dam)}
            className="text-[#152e52] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
          >
            <span>Trends</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default DamPanel;
