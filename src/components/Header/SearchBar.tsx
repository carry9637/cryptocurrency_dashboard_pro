import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X } from 'lucide-react';
import { RootState } from '../../store/store';
import { setSearchQuery, addSelectedCrypto } from '../../store/slices/cryptoSlice';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const dispatch = useDispatch();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { cryptocurrencies, searchQuery } = useSelector((state: RootState) => state.crypto);

  const filteredCryptos = cryptocurrencies.filter(crypto =>
    crypto.name.toLowerCase().includes(localQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(localQuery.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setLocalQuery(query);
    dispatch(setSearchQuery(query));
    setIsOpen(query.length > 0);
  };

  const handleSelectCrypto = (cryptoId: string) => {
    dispatch(addSelectedCrypto(cryptoId));
    setLocalQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(localQuery.length > 0)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filteredCryptos.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredCryptos.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => handleSelectCrypto(crypto.id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900">{crypto.name}</div>
                  <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                </div>
                <div className="ml-auto">
                  <div className="text-sm font-medium text-gray-900">
                    ${crypto.current_price.toLocaleString()}
                  </div>
                  <div className={`text-xs ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}