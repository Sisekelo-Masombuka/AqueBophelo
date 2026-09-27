import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-[#0284C7]/20 focus:ring-[#0284C7] border border-[#0284C7]',
    secondary:
      'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md shadow-[#16A34A]/20 focus:ring-[#16A34A] border border-[#16A34A]',
    outline:
      'bg-transparent hover:bg-sky-50 dark:hover:bg-[#1F2C45] text-sky-600 dark:text-[#22D3EE] border border-sky-300 dark:border-[#22D3EE]/30 focus:ring-[#0284C7]',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1F2C45] text-slate-700 dark:text-[#E6EDF7] border border-transparent focus:ring-slate-400',
    destructive:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500 border border-rose-600',
  };

  const sizes = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm gap-2',
    lg: 'min-h-[52px] px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      disabled={isDisabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

export default Button;
