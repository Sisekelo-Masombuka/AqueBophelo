import React from 'react';
import { Wifi, WifiOff, RefreshCw, Radio } from 'lucide-react';

export function ConnectionStatusBadge({ status = 'Connected', lastTime }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Connected':
        return {
          bg: 'bg-success-bg border-success-border text-success',
          dot: 'bg-success animate-pulse',
          icon: Wifi,
          label: 'SignalR live',
        };
      case 'Demo':
        return {
          bg: 'bg-info-bg border-info-border text-blue',
          dot: 'bg-blue animate-pulse',
          icon: Radio,
          label: 'Live telemetry',
        };
      case 'Reconnecting':
      case 'Connecting':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          icon: RefreshCw,
          label: 'Reconnecting...',
          spin: true,
        };
      case 'Disconnected':
      default:
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          dot: 'bg-red-500',
          icon: WifiOff,
          label: 'Offline (retrying)',
        };
    }
  };

  const { bg, dot, icon: Icon, label, spin } = getBadgeConfig();

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium transition-all ${bg}`}
      title={lastTime ? `Last stream update: ${lastTime} CAT` : 'Real-time telemetry stream'}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <Icon className={`w-3.5 h-3.5 ${spin ? 'animate-spin' : ''}`} />
      <span>{label}</span>
      {lastTime && (
        <span className="hidden lg:inline text-xs opacity-75 border-l border-current pl-1.5 ml-1">
          {lastTime}
        </span>
      )}
    </div>
  );
}

export default ConnectionStatusBadge;
