import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { RootState, AppDispatch } from '../../store/store';
import { fetchChartData } from '../../store/slices/cryptoSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart() {
  const dispatch = useDispatch<AppDispatch>();
  const { chartType, selectedCrypto, baseCurrency, cryptocurrencies } = useSelector(
    (state: RootState) => state.crypto
  );

  const chartRef = useRef<ChartJS<'line', number[], string>>(null);
  const [days, setDays] = useState(7);

  const limitedDays = days > 30 ? 30 : days;
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, { labels: string[]; prices: number[] }>>({});

  useEffect(() => {
    if (selectedCrypto.length > 0) {
      const cacheKey = `${selectedCrypto[0]}-${baseCurrency}-${limitedDays}`;
      if (cache[cacheKey]) {
        setLoading(false);
      } else {
        setLoading(true);
        dispatch(fetchChartData({ 
          cryptoId: selectedCrypto[0], 
          currency: baseCurrency, 
          days: limitedDays 
        })).unwrap().then((chartData) => {
          setCache(prevCache => ({ ...prevCache, [cacheKey]: chartData }));
          setLoading(false);
        }).catch((error) => {
          console.error('Error fetching chart data:', error);
          setLoading(false);
        });
      }
    }
  }, [dispatch, selectedCrypto, baseCurrency, limitedDays]);

  const cacheKey = `${selectedCrypto[0]}-${baseCurrency}-${days}`;
  const chartDataCached = cache[cacheKey];

  if (loading || !chartDataCached || !chartDataCached.labels || !chartDataCached.prices || chartDataCached.labels.length === 0 || chartDataCached.prices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedCryptoData = cryptocurrencies.filter(crypto => 
    selectedCrypto.includes(crypto.id)
  );

  const colors = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#F59E0B'];

  const data = {
    labels: chartDataCached.labels,
    datasets: selectedCryptoData.map((crypto, index) => ({
      label: crypto.name,
      data: chartDataCached.prices,
      borderColor: colors[index % colors.length],
      backgroundColor: chartType === 'bar' 
        ? colors[index % colors.length] + '20'
        : colors[index % colors.length] + '10',
      borderWidth: 2,
      fill: chartType === 'line',
      tension: 0.4,
    })),
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const currencySymbol = baseCurrency === 'usd' ? '$' : baseCurrency.toUpperCase();
            return `${context.dataset.label}: ${currencySymbol}${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            const currencySymbol = baseCurrency === 'usd' ? '$' : baseCurrency.toUpperCase();
            return `${currencySymbol}${Number(value).toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Price Chart</h2>
        <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-500 overflow-x-auto">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md transition-colors whitespace-nowrap ${
                days === d ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'hover:bg-gray-100'
              }`}
              title={`Show data for last ${d} days`}
            >
              {d === 365 ? '1Y' : `${d}D`}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full min-w-0 h-56 sm:h-72">
        <ChartComponent ref={chartRef as any} data={data} options={options} />
      </div>
    </div>
  );
}
