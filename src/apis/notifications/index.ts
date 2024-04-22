import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./notificationsEndpoints";

const getNotifications = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.NOTIFICATIONS}`);
};

export default {
  getNotifications
};
