import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { RootState } from '../../store/store';
import {
  addSelectedCrypto,
  removeSelectedCrypto,
} from '../../store/slices/cryptoSlice';

export default function CryptocurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { cryptocurrencies, selectedCrypto } = useSelector(
    (state: RootState) => state.crypto
  );

  const handleToggleCrypto = (cryptoId: string) => {
    if (selectedCrypto.includes(cryptoId)) {
      dispatch(removeSelectedCrypto(cryptoId));
    } else {
      dispatch(addSelectedCrypto(cryptoId));
    }
  };

  const getSelectedCryptoNames = () => {
    const selected = cryptocurrencies.filter((crypto) =>
      selectedCrypto.includes(crypto.id)
    );
    if (selected.length === 0) return 'Select cryptocurrencies';
    if (selected.length === 1) return selected[0].name;
    return `${selected.length} selected`;
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 truncate">
          {getSelectedCryptoNames()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transform transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-full sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Select Cryptocurrencies
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose currencies to display on chart
            </p>
          </div>

          {cryptocurrencies.slice(0, 20).map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleToggleCrypto(crypto.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedCrypto.includes(crypto.id)}
                  onChange={() => handleToggleCrypto(crypto.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {crypto.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {crypto.symbol.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
