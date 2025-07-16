import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpDown, AlertCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import {
  setFromCurrency,
  setToCurrency,
  setFromAmount,
  setToAmount,
  swapCurrencies,
} from '../../store/slices/exchangeSlice';

export default function ExchangeCalculator() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    fromCurrency, 
    toCurrency, 
    fromAmount, 
    toAmount, 
    error 
  } = useSelector((state: RootState) => state.exchange);
  
  const { cryptocurrencies } = useSelector((state: RootState) => state.crypto);

  const calculateExchange = () => {
    const fromCrypto = cryptocurrencies.find(crypto => crypto.id === fromCurrency);
    const toCrypto = cryptocurrencies.find(crypto => crypto.id === toCurrency);
    
    if (fromCrypto && toCrypto && fromAmount) {
      const fromValue = parseFloat(fromAmount) * fromCrypto.current_price;
      const toValue = fromValue / toCrypto.current_price;
      dispatch(setToAmount(toValue.toFixed(8)));
    }
  };

  useEffect(() => {
    calculateExchange();
  }, [fromCurrency, toCurrency, fromAmount, cryptocurrencies]);

  const handleSwap = () => {
    dispatch(swapCurrencies());
  };

  const topCryptos = cryptocurrencies.slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-hidden">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">Exchange Calculator</h2>

      <div className="space-y-6">
        {/* From Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sell</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => dispatch(setFromAmount(e.target.value))}
                placeholder="0.00000"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {error && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
            <select
              value={fromCurrency}
              onChange={(e) => dispatch(setFromCurrency(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[100px]"
            >
              {topCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* To Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buy</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
              />
            </div>
            <select
              value={toCurrency}
              onChange={(e) => dispatch(setToCurrency(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[100px]"
            >
              {topCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Button */}
        <button
          onClick={() => alert(`Exchanged ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency}`)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
        >
          Exchange
        </button>

        {/* Exchange Rate Info */}
        {fromAmount && toAmount && (
          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            1 {cryptocurrencies.find(c => c.id === fromCurrency)?.symbol.toUpperCase()} = {' '}
            {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(8)} {' '}
            {cryptocurrencies.find(c => c.id === toCurrency)?.symbol.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
