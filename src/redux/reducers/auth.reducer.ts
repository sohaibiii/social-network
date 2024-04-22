import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import config from "react-native-config";

import {
  getUserInfoThunk,
  getUserProfileThunk,
  updateUserPrivacySettingsThunk,
  updateLocationSettingsThunk
} from "../thunk/user.thunk";

import {
  AuthInterface,
  InternetServiceProviderInfo,
  Location,
  SLICE_NAME
} from "~/redux/types/auth.types";

const INITIAL_MAINTENANCE_MODE_STATE: AuthInterface = {
  isLoading: false,
  isSignout: false,
  needsVerification: false,
  userToken: null,
  refreshToken: null,
  isUnderMaintenance: false,
  isUnderForceUpgrade: false,
  user: undefined,
  userInfo: undefined,
  userProfile: undefined,
  isUserProfileLoading: false,
  pushNotificationToken: null,
  location: undefined
};

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_MAINTENANCE_MODE_STATE,
  reducers: {
    setMaintenanceMode: (state, action: PayloadAction<AuthInterface>) => {
      state.isUnderMaintenance = action.payload.isUnderMaintenance;
    },
    setUser: (state, action: PayloadAction<AuthInterface>) => {
      state.user = action.payload.user;
      state.userToken = action.payload.userToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUserInfoName: (state, action: PayloadAction<string>) => {
      state.userInfo.name = action.payload;
    },
    updateIsProfileCompleted: (state, action: PayloadAction<boolean>) => {
      state.userInfo.is_completed_name = action.payload;
    },
    setUserInfoImage: (state, action: PayloadAction<string>) => {
      state.userInfo.profile_image = action.payload;
      state.userInfo.profile =
        action.payload && `${config.AVATAR_MEDIA_PREFIX}/${action.payload}_s.jpg`;
    },
    clearUser: state => {
      state.user = INITIAL_MAINTENANCE_MODE_STATE.user;
      state.userInfo = INITIAL_MAINTENANCE_MODE_STATE.userInfo;
      state.userProfile = INITIAL_MAINTENANCE_MODE_STATE.userProfile;
      state.userToken = INITIAL_MAINTENANCE_MODE_STATE.userToken;
      state.refreshToken = INITIAL_MAINTENANCE_MODE_STATE.refreshToken;
    },
    updateRahhal: (state, action: PayloadAction<AuthInterface>) => {
      state.userProfile.rahhal = action.payload;
    },
    updateVerify: (state, action: PayloadAction<AuthInterface>) => {
      state.userProfile.verify = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setPushNotificationToken: (state, action) => {
      state.pushNotificationToken = action.payload;
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload.location;
    },
    followUser: (state, action: PayloadAction<Location>) => {
      state.userProfile.followingCount = state.userProfile?.followingCount + 1;
    },
    unfollowUser: (state, action: PayloadAction<Location>) => {
      state.userProfile.followingCount = state.userProfile?.followingCount - 1;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfoThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(getUserInfoThunk.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getUserInfoThunk.fulfilled, (state, { payload }) => {
        const { userInfo } = payload;
        state.isLoading = false;
        state.userInfo = userInfo;
      })
      .addCase(getUserProfileThunk.fulfilled, (state, { payload }) => {
        const { ProcessInfo, ...restOfProps } = payload;

        state.userProfile = restOfProps;
      })
      .addCase(updateUserPrivacySettingsThunk.fulfilled, (state, { payload }) => {
        const { ProcessInfo, ...restOfProps } = payload;
        state.isUserProfileLoading = false;
        state.userProfile = restOfProps;
      })
      .addCase(updateUserPrivacySettingsThunk.pending, state => {
        state.isUserProfileLoading = true;
      })
      .addCase(updateUserPrivacySettingsThunk.rejected, state => {
        state.isUserProfileLoading = false;
      })
      .addCase(updateLocationSettingsThunk.fulfilled, (state, { payload }) => {
        const { ProcessInfo, ...restOfProps } = payload;
        if (state.userInfo) {
          state.userInfo.location_settings.mode = restOfProps.location_settings.mode;
        }
      });
  }
});

// Action creators are generated for each case reducer function
export const {
  setMaintenanceMode,
  setUser,
  clearUser,
  updateRahhal,
  updateVerify,
  updateIsProfileCompleted,
  setUserInfoName,
  updateUserProfile,
  setUserInfoImage,
  setPushNotificationToken,
  setLocation,
  followUser,
  unfollowUser
} = authSlice.actions;

export default authSlice.reducer;
