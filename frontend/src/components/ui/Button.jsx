import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-brand-blue text-white shadow hover:bg-brand-navy active:bg-brand-navy-dark',
        secondary: 'bg-surface-blue text-brand-blue border border-brand-accent/30 hover:bg-brand-accent/15 active:bg-brand-blue/20',
        success: 'bg-brand-green text-white shadow hover:bg-brand-green-dark active:bg-green-800',
        outline: 'border border-border bg-white text-brand-navy shadow-sm hover:bg-surface-blue hover:text-brand-blue',
        ghost: 'text-brand-navy hover:bg-surface-blue hover:text-brand-blue',
        danger: 'bg-danger text-white shadow hover:bg-red-700 active:bg-red-800',
        link: 'text-brand-blue underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-6 text-base',
        icon: 'h-9 w-9 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin text-current" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
