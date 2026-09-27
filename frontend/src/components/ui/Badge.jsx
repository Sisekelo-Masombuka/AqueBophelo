import React from 'react';

export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'bg-emerald-50 dark:bg-[#22C55E]/15 text-emerald-700 dark:text-[#22C55E] border-emerald-200 dark:border-[#22C55E]/30',
    warning: 'bg-amber-50 dark:bg-[#F59E0B]/15 text-amber-700 dark:text-[#F59E0B] border-amber-200 dark:border-[#F59E0B]/30',
    error: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
    info: 'bg-sky-50 dark:bg-[#22D3EE]/15 text-sky-700 dark:text-[#22D3EE] border-sky-200 dark:border-[#22D3EE]/30',
    neutral: 'bg-slate-100 dark:bg-[#0B1220] text-slate-700 dark:text-[#8A9BB8] border-slate-200 dark:border-[#1F2C45]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.info
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
