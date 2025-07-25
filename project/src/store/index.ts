import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dataReducer from './dataSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'data/setCurrentFile', 
          'data/addFile',
          'data/uploadFile/fulfilled',
          'data/fetchFile/fulfilled',
          'data/fetchFiles/fulfilled',
          'data/createChart/fulfilled',
          'data/fetchCharts/fulfilled',
          'data/createInsight/fulfilled',
          'data/fetchInsights/fulfilled'
        ],
        ignoredPaths: ['data.files', 'data.currentFile', 'data.charts', 'data.insights'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;