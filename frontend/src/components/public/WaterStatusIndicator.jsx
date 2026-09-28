import { AlertTriangle, CheckCircle2, Droplets, Truck, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';

const STATUS = {
  Normal: {
    icon: CheckCircle2,
    label: 'Normal',
    description: 'Water supply currently available',
    className: 'text-brand-green-dark bg-surface-green border-brand-green/30',
    dot: 'bg-brand-green',
  },
  'Tankers Active': {
    icon: Truck,
    label: 'Tankers Active',
    description: 'Municipal tankers are delivering in this area',
    className: 'text-warning bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
  },
  Interruption: {
    icon: AlertTriangle,
    label: 'Interruption',
    description: 'Supply interruption reported',
    className: 'text-danger bg-red-50 border-red-200',
    dot: 'bg-danger',
  },
  Maintenance: {
    icon: Wrench,
    label: 'Maintenance',
    description: 'Planned maintenance in progress',
    className: 'text-warning bg-amber-50 border-amber-200',
    dot: 'bg-amber-500',
  },
  Critical: {
    icon: Droplets,
    label: 'Critical',
    description: 'Critical supply shortage',
    className: 'text-danger bg-red-50 border-red-200',
    dot: 'bg-danger',
  },
};

export function WaterStatusIndicator({ status = 'Normal', description, compact = false }) {
  const config = STATUS[status] || STATUS.Normal;
  const Icon = config.icon;
  const text = description || config.description;

  return (
    <div
      className={cn('inline-flex items-start gap-2 rounded-md border px-3 py-2', config.className)}
      role="status"
    >
      <span className={cn('mt-1 size-2.5 shrink-0 rounded-full', config.dot)} aria-hidden />
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="font-bold text-sm leading-tight">{config.label}</p>
        {!compact && <p className="text-xs mt-0.5 opacity-90">{text}</p>}
      </div>
    </div>
  );
}
