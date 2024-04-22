import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { SnackbarInterface, SLICE_NAME } from "~/redux/types/snackbar.types";
import { LightTheme } from "~/theme/";

const INITIAL_SNACKBAR_STATE: SnackbarInterface = {
  visible: false,
  text: "",
  textColor: LightTheme.colors.white,
  button: {},
  buttonColor: LightTheme.colors.accent,
  type: SnackbarVariations.SNACKBAR,
  backgroundColor: "black"
};

export const settingsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_SNACKBAR_STATE,
  reducers: {
    showSnackbar: (state, action: PayloadAction<SnackbarInterface>) => ({
      ...state,
      ...action.payload,
      visible: true
    }),
    hideSnackbar: state => ({
      ...state,
      visible: false
    })
  }
});

// Action creators are generated for each case reducer function
export const { showSnackbar, hideSnackbar } = settingsSlice.actions;

export default settingsSlice.reducer;
