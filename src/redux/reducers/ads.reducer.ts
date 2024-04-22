import { createSlice } from "@reduxjs/toolkit";

import { AdsInterface, SLICE_NAME } from "~/redux/types/ads.types";

const INITIAL_MAINTENANCE_MODE_STATE: AdsInterface = {
  configs: {
    adEnabledProperty: true,
    adEnabledCityCountryRegion: true,
    adEnabledDestinations: true,
    adEnabledTop20: true,
    adEnabledThingsToDo: true,
    adEnabledMoreRelatedProperties: true
  }
};

const adsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_MAINTENANCE_MODE_STATE,
  reducers: {
    setConfigs: (state, action) => {
      state.configs = action.payload;
    }
  }
});

export const { setConfigs } = adsSlice.actions;

export default adsSlice.reducer;
