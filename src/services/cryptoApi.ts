import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with rate limiting
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchCryptocurrencies = async (currency: string = 'usd') => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }
};

export const fetchCryptocurrencyChart = async (coinId: string, currency: string = 'usd', days: number = 7) => {
  try {
    // Limit days to max 30 to avoid empty data from API
    const limitedDays = days > 30 ? 30 : days;
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days: limitedDays,
        interval: limitedDays <= 1 ? 'hourly' : 'daily',
      },
    });
    
    const prices = response.data.prices;
    const labels = prices.map((price: [number, number]) => {
      const date = new Date(price[0]);
      return limitedDays <= 1 
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    return {
      labels,
      prices: prices.map((price: [number, number]) => price[1]),
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const fetchExchangeRates = async (baseCurrency: string = 'usd') => {
  try {
    const response = await api.get('/exchange_rates');
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {};
  }
};

export const searchCryptocurrencies = async (query: string) => {
  try {
    const response = await api.get('/search', {
      params: { query },
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    return [];
  }
};

export const fetchGlobalMarketData = async () => {
  try {
    const response = await api.get('/global');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};