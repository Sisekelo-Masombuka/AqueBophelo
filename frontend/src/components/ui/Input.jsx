import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, error, helperText, label, id, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-brand-navy">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        className={cn(
          'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brand-navy placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:border-brand-accent disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger focus-visible:ring-danger',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;
