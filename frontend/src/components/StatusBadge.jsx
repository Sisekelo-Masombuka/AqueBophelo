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
        classes: 'border-brand-green/30 bg-surface-green text-brand-green-dark',
        icon: CheckCircle2,
        label: currentStatus || 'Healthy',
      };
    }
    if (['watch', 'warning', 'ontrip', 'in transit', 'en route'].includes(s)) {
      return {
        classes: 'border-amber-300 bg-amber-50 text-amber-800',
        icon: AlertTriangle,
        label: currentStatus || 'Watch',
      };
    }
    if (['low', 'critical', 'offline', 'maintenance', 'disconnected', 'inactive'].includes(s)) {
      return {
        classes: 'border-red-300 bg-red-50 text-red-700 font-semibold',
        icon: ShieldAlert,
        label: currentStatus || 'Critical',
      };
    }
    if (['connecting', 'reconnecting', 'syncing'].includes(s)) {
      return {
        classes: 'border-blue-300 bg-blue-50 text-brand-blue',
        icon: RefreshCw,
        animateIcon: true,
        label: currentStatus || 'Connecting',
      };
    }
    return {
      classes: 'border-brand-accent/30 bg-surface-blue text-brand-blue',
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
