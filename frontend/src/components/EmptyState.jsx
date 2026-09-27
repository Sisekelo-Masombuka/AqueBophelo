import React from 'react';
import { HelpCircle } from 'lucide-react';

export function EmptyState({
  icon: Icon = HelpCircle,
  title = 'No Data Available',
  description = 'There are currently no records to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] border-dashed rounded-2xl p-8 text-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-[#1F2C45]/60 text-[#8A9BB8] flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-base text-[#E6EDF7] mb-1">{title}</h3>
      <p className="text-xs text-[#8A9BB8] mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] border border-[#22D3EE]/40 rounded-xl text-xs font-semibold transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
