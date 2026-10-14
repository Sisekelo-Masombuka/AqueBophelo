import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-brand-blue/20 bg-brand-blue/5 text-brand-blue',
        success: 'border-brand-green/20 bg-brand-green/8 text-brand-green-dark',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        danger: 'border-red-200 bg-red-50 text-red-700',
        outline: 'border-slate-200 bg-white text-slate-700',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
