import { createSlice } from "@reduxjs/toolkit";

import {
  SurroundingLandmarks,
  SLICE_NAME
} from "~/redux/types/surroundingLandmarks.types";

const INITIAL_TRIPS_GUARD_STATE: SurroundingLandmarks = {
  data: [],
  location: null
};

export const surroundingLandmarks = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_TRIPS_GUARD_STATE,
  reducers: {
    setSurroundingLandmarkData(state, { payload }) {
      state.data = payload.data;
      state.location = payload.location;
    },
    clearSurroundingLandmarkData(state, { payload }) {
      state.data = [];
      state.location = null;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSurroundingLandmarkData, clearSurroundingLandmarkData } =
  surroundingLandmarks.actions;

export default surroundingLandmarks.reducer;
