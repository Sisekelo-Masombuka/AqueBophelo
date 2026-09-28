import { cn } from '../lib/utils';

export function BrandLogo({ className, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'ab-logo-lg max-h-24' : size === 'sm' ? 'max-h-10' : 'ab-logo';
  return (
    <img
      src="/AquaBophelo_logo.svg"
      alt="AquaBophelo"
      className={cn(sizeClass, className)}
    />
  );
}
