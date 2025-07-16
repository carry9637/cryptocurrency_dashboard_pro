import React from 'react';
import { BarChart3 } from 'lucide-react';
import CurrencyDropdown from './CurrencyDropdown';
import SearchBar from './SearchBar';
import ChartTypeSelector from './ChartTypeSelector';
import CryptocurrencySelector from './CryptocurrencySelector';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Left Side: Logo + Currency */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">CryptoTracker Pro</h1>
          </div>
          <CurrencyDropdown />
        </div>

        {/* Right Side: Inputs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center sm:justify-end">
          <SearchBar />
          <CryptocurrencySelector />
          <ChartTypeSelector />
        </div>
      </div>
    </header>
  );
}
