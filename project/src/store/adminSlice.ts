import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, User } from '../types';

const initialState: AdminState = {
  users: [],
  totalUploads: 0,
  totalCharts: 0,
  storageUsed: 0,
  loading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setStats: (state, action: PayloadAction<{
      totalUploads: number;
      totalCharts: number;
      storageUsed: number;
    }>) => {
      state.totalUploads = action.payload.totalUploads;
      state.totalCharts = action.payload.totalCharts;
      state.storageUsed = action.payload.storageUsed;
    },
  },
});

export const { setLoading, setUsers, deleteUser, setStats } = adminSlice.actions;
export default adminSlice.reducer;