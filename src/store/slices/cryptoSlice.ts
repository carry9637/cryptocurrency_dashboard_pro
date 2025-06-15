import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCryptocurrencies, fetchCryptocurrencyChart, fetchExchangeRates } from '../../services/cryptoApi';

export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  total_volume: number;
}

export interface ChartData {
  labels: string[];
  prices: number[];
}

interface CryptoState {
  cryptocurrencies: Cryptocurrency[];
  selectedCrypto: string[];
  chartData: ChartData | null;
  chartType: 'line' | 'bar';
  baseCurrency: string;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  exchangeRates: Record<string, number>;
}

const initialState: CryptoState = {
  cryptocurrencies: [],
  selectedCrypto: ['bitcoin'],
  chartData: null,
  chartType: 'line',
  baseCurrency: 'usd',
  loading: false,
  error: null,
  searchQuery: '',
  exchangeRates: {},
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (currency: string) => {
    const response = await fetchCryptocurrencies(currency);
    return response;
  }
);

export const fetchChartData = createAsyncThunk(
  'crypto/fetchChartData',
  async ({ cryptoId, currency, days }: { cryptoId: string; currency: string; days: number }) => {
    const response = await fetchCryptocurrencyChart(cryptoId, currency, days);
    return response;
  }
);

export const fetchRates = createAsyncThunk(
  'crypto/fetchRates',
  async (currency: string) => {
    const response = await fetchExchangeRates(currency);
    return response;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrency = action.payload;
    },
    setChartType: (state, action: PayloadAction<'line' | 'bar'>) => {
      state.chartType = action.payload;
    },
    setSelectedCrypto: (state, action: PayloadAction<string[]>) => {
      state.selectedCrypto = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addSelectedCrypto: (state, action: PayloadAction<string>) => {
      if (!state.selectedCrypto.includes(action.payload)) {
        state.selectedCrypto.push(action.payload);
      }
    },
    removeSelectedCrypto: (state, action: PayloadAction<string>) => {
      state.selectedCrypto = state.selectedCrypto.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptocurrencies = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cryptocurrency data';
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.chartData = action.payload;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload;
      });
  },
});

export const {
  setBaseCurrency,
  setChartType,
  setSelectedCrypto,
  setSearchQuery,
  addSelectedCrypto,
  removeSelectedCrypto,
} = cryptoSlice.actions;

export default cryptoSlice.reducer;