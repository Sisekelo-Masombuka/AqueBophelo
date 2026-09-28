import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex h-12 items-center gap-1 rounded-[var(--radius-md)] bg-surface-blue p-1', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm font-semibold text-muted data-[state=active]:bg-white data-[state=active]:text-brand-navy',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />;
}
