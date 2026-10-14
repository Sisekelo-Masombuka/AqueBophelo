import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

export function Progress({ className, value = 0, ...props }) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-3 w-full overflow-hidden rounded-full bg-surface-blue', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-brand-blue transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
