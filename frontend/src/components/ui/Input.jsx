import React from 'react';

export function Input({
  label,
  error,
  helpText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-[#8A9BB8]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-[#8A9BB8]">
            <Icon className="w-4 h-4 shrink-0" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full min-h-[44px] ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2.5 bg-white dark:bg-[#0B1220] border ${
            error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-300 dark:border-[#1F2C45] focus:border-[#0284C7] dark:focus:border-[#22D3EE]'
          } rounded-xl text-sm text-slate-900 dark:text-[#E6EDF7] placeholder-slate-400 dark:placeholder-[#8A9BB8]/50 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 transition-all ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : helpText ? (
        <p className="text-[11px] text-slate-500 dark:text-[#8A9BB8]">{helpText}</p>
      ) : null}
    </div>
  );
}

export default Input;
