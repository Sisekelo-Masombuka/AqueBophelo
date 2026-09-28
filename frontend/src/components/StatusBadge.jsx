import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, Truck, RefreshCw } from 'lucide-react';
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
        classes: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: CheckCircle2,
        label: currentStatus || 'Healthy',
      };
    }
    if (['watch', 'warning', 'ontrip', 'in transit', 'en route'].includes(s)) {
      return {
        classes: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: AlertTriangle,
        label: currentStatus || 'Watch',
      };
    }
    if (['low', 'critical', 'offline', 'maintenance', 'disconnected', 'inactive'].includes(s)) {
      return {
        classes: 'border-rose-200 bg-rose-50 text-rose-700 font-semibold',
        icon: ShieldAlert,
        label: currentStatus || 'Critical',
      };
    }
    if (['connecting', 'reconnecting', 'syncing'].includes(s)) {
      return {
        classes: 'border-sky-200 bg-sky-50 text-brand-blue',
        icon: RefreshCw,
        animateIcon: true,
        label: currentStatus || 'Connecting',
      };
    }
    return {
      classes: 'border-slate-200 bg-slate-100 text-slate-700',
      icon: Info,
      label: currentStatus || 'Information',
    };
  };

  const { classes, icon: Icon, animateIcon, label } = getStyle();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide',
        classes,
        className
      )}
    >
      <Icon className={cn('h-3.5 w-3.5 shrink-0', animateIcon && 'animate-spin')} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
