import * as React from 'react';
import { cn } from '../../lib/utils';

export function Textarea({ label, error, helpText, className, id, required, ...props }) {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={areaId} className="block text-sm font-semibold text-brand-navy">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={areaId}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'w-full min-h-28 rounded-[var(--radius-md)] border bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-muted/70',
          error ? 'border-danger' : 'border-border',
          'focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : helpText ? (
        <p className="text-xs text-muted">{helpText}</p>
      ) : null}
    </div>
  );
}
