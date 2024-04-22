import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CountryCityRegion, SLICE_NAME } from "~/redux/types/countryCityRegion.types";

const INITIAL_COUNTRY_CITY_PAGE_STATE: CountryCityRegion = {
  searchCountryCityRegionTerm: "",
  searchCountryTerm: ""
};

export const countryCityRegion = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_COUNTRY_CITY_PAGE_STATE,
  reducers: {
    setSearchCountryCityRegionTerm: (
      state,
      action: PayloadAction<CountryCityRegion>
    ) => ({
      ...state,
      ...action.payload
    }),
    setCountryTerm: (state, action: PayloadAction<CountryCityRegion>) => ({
      ...state,
      ...action.payload
    })
  }
});

// Action creators are generated for each case reducer function
export const { setSearchCountryCityRegionTerm, setCountryTerm } =
  countryCityRegion.actions;

export default countryCityRegion.reducer;
