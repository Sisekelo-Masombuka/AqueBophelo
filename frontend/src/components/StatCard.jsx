import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#0284C7' }) {
  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-[#0284C7]/30 transition-all">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#8A9BB8] uppercase tracking-wider">{title}</p>
        <h2 className="text-2xl font-black text-[#E6EDF7] tracking-tight">{value}</h2>
        {subtitle && <p className="text-xs text-[#8A9BB8] font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            borderColor: `${accentColor}30`,
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

export default StatCard;
