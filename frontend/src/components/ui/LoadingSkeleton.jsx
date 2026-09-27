import React from 'react';

export function LoadingSkeleton({ className = '', height = '20px', width = '100%', count = 1 }) {
  const items = Array.from({ length: count });

  return (
    <div className="space-y-3 w-full">
      {items.map((_, index) => (
        <div
          key={index}
          className={`bg-slate-200 dark:bg-[#1F2C45]/60 animate-pulse rounded-xl ${className}`}
          style={{ height, width }}
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
