import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item className={cn('border-b border-border', className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-left text-base font-semibold text-brand-navy hover:text-brand-blue min-h-12',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-5 shrink-0 text-muted" aria-hidden />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden text-sm text-muted" {...props}>
      <div className={cn('pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
