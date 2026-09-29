import React from 'react';
import { Wifi, WifiOff, RefreshCw, Radio } from 'lucide-react';

export function ConnectionStatusBadge({ status = 'Connected', lastTime }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Connected':
        return {
          bg: 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]',
          dot: 'bg-[#22C55E] animate-pulse',
          icon: Wifi,
          label: 'SignalR Live',
        };
      case 'Demo':
        return {
          bg: 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]',
          dot: 'bg-[#22D3EE] animate-pulse',
          icon: Radio,
          label: 'Live Telemetry',
        };
      case 'Reconnecting':
      case 'Connecting':
        return {
          bg: 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]',
          dot: 'bg-[#F59E0B]',
          icon: RefreshCw,
          label: 'Reconnecting...',
          spin: true,
        };
      case 'Disconnected':
      default:
        return {
          bg: 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]',
          dot: 'bg-[#EF4444]',
          icon: WifiOff,
          label: 'Offline (Retrying)',
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
        <span className="hidden lg:inline text-[10px] opacity-75 border-l border-current pl-1.5 ml-1">
          {lastTime}
        </span>
      )}
    </div>
  );
}

export default ConnectionStatusBadge;
