import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RootState } from '../../store/store';
import { addSelectedCrypto } from '../../store/slices/cryptoSlice';

export default function CryptoList() {
  const dispatch = useDispatch();
  const { cryptocurrencies, baseCurrency } = useSelector((state: RootState) => state.crypto);

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      usd: '$',
      eur: '€',
      gbp: '£',
      jpy: '¥',
      inr: '₹',
    };
    return symbols[currency] || currency.toUpperCase();
  };

  const handleCryptoClick = (cryptoId: string) => {
    dispatch(addSelectedCrypto(cryptoId));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Cryptocurrency by Market Cap</h2>
      </div>
      
      <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(150vh - 240px)' }}>
        {cryptocurrencies.slice(0, 23).map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => handleCryptoClick(crypto.id)}
            className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {crypto.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {crypto.symbol.toUpperCase()} • #{crypto.market_cap_rank}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {getCurrencySymbol(baseCurrency)}{crypto.current_price.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${
                  crypto.price_change_percentage_24h >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-left">
              Market Cap: {getCurrencySymbol(baseCurrency)}{crypto.market_cap.toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}