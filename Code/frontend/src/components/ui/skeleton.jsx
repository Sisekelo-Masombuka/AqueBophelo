import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-blue', className)}
      aria-hidden
      {...props}
    />
  );
}
