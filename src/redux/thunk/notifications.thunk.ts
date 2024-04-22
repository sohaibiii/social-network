import { createAsyncThunk } from "@reduxjs/toolkit";

import notificationsServices from "~/apiServices/notifications";

export const getNotificationsThunk = createAsyncThunk(`/getNotifications`, async () => {
  const response = await notificationsServices.getNotifications();
  return response;
});
