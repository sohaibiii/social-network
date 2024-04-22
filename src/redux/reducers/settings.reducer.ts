import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SettingsInterface, SLICE_NAME } from "~/redux/types/settings.types";

const INITIAL_SETTINGS_STATE: SettingsInterface = {
  isThemeDark: false,
  language: "ar"
};

export const settingsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_SETTINGS_STATE,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsInterface>) => {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
