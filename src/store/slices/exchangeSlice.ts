import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExchangeState {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  exchangeType: 'crypto-to-crypto' | 'crypto-to-fiat' | 'fiat-to-crypto';
  error: string | null;
}

const initialState: ExchangeState = {
  fromCurrency: 'bitcoin',
  toCurrency: 'ethereum',
  fromAmount: '1',
  toAmount: '0',
  exchangeType: 'crypto-to-crypto',
  error: null,
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setFromCurrency: (state, action: PayloadAction<string>) => {
      state.fromCurrency = action.payload;
    },
    setToCurrency: (state, action: PayloadAction<string>) => {
      state.toCurrency = action.payload;
    },
    setFromAmount: (state, action: PayloadAction<string>) => {
      const amount = action.payload;
      if (amount === '' || /^\d*\.?\d*$/.test(amount)) {
        state.fromAmount = amount;
        state.error = null;
      } else {
        state.error = 'Please enter a valid number';
      }
    },
    setToAmount: (state, action: PayloadAction<string>) => {
      state.toAmount = action.payload;
    },
    setExchangeType: (state, action: PayloadAction<'crypto-to-crypto' | 'crypto-to-fiat' | 'fiat-to-crypto'>) => {
      state.exchangeType = action.payload;
    },
    swapCurrencies: (state) => {
      const tempCurrency = state.fromCurrency;
      const tempAmount = state.fromAmount;
      state.fromCurrency = state.toCurrency;
      state.toCurrency = tempCurrency;
      state.fromAmount = state.toAmount;
      state.toAmount = '0'; // reset toAmount after swap to avoid stale value
    },
  },
});

export const {
  setFromCurrency,
  setToCurrency,
  setFromAmount,
  setToAmount,
  setExchangeType,
  swapCurrencies,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;