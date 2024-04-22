import { createSlice } from "@reduxjs/toolkit";

import { getNotificationsThunk } from "~/redux/thunk/notifications.thunk";
import { INotifications, SLICE_NAME } from "~/redux/types/notifications.types";

const INITIAL_HOME_STATE: INotifications = {
  notifications: [],
  badges: 0
};

export const notificationsSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_HOME_STATE,
  reducers: {
    addNotification(state, { payload }) {
      state.notifications.unshift(payload);
    },
    removeNotification(state, { payload }) {
      state.notifications.filter(notification => notification.pkey !== payload.pkey);
    },
    setBadges(state, { payload }) {
      state.badges = payload;
    },
    incrementBadge(state, { payload }) {
      state.badges += payload;
    },
    decrementBadge(state, { payload }) {
      state.badges -= payload;
    },
    clearNotifications(state, { payload }) {
      state.notifications = [];
      state.badges = 0;
    }
  },
  extraReducers: builder => {
    builder.addCase(getNotificationsThunk.fulfilled, (state, { payload }) => {
      state.notifications = payload ?? [];
    });
  }
});

// Action creators are generated for each case reducer function
export const {
  addNotification,
  removeNotification,
  setBadges,
  incrementBadge,
  decrementBadge,
  clearNotifications
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
