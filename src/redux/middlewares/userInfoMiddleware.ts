import { isAnyOf } from "@reduxjs/toolkit";

import { getUserInfoThunk } from "../thunk";

import store from "~/redux/store";

import { userService } from "~/apiServices/index";
import { REFERRAL_NO_CODE, USER_REFERRAL } from "~/constants/";
import { startAppListening } from "~/redux/middlewares/index";
import { followUser } from "~/redux/reducers/auth.reducer";
import { deleteItem, retrieveItem } from "~/services/";
import { setUserAttributes } from "~/services/analytics";
import { logError } from "~/utils/";

export const startUserInfoListener = () =>
  startAppListening({
    matcher: isAnyOf(getUserInfoThunk.fulfilled),
    effect: async (action, listenerApi) => {
      const userInfoState = listenerApi.getState()?.auth?.userInfo;

      if (userInfoState) {
        const { id, country, referred_by } = userInfoState || {};
        const { name = "" } = country || {};

        setUserAttributes({
          id,
          backend_country: name
        });

        try {
          if (!referred_by || referred_by !== "NOT_YET") {
            return;
          }
          const referralUUID = (await retrieveItem(USER_REFERRAL)) || REFERRAL_NO_CODE;
          await userService.addReferral(referralUUID);
          store.dispatch(followUser({}));
          await deleteItem(USER_REFERRAL);
        } catch (error) {
          logError(`Error: addReferral error userInfoMiddleware.tsx ${error}`);
        }
      }
    }
  });
