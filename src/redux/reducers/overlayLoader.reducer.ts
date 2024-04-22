import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { OverlayLoaderBackground } from "~/components/common/OverlayLoader/OverlayLoader.types";
import { OverlayLoaderInterface, SLICE_NAME } from "~/redux/types/overlayLoader.types";

const INITIAL_OVERLAY_LOADER_STATE: OverlayLoaderInterface = {
  visible: false,
  title: "",
  description: "",
  mode: OverlayLoaderBackground.COLOR,
  backgroundColor: "rgba(200,200,200,0.7)"
};

export const settingsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_OVERLAY_LOADER_STATE,
  reducers: {
    showOverlay: (state, action: PayloadAction<OverlayLoaderInterface>) => ({
      ...state,
      ...action.payload,
      visible: true
    }),
    hideOverlay: state => ({
      ...state,
      visible: false
    })
  }
});

// Action creators are generated for each case reducer function
export const { showOverlay, hideOverlay } = settingsSlice.actions;

export default settingsSlice.reducer;
