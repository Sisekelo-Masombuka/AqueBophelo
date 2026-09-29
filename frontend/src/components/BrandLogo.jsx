import React from 'react';
import { cn } from '../lib/utils';

export function BrandLogo({ className, variant = 'full', size = 'md', showText = true, textTheme = 'dark' }) {
  const logoSrc = '/AquaBophelo_logo.svg';

  const logoHeight = size === 'lg'
    ? 'h-12 md:h-14'
    : size === 'sm'
    ? 'h-8 md:h-9'
    : 'h-9 md:h-10';

  const titleSize = size === 'lg'
    ? 'text-lg md:text-xl'
    : size === 'sm'
    ? 'text-sm md:text-base'
    : 'text-base md:text-lg';

  const subSize = size === 'lg'
    ? 'text-[11px]'
    : size === 'sm'
    ? 'text-[9px]'
    : 'text-[10px]';

  const titleColor = textTheme === 'light' ? 'text-white' : 'text-[#152e52]';
  const subColor = textTheme === 'light' ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={cn('inline-flex items-center space-x-2.5 shrink-0 select-none group cursor-pointer', className)}>
      <img
        src={logoSrc}
        alt="AquaBophelo — Sol Plaatje Water Portal"
        className={cn('object-contain w-auto transition-transform duration-200 group-hover:scale-105', logoHeight)}
      />
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={cn('font-serif font-bold tracking-tight', titleSize, titleColor)}>
            AquaBophelo
          </span>
          <span className={cn('font-medium tracking-wide uppercase pt-1', subSize, subColor)}>
            Sol Plaatje Water
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
