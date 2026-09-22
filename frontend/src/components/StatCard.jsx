import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#22D3EE' }) {
  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-5 shadow-md flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-[#8A9BB8] uppercase tracking-wider">{title}</p>
        <h2 className="text-2xl font-bold text-[#E6EDF7]">{value}</h2>
        {subtitle && <p className="text-xs text-[#8A9BB8]">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

export default StatCard;
