import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { RootState } from '../../store/store';
import { setBaseCurrency } from '../../store/slices/cryptoSlice';

const currencies = [
  { code: 'usd', name: 'US Dollar', symbol: '$' },
  { code: 'eur', name: 'Euro', symbol: '€' },
  { code: 'gbp', name: 'British Pound', symbol: '£' },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
  { code: 'inr', name: 'Indian Rupee', symbol: '₹' },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'chf', name: 'Swiss Franc', symbol: 'CHF' },
];

export default function CurrencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const baseCurrency = useSelector((state: RootState) => state.crypto.baseCurrency);

  const selectedCurrency = currencies.find(curr => curr.code === baseCurrency) || currencies[0];

  const handleCurrencyChange = (currencyCode: string) => {
    dispatch(setBaseCurrency(currencyCode));
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="font-medium text-gray-700 truncate">
          {selectedCurrency.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full sm:w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                currency.code === baseCurrency
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{currency.code.toUpperCase()}</div>
                  <div className="text-sm text-gray-500">{currency.name}</div>
                </div>
                <span className="text-sm font-medium">{currency.symbol}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

