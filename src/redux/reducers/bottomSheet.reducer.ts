import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IBottomSheet, SLICE_NAME } from "~/redux/types/bottomSheet.types";

const INITIAL_BOTTOM_SHEET_LOADER_STATE: IBottomSheet = {
  Content: undefined,
  props: {},
  customProps: {}
};

export const settingsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_BOTTOM_SHEET_LOADER_STATE,
  reducers: {
    showBottomSheet: (state, action: PayloadAction<IBottomSheet>) => ({
      ...state,
      ...action.payload
    }),
    clearBottomSheet: (state, action: PayloadAction<IBottomSheet>) => ({
      ...state,
      ...INITIAL_BOTTOM_SHEET_LOADER_STATE
    })
  }
});

// Action creators are generated for each case reducer function
export const { showBottomSheet, clearBottomSheet } = settingsSlice.actions;

export default settingsSlice.reducer;
