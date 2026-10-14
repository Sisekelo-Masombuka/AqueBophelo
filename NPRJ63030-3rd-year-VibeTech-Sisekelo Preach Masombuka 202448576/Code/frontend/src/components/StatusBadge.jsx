import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const KNOWN_LABELS = {
  OnTrip: 'On trip',
  ontrip: 'On trip',
  'ON TRIP': 'On trip',
  ONTRIP: 'On trip',
  InProgress: 'In progress',
  in_progress: 'In progress',
  IN_PROGRESS: 'In progress',
  In_Progress: 'In progress',
  'In Progress': 'In progress',
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
  'In Maintenance': 'In maintenance',
};

export function getStatusLabel(value) {
  if (!value && value !== 0) return '';
  const strVal = String(value).trim();
  if (KNOWN_LABELS[strVal]) return KNOWN_LABELS[strVal];

  // Unknown values: replace underscores with spaces, sentence case
  const formatted = strVal.replace(/_/g, ' ').trim();
  if (!formatted) return '';
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}

export function StatusBadge({ status, levelPercent, className }) {
  let currentStatus = status;
  if (!currentStatus && levelPercent !== undefined) {
    if (levelPercent >= 60) currentStatus = 'Healthy';
    else if (levelPercent >= 30) currentStatus = 'Watch';
    else if (levelPercent >= 15) currentStatus = 'Low';
    else currentStatus = 'Critical';
  }

  const label = getStatusLabel(currentStatus) || 'Information';

  const getStyle = () => {
    const s = String(currentStatus || '').toLowerCase();
    if (['healthy', 'online', 'available', 'completed', 'active'].includes(s)) {
      return {
        classes: 'bg-success-bg text-success border border-success-border',
      };
    }
    if (['watch', 'warning', 'ontrip', 'in transit', 'en route', 'on trip'].includes(s)) {
      return {
        classes: 'bg-amber-50 text-amber-800 border border-amber-200',
      };
    }
    if (['low', 'critical', 'offline', 'maintenance', 'in_maintenance', 'in maintenance', 'disconnected', 'inactive'].includes(s)) {
      return {
        classes: 'bg-red-50 text-red-700 border border-red-200',
      };
    }
    if (['connecting', 'reconnecting', 'syncing', 'dispatched', 'pending', 'in_progress', 'inprogress', 'in progress'].includes(s)) {
      return {
        classes: 'bg-info-bg text-blue border border-info-border',
        icon: ['connecting', 'reconnecting', 'syncing'].includes(s) ? RefreshCw : null,
        animateIcon: ['connecting', 'reconnecting', 'syncing'].includes(s),
      };
    }
    return {
      classes: 'bg-slate-100 text-slate-700 border border-slate-200',
    };
  };

  const { classes, icon: Icon, animateIcon } = getStyle();

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
