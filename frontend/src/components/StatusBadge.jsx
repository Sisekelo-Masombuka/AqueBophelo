import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const DISPLAY_LABEL_MAP = {
  OnTrip: 'On trip',
  ontrip: 'On trip',
  'ON TRIP': 'On trip',
  InProgress: 'In progress',
  in_progress: 'In progress',
  'IN_PROGRESS': 'In progress',
  In_Progress: 'In progress',
  Healthy: 'Healthy',
  HEALTHY: 'Healthy',
  Watch: 'Watch',
  WATCH: 'Watch',
  Low: 'Low',
  LOW: 'Low',
  Critical: 'Critical',
  CRITICAL: 'Critical',
  Available: 'Available',
  AVAILABLE: 'Available',
  Dispatched: 'Dispatched',
  DISPATCHED: 'Dispatched',
  Completed: 'Completed',
  COMPLETED: 'Completed',
  Pending: 'Pending',
  PENDING: 'Pending',
  Active: 'Active',
  ACTIVE: 'Active',
  Inactive: 'Inactive',
  INACTIVE: 'Inactive',
  Connecting: 'Connecting',
  CONNECTING: 'Connecting',
  Reconnecting: 'Reconnecting',
  RECONNECTING: 'Reconnecting',
  Disconnected: 'Disconnected',
  DISCONNECTED: 'Disconnected',
  Offline: 'Offline',
  OFFLINE: 'Offline',
  Online: 'Online',
  ONLINE: 'Online',
  Maintenance: 'In maintenance',
  IN_MAINTENANCE: 'In maintenance',
};

export function StatusBadge({ status, levelPercent, className }) {
  let currentStatus = status;
  if (!currentStatus && levelPercent !== undefined) {
    if (levelPercent >= 60) currentStatus = 'Healthy';
    else if (levelPercent >= 30) currentStatus = 'Watch';
    else if (levelPercent >= 15) currentStatus = 'Low';
    else currentStatus = 'Critical';
  }

  const getDisplayLabel = (rawStatus) => {
    if (!rawStatus) return 'Information';
    return DISPLAY_LABEL_MAP[rawStatus] || rawStatus;
  };

  const getStyle = () => {
    const s = currentStatus?.toLowerCase() || '';
    if (['healthy', 'online', 'available', 'completed', 'active'].includes(s)) {
      return {
        classes: 'bg-[#f2f9f3] text-[#2e7d32] border border-[#b8e3bd]',
        label: getDisplayLabel(currentStatus || 'Healthy'),
      };
    }
    if (['watch', 'warning', 'ontrip', 'in transit', 'en route', 'on trip'].includes(s)) {
      return {
        classes: 'bg-amber-50 text-amber-800 border border-amber-200',
        label: getDisplayLabel(currentStatus || 'Watch'),
      };
    }
    if (['low', 'critical', 'offline', 'maintenance', 'in_maintenance', 'in maintenance', 'disconnected', 'inactive'].includes(s)) {
      return {
        classes: 'bg-red-50 text-red-700 border border-red-200',
        label: getDisplayLabel(currentStatus || 'Critical'),
      };
    }
    if (['connecting', 'reconnecting', 'syncing', 'dispatched', 'pending', 'in_progress', 'inprogress', 'in progress'].includes(s)) {
      return {
        classes: 'bg-[#eaf4fb] text-[#1d70b8] border border-[#bcd6ea]',
        icon: ['connecting', 'reconnecting', 'syncing'].includes(s) ? RefreshCw : null,
        animateIcon: ['connecting', 'reconnecting', 'syncing'].includes(s),
        label: getDisplayLabel(currentStatus || 'Connecting'),
      };
    }
    return {
      classes: 'bg-slate-100 text-slate-700 border border-slate-200',
      label: getDisplayLabel(currentStatus || 'Information'),
    };
  };

  const { classes, icon: Icon, animateIcon, label } = getStyle();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium',
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
