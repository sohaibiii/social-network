import { createAsyncThunk } from "@reduxjs/toolkit";

import { myPointsAPI, todayPointsAPI } from "~/apis/";
import { SLICE_NAME } from "~/redux/types/pointsBank.types";

export const myPointsThunk = createAsyncThunk(`${SLICE_NAME}/myPoints`, async () => {
  const response = await myPointsAPI();
  return response;
});

export const todayPointsThunk = createAsyncThunk(
  `${SLICE_NAME}/todayPoints`,
  async () => {
    const response = await todayPointsAPI();
    return response;
  }
);
