import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { fetchCryptoData } from './store/slices/cryptoSlice';
import Header from './components/Header/Header';
import MarketPriceChart from './components/Chart/MarketPriceChart';
import PortfolioChart from './components/Portfolio/PortfolioChart';
import ExchangeCalculator from './components/Exchange/ExchangeCalculator';
import CryptoList from './components/Sidebar/CryptoList';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { baseCurrency, loading } = useSelector((state: RootState) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoData(baseCurrency));
  }, [dispatch, baseCurrency]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCryptoData(baseCurrency));
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, baseCurrency]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Price Chart */}
            <MarketPriceChart />
            
            {/* Portfolio and Exchange Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PortfolioChart />
              <ExchangeCalculator />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CryptoList />
          </div>
        </div>
      </main>
    </div>
  );
}