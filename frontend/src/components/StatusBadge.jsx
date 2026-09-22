import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status, levelPercent }) {
  // Compute status from levelPercent if status not provided
  let currentStatus = status;
  if (!currentStatus && levelPercent !== undefined) {
    if (levelPercent >= 50) currentStatus = 'Healthy';
    else if (levelPercent >= 30) currentStatus = 'Watch';
    else if (levelPercent >= 15) currentStatus = 'Low';
    else currentStatus = 'Critical';
  }

  const getStyle = () => {
    switch (currentStatus?.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'available':
      case 'completed':
        return {
          bg: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
          icon: CheckCircle2,
          label: currentStatus || 'Healthy'
        };
      case 'watch':
      case 'warning':
      case 'ontrip':
      case 'reconnecting':
        return {
          bg: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
          icon: AlertTriangle,
          label: currentStatus || 'Watch'
        };
      case 'low':
      case 'critical':
      case 'offline':
      case 'maintenance':
      case 'disconnected':
        return {
          bg: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
          icon: ShieldAlert,
          label: currentStatus || 'Critical'
        };
      default:
        return {
          bg: 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30',
          icon: Info,
          label: currentStatus || 'Info'
        };
    }
  };

  const { bg, icon: Icon, label } = getStyle();

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full border flex items-center gap-1.5 font-medium ${bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
