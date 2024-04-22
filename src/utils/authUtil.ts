import axios from "axios";

import store from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import { JWT_TOKEN_FLAG, REFRESH_TOKEN_FLAG } from "~/constants/";
import { setUser } from "~/redux/reducers/auth.reducer";
import { storeItem } from "~/services/";
import { logError } from "~/utils/errorHandler";

export const handleAuthenticateUser = async (
  userToken: string,
  refreshToken: string,
  payload: any
) => {
  try {
    const {
      identities = [],
      given_name,
      family_name,
      name,
      email,
      email_verified,
      phone_number,
      phone_number_verified
    } = payload;
    const { providerName, providerType } = identities[0] || {};

    store.dispatch(
      setUser({
        userToken,
        refreshToken,
        user: {
          providerName,
          providerType,
          givenName: given_name,
          familyName: family_name,
          name,
          email,
          emailVerified: email_verified,
          phoneNumber: phone_number,
          phoneNumberVerified: phone_number_verified
        }
      })
    );
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${userToken}`;

    await storeItem(JWT_TOKEN_FLAG, userToken);
    await storeItem(REFRESH_TOKEN_FLAG, refreshToken);
  } catch (error) {
    logError("error in saving to Local storage in listener hub ");
  }
};
