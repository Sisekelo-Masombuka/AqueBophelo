import React from 'react';
import { Droplet, Truck, AlertTriangle, MapPin, CheckCircle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export function ResidentDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
          Sol Plaatje Water Overview
        </h2>
        <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
          Real-time municipal reservoir storage and tanker distribution in Kimberley, Northern Cape.
        </p>
      </div>

      {/* Top Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Dam Reserve"
          value="72.3%"
          subtitle="Newton & Riverton Combined"
          icon={Droplet}
          accentColor="#22D3EE"
        />
        <StatCard
          title="Active Water Trucks"
          value="3 Online"
          subtitle="Galeshewe & Roodepan"
          icon={Truck}
          accentColor="#22C55E"
        />
        <StatCard
          title="Current Alert Status"
          value="Normal"
          subtitle="No supply shut-offs today"
          icon={AlertTriangle}
          accentColor="#F59E0B"
        />
        <StatCard
          title="Your Area"
          value="Galeshewe"
          subtitle="Zone 3 delivery scheduled"
          icon={MapPin}
          accentColor="#22D3EE"
        />
      </div>

      {/* Quick Status Notice */}
      <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] mt-0.5">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#E6EDF7]">
              Day 1 Foundation Scaffolded
            </h3>
            <p className="text-xs text-[#8A9BB8] mt-1">
              Responsive drawer navigation, design system tokens, and React Router structure are ready.
            </p>
          </div>
        </div>
        <StatusBadge status="Healthy" />
      </div>
    </div>
  );
}

export default ResidentDashboard;
