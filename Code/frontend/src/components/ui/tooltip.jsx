import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, ...props }) {
  return (
    <TooltipPrimitive.Content
      className={cn(
        'z-50 rounded-md border border-border bg-white px-3 py-2 text-xs text-brand-navy shadow-sm',
        className
      )}
      {...props}
    />
  );
}
