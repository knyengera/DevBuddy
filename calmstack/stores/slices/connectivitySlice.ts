import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectivityState {
  isOnline: boolean;
  lastChecked: number | null;
}

const initialState: ConnectivityState = {
  isOnline: true,
  lastChecked: null,
};

const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      state.lastChecked = Date.now();
    },
  },
});

export const { setOnlineStatus } = connectivitySlice.actions;
export default connectivitySlice.reducer; 