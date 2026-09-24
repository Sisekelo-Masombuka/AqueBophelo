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

  // Generate realistic data series based on timeframe for Kimberley reservoirs
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
          borderColor: '#22D3EE',
          backgroundColor: 'rgba(34, 211, 238, 0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: '#22D3EE',
          pointBorderColor: '#0B1220',
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
        backgroundColor: '#111B2E',
        titleColor: '#E6EDF7',
        bodyColor: '#22D3EE',
        borderColor: '#1F2C45',
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
          color: 'rgba(31, 44, 69, 0.4)',
        },
        ticks: {
          color: '#8A9BB8',
          font: { size: 11 },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(31, 44, 69, 0.4)',
        },
        ticks: {
          color: '#8A9BB8',
          font: { size: 11 },
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="bg-[#111B2E] border border-[#1F2C45] rounded-xl p-5 shadow-md">
      {/* Header and Timeframe Filter Pills (HCI Heuristic #3: User Control & Freedom) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-base text-[#E6EDF7] flex items-center gap-2">
            <span>Historical Storage Trend</span>
            <span className="text-xs font-normal text-[#8A9BB8]">({damName})</span>
          </h3>
          <p className="text-xs text-[#8A9BB8] mt-0.5">
            Reservoir replenishment and outflow tracking in Kimberley
          </p>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex items-center bg-[#0B1220] p-1 rounded-lg border border-[#1F2C45] self-start sm:self-auto">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === item.id
                  ? 'bg-[#22D3EE] text-[#0B1220] shadow-xs'
                  : 'text-[#8A9BB8] hover:text-[#E6EDF7]'
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
      <div className="mt-4 pt-3 border-t border-[#1F2C45] flex items-center justify-between text-xs text-[#8A9BB8]">
        <div className="flex items-center gap-1.5 text-[#F59E0B]">
          <TrendingDown className="w-4 h-4" />
          <span>Storage down ~5.7% over 7 days</span>
        </div>
        <span className="text-[11px] text-[#8A9BB8]">Source: Sol Plaatje Municipal Water Division</span>
      </div>
    </div>
  );
}

export default TrendChart;
