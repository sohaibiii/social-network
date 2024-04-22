import { createAsyncThunk } from "@reduxjs/toolkit";

import { UserPreferences, UserSettings } from "../../apiServices/user/user.types";

import { userAPI } from "~/apis/";
import { SLICE_NAME } from "~/redux/types/auth.types";

export const getUserInfoThunk = createAsyncThunk(
  `${SLICE_NAME}/getUserInfo`,
  async () => {
    const response = await userAPI.getUserInfo();
    return response.data;
  }
);

export const getUserProfileThunk = createAsyncThunk(
  `${SLICE_NAME}/getMyProfile`,
  async () => {
    const response = await userAPI.getMyProfile();
    return response.data;
  }
);

export const updateUserPrivacySettingsThunk = createAsyncThunk(
  `${SLICE_NAME}/updateUserPrivacySettings`,
  async (privacySettings: UserSettings & UserPreferences) => {
    const response = await userAPI.updateUserPrivacySettings(privacySettings);
    return response?.data;
  }
);

export const updateLocationSettingsThunk = createAsyncThunk(
  `${SLICE_NAME}/updateLocationSettings`,
  async (mode: string) => {
    const response = await userAPI.updateLocationSettings(mode);
    return response?.data;
  }
);
