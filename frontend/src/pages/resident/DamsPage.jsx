import React, { useState } from 'react';
import DamPanel from '../../components/DamPanel';
import TrendChart from '../../components/TrendChart';
import StatCard from '../../components/StatCard';
import { Droplet, HardDrive, ShieldAlert, Info } from 'lucide-react';

export function DamsPage() {
  // Initial seeded dams matching backend DbSeeder.cs
  const [dams] = useState([
    {
      id: 1,
      name: 'Newton Reservoir',
      areaName: 'Kimberley Central / Sol Plaatje',
      capacityMegaLitres: 92.5,
      volumeMegaLitres: 57.8,
      latestLevel: 62.5,
      lastUpdated: 'Today at 08:30 (SAST)',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      areaName: 'Vaal River Extraction Plant',
      capacityMegaLitres: 150.0,
      volumeMegaLitres: 123.0,
      latestLevel: 82.0,
      lastUpdated: 'Today at 07:15 (SAST)',
    },
  ]);

  const [selectedDam, setSelectedDam] = useState(dams[0]);

  // Combined statistics
  const totalCapacity = dams.reduce((acc, d) => acc + d.capacityMegaLitres, 0);
  const totalVolume = dams.reduce((acc, d) => acc + d.volumeMegaLitres, 0);
  const overallPercentage = ((totalVolume / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6EDF7]">
          Municipal Dam Level Monitoring
        </h2>
        <p className="text-xs md:text-sm text-[#8A9BB8] mt-1">
          Official reservoir volume readings and historical consumption trends for Kimberley.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Combined Municipal Reserve"
          value={`${overallPercentage}%`}
          subtitle={`${totalVolume.toFixed(1)} ML of ${totalCapacity.toFixed(1)} ML`}
          icon={Droplet}
          accentColor="#22D3EE"
        />
        <StatCard
          title="Monitored Reservoirs"
          value="2 Active"
          subtitle="Newton & Riverton Systems"
          icon={HardDrive}
          accentColor="#22C55E"
        />
        <StatCard
          title="Municipal Supply Alert"
          value="Healthy"
          subtitle="Above 50% safety buffer"
          icon={ShieldAlert}
          accentColor="#22C55E"
        />
      </div>

      {/* Dam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dams.map((dam) => (
          <div
            key={dam.id}
            onClick={() => setSelectedDam(dam)}
            className={`cursor-pointer rounded-xl transition-all ${
              selectedDam.id === dam.id
                ? 'ring-2 ring-[#22D3EE] shadow-lg shadow-[#22D3EE]/10'
                : 'opacity-90 hover:opacity-100'
            }`}
          >
            <DamPanel dam={dam} onSelect={() => setSelectedDam(dam)} />
          </div>
        ))}
      </div>

      {/* Historical Trend Chart (Chart.js with 7d / 30d / 90d filters) */}
      <TrendChart
        damName={selectedDam.name}
        currentLevel={selectedDam.latestLevel}
      />
    </div>
  );
}

export default DamsPage;
