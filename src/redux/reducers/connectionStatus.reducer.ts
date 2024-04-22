import { createSlice } from "@reduxjs/toolkit";

import {
  ConnectionStatusInterface,
  SLICE_NAME
} from "~/redux/types/connectionStatus.types";

const INITIAL_CONNECTION_STATUS_STATE: ConnectionStatusInterface = {
  isConnected: true,
  isVisible: false
};

export const connectionStatusSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_CONNECTION_STATUS_STATE,
  reducers: {
    setIsConnected: (state, action) => ({ ...state, isConnected: action.payload }),
    showConnectionStatus: state => ({
      ...state,
      isVisible: true
    }),
    hideConnectionStatus: state => ({
      ...state,
      isVisible: false
    })
  }
});

export const { setIsConnected, showConnectionStatus, hideConnectionStatus } =
  connectionStatusSlice.actions;

export default connectionStatusSlice.reducer;
