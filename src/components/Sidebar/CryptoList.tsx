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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Cryptocurrency by Market Cap
        </h2>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
        {cryptocurrencies.slice(0, 23).map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => handleCryptoClick(crypto.id)}
            className="w-full p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: Image + Name */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 text-sm sm:text-base truncate">
                    {crypto.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    {crypto.symbol.toUpperCase()} • #{crypto.market_cap_rank}
                  </div>
                </div>
              </div>

              {/* Right: Price + Change */}
              <div className="text-right flex-shrink-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base whitespace-nowrap">
                  {getCurrencySymbol(baseCurrency)}{crypto.current_price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end text-xs sm:text-sm ${
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
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

            {/* Market Cap */}
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 truncate">
              Market Cap: {getCurrencySymbol(baseCurrency)}{crypto.market_cap.toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
