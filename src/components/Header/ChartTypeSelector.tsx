import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart3, TrendingUp, ChevronDown } from 'lucide-react';
import { RootState } from '../../store/store';
import { setChartType } from '../../store/slices/cryptoSlice';

const chartTypes = [
  { type: 'line' as const, name: 'Line Chart', icon: TrendingUp },
  { type: 'bar' as const, name: 'Bar Chart', icon: BarChart3 },
];

export default function ChartTypeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const chartType = useSelector((state: RootState) => state.crypto.chartType);

  const selectedType = chartTypes.find((type) => type.type === chartType) || chartTypes[0];

  const handleTypeChange = (type: 'line' | 'bar') => {
    dispatch(setChartType(type));
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <selectedType.icon className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">Chart type</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {chartTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => handleTypeChange(type.type)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center space-x-2 ${
                type.type === chartType ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span className="text-sm">{type.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
