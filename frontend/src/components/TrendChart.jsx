import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingDown, Calendar, Info } from 'lucide-react';
import { Card } from './ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function TrendChart({ damName = 'Newton Reservoir', currentLevel = 62.5 }) {
  const [timeframe, setTimeframe] = useState('7d');

  const getChartData = () => {
    let labels = [];
    let dataPoints = [];

    if (timeframe === '7d') {
      labels = ['18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep'];
      dataPoints = [68.2, 67.5, 66.0, 65.2, 64.0, 63.1, currentLevel];
    } else if (timeframe === '30d') {
      labels = ['26 Aug', '31 Aug', '5 Sep', '10 Sep', '15 Sep', '20 Sep', '24 Sep'];
      dataPoints = [74.5, 72.8, 71.0, 69.2, 67.0, 64.8, currentLevel];
    } else {
      labels = ['Jun', 'Jul', 'Aug (Early)', 'Aug (Late)', 'Sep (Early)', 'Sep (Mid)', '24 Sep'];
      dataPoints = [85.0, 81.2, 78.4, 73.1, 69.0, 65.5, currentLevel];
    }

    return {
      labels,
      datasets: [
        {
          label: `${damName} Level (%)`,
          data: dataPoints,
          borderColor: '#0E4C8C',
          backgroundColor: 'rgba(14, 76, 140, 0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: '#2991C8',
          pointBorderColor: '#FFFFFF',
          pointHoverRadius: 6,
          pointRadius: 4,
          tension: 0.35,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0A2A4F',
        bodyColor: '#0E4C8C',
        borderColor: '#D4E4EF',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `Water Level: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#EAF6FC',
        },
        ticks: {
          color: '#4D6278',
          font: { size: 11, family: 'Inter' },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#EAF6FC',
        },
        ticks: {
          color: '#4D6278',
          font: { size: 11, family: 'Inter' },
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <Card className="p-5">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-base text-brand-navy flex items-center gap-2">
            <span>Historical Storage Trend</span>
            <span className="text-xs font-normal text-muted">({damName})</span>
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Reservoir replenishment and outflow tracking in Kimberley
          </p>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center bg-surface-blue p-1 rounded-lg border border-brand-accent/20 self-start sm:self-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                timeframe === item.id
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-muted hover:text-brand-navy'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line Chart Canvas */}
      <div className="h-64 w-full">
        <Line data={getChartData()} options={chartOptions} />
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
          <TrendingDown className="w-4 h-4 text-amber-600" />
          <span>Storage down ~5.7% over 7 days</span>
        </div>
        <span className="text-[11px] text-muted">Source: Sol Plaatje Municipal Water Division</span>
      </div>
    </Card>
  );
}

export default TrendChart;
