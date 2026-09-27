import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-50 dark:bg-[#0B1220]/50 border border-slate-200 dark:border-[#1F2C45] rounded-2xl ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-[#22D3EE]/10 border border-sky-200 dark:border-[#22D3EE]/20 flex items-center justify-center text-sky-600 dark:text-[#22D3EE] mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}

      <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-[#E6EDF7] mb-1">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-slate-600 dark:text-[#8A9BB8] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
