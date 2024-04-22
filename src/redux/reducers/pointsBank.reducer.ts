import { createSlice } from "@reduxjs/toolkit";

import { PURGE_CACHE } from "~/constants/redux";
import { myPointsThunk, todayPointsThunk } from "~/redux/thunk/pointsBank.thunk";
import { IPointsBank, SLICE_NAME } from "~/redux/types/pointsBank.types";

const INITIAL_MAINTENANCE_MODE_STATE: IPointsBank = {
  myPoints: 0,
  todayPoints: 0,
  isLoadingMyPoints: true,
  isLoadingTodayPoints: true
};

export const pointsBankSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_MAINTENANCE_MODE_STATE,
  reducers: {
    updatePoints(state, { payload }) {
      state.myPoints += payload;
      state.todayPoints += payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(myPointsThunk.fulfilled, (state, { payload }) => {
      state.myPoints = payload.points;
      state.isLoadingMyPoints = false;
    });
    builder.addCase(todayPointsThunk.fulfilled, (state, { payload }) => {
      state.todayPoints = payload.points;
      state.isLoadingTodayPoints = false;
    });

    builder.addCase(PURGE_CACHE, state => {
      state = INITIAL_MAINTENANCE_MODE_STATE;
    });
  }
});

export const { updatePoints } = pointsBankSlice.actions;

export default pointsBankSlice.reducer;
