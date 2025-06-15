import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  color: string;
}

interface PortfolioState {
  items: PortfolioItem[];
  totalValue: number;
}

const initialState: PortfolioState = {
  items: [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 25000, color: '#F97316' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 2.5, value: 8750, color: '#3B82F6' },
    { id: 'tether', name: 'Tether', symbol: 'USDT', amount: 5000, value: 5000, color: '#14B8A6' },
  ],
  totalValue: 38750,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addPortfolioItem: (state, action: PayloadAction<PortfolioItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.amount += action.payload.amount;
        existingItem.value += action.payload.value;
      } else {
        state.items.push(action.payload);
      }
      state.totalValue = state.items.reduce((total, item) => total + item.value, 0);
    },
    removePortfolioItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalValue = state.items.reduce((total, item) => total + item.value, 0);
    },
    updatePortfolioItem: (state, action: PayloadAction<{ id: string; amount: number; value: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.amount = action.payload.amount;
        item.value = action.payload.value;
      }
      state.totalValue = state.items.reduce((total, item) => total + item.value, 0);
    },
  },
});

export const { addPortfolioItem, removePortfolioItem, updatePortfolioItem } = portfolioSlice.actions;
export default portfolioSlice.reducer;