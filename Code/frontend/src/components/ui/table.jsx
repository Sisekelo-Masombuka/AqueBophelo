import * as React from 'react';
import { cn } from '../../lib/utils';

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('bg-surface-blue text-brand-navy', className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn('border-b border-border', className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return (
    <th className={cn('h-12 px-3 text-left font-semibold text-brand-navy', className)} {...props} />
  );
}

export function TableCell({ className, ...props }) {
  return <td className={cn('p-3 align-middle text-brand-navy', className)} {...props} />;
}
