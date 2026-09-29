import React, { useState } from 'react';
import DamPanel from '../../components/DamPanel';
import TrendChart from '../../components/TrendChart';
import StatCard from '../../components/StatCard';
import { Droplet, HardDrive, ShieldAlert } from 'lucide-react';

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
      lastUpdated: 'Today at 08:30 (CAT)',
    },
    {
      id: 2,
      name: 'Riverton Water Works',
      areaName: 'Vaal River Extraction Plant',
      capacityMegaLitres: 150.0,
      volumeMegaLitres: 123.0,
      latestLevel: 82.0,
      lastUpdated: 'Today at 07:15 (CAT)',
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
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#152e52]">
          Municipal Dam Level Monitoring
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">
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
          accentColor="#1d70b8"
        />
        <StatCard
          title="Monitored Reservoirs"
          value="2 Active"
          subtitle="Newton & Riverton Systems"
          icon={HardDrive}
          accentColor="#2e7d32"
        />
        <StatCard
          title="Municipal Supply Alert"
          value="Healthy"
          subtitle="Above 50% safety buffer"
          icon={ShieldAlert}
          accentColor="#2e7d32"
        />
      </div>

      {/* Dam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dams.map((dam) => (
          <div
            key={dam.id}
            onClick={() => setSelectedDam(dam)}
            className={`cursor-pointer rounded-lg transition-all ${
              selectedDam.id === dam.id
                ? 'ring-2 ring-[#1d70b8] shadow-sm'
                : 'opacity-90 hover:opacity-100'
            }`}
          >
            <DamPanel dam={dam} onSelect={() => setSelectedDam(dam)} />
          </div>
        ))}
      </div>

      {/* Historical Trend Chart */}
      <TrendChart
        damName={selectedDam.name}
        currentLevel={selectedDam.latestLevel}
      />
    </div>
  );
}

export default DamsPage;
