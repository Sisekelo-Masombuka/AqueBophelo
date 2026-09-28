import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'border-brand-blue/20 bg-surface-blue text-brand-blue',
        success: 'border-brand-green/30 bg-surface-green text-brand-green-dark',
        warning: 'border-amber-300 bg-amber-50 text-warning',
        danger: 'border-red-200 bg-red-50 text-danger',
        outline: 'border-border bg-white text-brand-navy',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
