import { CognitoUserSession } from "amazon-cognito-identity-js";
import axios from "axios";
import Config from "react-native-config";
import store from "~/redux/store";

import {
  UNAUTHENTICATION_ERROR,
  BAD_GATEWAY_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  RESOURCE_NOT_FOUND_ERROR
} from "~/constants/errorCodes";
import { setMaintenanceMode } from "~/redux/reducers/auth.reducer";
import { replace, refreshToken as refreshTokenApi } from "~/services/";
import { handleAuthenticateUser, logError } from "~/utils/";

const axiosInstance = axios.create({
  baseURL: Config.API_HOST,
  headers: { "content-type": "application/json", "accept-language": "en" },
  timeout: 15000
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  async function (error) {
    // Your Interceptor code to do something with response error
    // case 401 then unauthorized so basically logout
    try {
      if (error.response && error.response.status === UNAUTHENTICATION_ERROR) {
        const authenticatedCurrentUserData: CognitoUserSession | undefined =
          await refreshTokenApi();

        const refreshToken =
          authenticatedCurrentUserData?.getRefreshToken().getToken() || "";
        const userToken = authenticatedCurrentUserData?.getIdToken().getJwtToken() || "";

        const originalRequest = error.config;
        await handleAuthenticateUser(userToken, refreshToken, {});
        originalRequest.headers.Authorization = `Bearer ${userToken}`;
        return axios.request(originalRequest);
      }
      if (error.response && error.response.status === BAD_GATEWAY_ERROR) {
        // needs discuss with ghaleb +  timeline translation
        // store.dispatch(setMaintenanceMode({ isUnderMaintenance: true }));
      }
      if (error.response && error.response.status === SERVICE_UNAVAILABLE_ERROR) {
        // needs discuss with ghaleb +  timeline translation
        // store.dispatch(setMaintenanceMode({ isUnderMaintenance: true }));
      }
      if (error.response && error.response.status === RESOURCE_NOT_FOUND_ERROR) {
        replace("NotFoundPage");
      }
      // Return error
      return Promise.reject(error);
    } catch (e) {
      logError(e);
    }
  }
);

const axiosHotelsInstance = axios.create({
  baseURL: Config.API_HOST,
  headers: { "content-type": "application/json", "accept-language": "en" },
  timeout: 15000
});

axiosInstance.interceptors.request.use(
  config => {
    console.log("config before request", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosHotelsInstance };
