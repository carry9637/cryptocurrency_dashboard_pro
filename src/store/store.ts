import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './slices/cryptoSlice';
import portfolioReducer from './slices/portfolioSlice';
import exchangeReducer from './slices/exchangeSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    portfolio: portfolioReducer,
    exchange: exchangeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;