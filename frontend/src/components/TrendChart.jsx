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
import { TrendingDown } from 'lucide-react';

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
          borderColor: '#152e52',
          backgroundColor: 'rgba(29, 112, 184, 0.08)',
          borderWidth: 2,
          pointBackgroundColor: '#1d70b8',
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
        titleColor: '#152e52',
        bodyColor: '#1d70b8',
        borderColor: '#e2e8f0',
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
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter' },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter' },
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#152e52] flex items-center gap-2">
            <span>Historical Storage Trend</span>
            <span className="text-xs font-normal text-slate-500 font-sans">({damName})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reservoir replenishment and outflow tracking in Kimberley
          </p>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 self-start sm:self-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                timeframe === item.id
                  ? 'bg-[#152e52] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#152e52]'
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
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-amber-700 font-medium">
          <TrendingDown className="w-4 h-4 text-amber-600" />
          <span>Storage down ~5.7% over 7 days</span>
        </div>
        <span className="text-[11px] text-slate-400">Source: Sol Plaatje Municipal Water Division</span>
      </div>
    </div>
  );
}

export default TrendChart;
