import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export function SheetContent({ className, children, side = 'right', ...props }) {
  const sideClass =
    side === 'left'
      ? 'left-0 border-r ab-sheet-left'
      : side === 'top'
        ? 'top-0 border-b'
        : side === 'bottom'
          ? 'bottom-0 border-t'
          : 'right-0 border-l ab-sheet-right';

  const sizeClass = side === 'top' || side === 'bottom' ? 'inset-x-0' : 'inset-y-0 w-full max-w-sm';

  return (
    <SheetPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-brand-navy/50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 bg-white p-6 shadow-[var(--shadow-md)]',
          sizeClass,
          sideClass,
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-muted hover:bg-surface-blue"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }) {
  return <div className={cn('mb-6 pr-10', className)} {...props} />;
}

export function SheetTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title className={cn('text-lg font-bold text-brand-navy', className)} {...props} />
  );
}
