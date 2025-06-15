import React from 'react';
import { BarChart3 } from 'lucide-react';
import CurrencyDropdown from './CurrencyDropdown';
import SearchBar from './SearchBar';
import ChartTypeSelector from './ChartTypeSelector';
import CryptocurrencySelector from './CryptocurrencySelector';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">CryptoTracker Pro</h1>
          </div>
          <CurrencyDropdown />
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar />
          <CryptocurrencySelector />
          <ChartTypeSelector />
        </div>
      </div>
    </header>
  );
}