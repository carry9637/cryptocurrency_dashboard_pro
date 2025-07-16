import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RootState } from '../../store/store';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart() {
  const { items, totalValue } = useSelector((state: RootState) => state.portfolio);

  const data = {
    labels: items.map(item => item.name),
    datasets: [
      {
        data: items.map(item => item.value),
        backgroundColor: items.map(item => item.color),
        borderColor: items.map(item => item.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const percentage = ((context.parsed / totalValue) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Portfolio</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Value</div>
        </div>
      </div>

      <div className="relative w-full min-w-0 h-36 sm:h-44 mb-6">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Portfolio</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const percentage = ((item.value / totalValue) * 100).toFixed(1);
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <div className="font-medium text-gray-900">{item.symbol}</div>
                  <div className="text-sm text-gray-500">{item.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  ${item.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
