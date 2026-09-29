import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export function StatusBadge({ status, levelPercent, className }) {
  let currentStatus = status;
  if (!currentStatus && levelPercent !== undefined) {
    if (levelPercent >= 60) currentStatus = 'Healthy';
    else if (levelPercent >= 30) currentStatus = 'Watch';
    else if (levelPercent >= 15) currentStatus = 'Low';
    else currentStatus = 'Critical';
  }

  const getStyle = () => {
    const s = currentStatus?.toLowerCase() || '';
    if (['healthy', 'online', 'available', 'completed', 'active'].includes(s)) {
      return {
        classes: 'bg-[#2e7d32] text-white font-semibold shadow-2xs',
        label: currentStatus || 'Healthy',
      };
    }
    if (['watch', 'warning', 'ontrip', 'in transit', 'en route'].includes(s)) {
      return {
        classes: 'bg-amber-600 text-white font-semibold shadow-2xs',
        label: currentStatus || 'Watch',
      };
    }
    if (['low', 'critical', 'offline', 'maintenance', 'disconnected', 'inactive'].includes(s)) {
      return {
        classes: 'bg-red-700 text-white font-semibold shadow-2xs',
        label: currentStatus || 'Critical',
      };
    }
    if (['connecting', 'reconnecting', 'syncing'].includes(s)) {
      return {
        classes: 'bg-[#152e52] text-white font-semibold shadow-2xs',
        icon: RefreshCw,
        animateIcon: true,
        label: currentStatus || 'Connecting',
      };
    }
    return {
      classes: 'bg-slate-700 text-white font-semibold',
      label: currentStatus || 'Information',
    };
  };

  const { classes, icon: Icon, animateIcon, label } = getStyle();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
        classes,
        className
      )}
    >
      {Icon && <Icon className={cn('h-3.5 w-3.5 shrink-0', animateIcon && 'animate-spin')} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
