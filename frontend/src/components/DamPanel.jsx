import React from 'react';
import { Droplet, Calendar, HardDrive, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export function DamPanel({ dam, onSelect }) {
  if (!dam) return null;

  const {
    id,
    name = 'Municipal Reservoir',
    capacityMegaLitres = 100,
    latestLevel = 65,
    volumeMegaLitres = 65,
    areaName = 'Sol Plaatje District',
    lastUpdated = 'Just now (SAST)',
  } = dam;

  // Determine progress bar color based on level
  const getBarColor = (level) => {
    if (level >= 50) return 'bg-[#22C55E]';
    if (level >= 30) return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
  };

  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-5 shadow-md hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between">
      <div>
        {/* Header: Name, Area & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#E6EDF7] leading-snug">{name}</h3>
              <p className="text-xs text-[#8A9BB8]">{areaName}</p>
            </div>
          </div>
          <StatusBadge levelPercent={latestLevel} />
        </div>

        {/* Level Percentage & Capacity */}
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-3xl font-extrabold text-[#E6EDF7]">{latestLevel}%</span>
            <span className="text-xs text-[#8A9BB8] ml-1.5 font-medium">Capacity Fill</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-[#E6EDF7]">{volumeMegaLitres} ML</span>
            <span className="text-xs text-[#8A9BB8] block">of {capacityMegaLitres} ML</span>
          </div>
        </div>

        {/* Visual Water Fill Progress Bar */}
        <div className="w-full bg-[#0B1220] rounded-full h-3 overflow-hidden border border-[#1F2C45] mb-4">
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
      <div className="pt-3 border-t border-[#1F2C45] flex items-center justify-between text-xs text-[#8A9BB8]">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Updated: {lastUpdated}</span>
        </div>
        {onSelect && (
          <button
            onClick={() => onSelect(dam)}
            className="text-[#22D3EE] hover:text-[#22D3EE]/80 font-medium flex items-center gap-0.5"
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
