import React from 'react';
import { cn } from '../lib/utils';
import logoSrc from '../assets/AquaBophelo_logo.svg';

export function BrandLogo({ className, size = 'md', showText = true, textTheme = 'dark' }) {

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

  const titleColor = textTheme === 'light' ? 'text-white' : 'text-navy';
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
          <span className={cn('font-medium text-xs pt-0.5', subColor)}>
            Sol Plaatje Water Portal
          </span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
