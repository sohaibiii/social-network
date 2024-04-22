import React, { useState, useEffect, useCallback } from "react";
import { I18nManager, Appearance } from "react-native";

import { Hub } from "@aws-amplify/core";
import * as Sentry from "@sentry/react-native";
import axios from "axios";
import moment from 'moment/min/moment-with-locales';
// import moment from "moment";
import 'moment/locale/ar';
import 'moment/locale/fr';
import 'moment/locale/en-gb';
import 'moment/locale/fa';
import 'moment/locale/id';
import 'moment/locale/hi';
import 'moment/locale/tr';




import DeviceInfo from "react-native-device-info";
import * as RNLocalize from "react-native-localize";
import Orientation from "react-native-orientation-locker";
import { Provider as PaperProvider } from "react-native-paper";
import RNRestart from "react-native-restart";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import inboxService from "~/apiServices/inbox";
import { adsService } from "~/apiServices/index";
import userService from "~/apiServices/user";
import { NotificationsCountResponse } from "~/apiServices/user/user.types";
import {
  THEME_MODE_FLAG,
  LANGUAGE_FLAG,
  APP_RESTART_COUNTER,
  DEFAULTS,
  PUSH_NOTIFICATION_TOKEN,
  JWT_TOKEN_FLAG
} from "~/constants/";
import { setIsRefreshing } from "~/redux/reducers/home.reducer";
import { setBadges as setInboxBadges } from "~/redux/reducers/inbox.reducer";
import { setBadges } from "~/redux/reducers/notifications.reducer";
import { setSettings } from "~/redux/reducers/settings.reducer";
import { getUserInfoThunk, getUserProfileThunk } from "~/redux/thunk/user.thunk";
import Router from "~/router/";
import {
  configureAmplify,
  authenticateCurrentUser,
  retrieveItem,
  storeItem,
  setCrashlyticsUserId,
  setCrashlyticsAttributes,
  setAmplitudeUserId,
  setUserAttributes
} from "~/services/";
import { DarkTheme, LightTheme } from "~/theme/";
import { i18n } from "~/translations/";
import { handleAuthenticateUser } from "~/utils/";
import { logError } from "~/utils/errorHandler";

const ProvidersContainer = (): JSX.Element => {
  const [isProvidersLoading, setIsProvidersLoading] = useState(true);

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const pushNotificationToken = useSelector(
    (state: RootState) => state.auth.pushNotificationToken?.token
  );
  const isUserInfoLoading = useSelector((state: RootState) => state.auth.isLoading);

  const dispatch = useDispatch();

  const deviceCountry = RNLocalize.getCountry();

  const registerPushNotification = useCallback(async () => {
    const deviceToken = pushNotificationToken ?? "",
      deviceName = await DeviceInfo.getDeviceName(),
      carrier = await DeviceInfo.getCarrier(),
      device = await DeviceInfo.getDevice(),
      deviceId = DeviceInfo.getDeviceId(),
      country = deviceCountry,
      appVersion = DeviceInfo.getVersion();

    await storeItem(PUSH_NOTIFICATION_TOKEN, deviceToken);

    await userService.registerDeviceToken(
      deviceToken,
      deviceName,
      carrier,
      device,
      deviceId,
      country,
      appVersion
    );
  }, [pushNotificationToken]);

  const initializeApp = useCallback(async () => {
    try {
      Orientation.lockToPortrait();

      const savedLanguage = await retrieveItem(LANGUAGE_FLAG);
      const savedThemeMode = await retrieveItem(THEME_MODE_FLAG);

      if (savedLanguage) {
        dispatch(setSettings({ language: savedLanguage }));
        axiosInstance.defaults.headers.common.language = savedLanguage;

        if (savedLanguage === "en" || savedLanguage === "fr") {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        } else {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
        }
        await i18n.changeLanguage(savedLanguage);


        moment.locale(savedLanguage.toLowerCase());



      } else {
        const deviceLocales = RNLocalize.getLocales();

        if (deviceLocales.find(lang => lang.languageCode === "ar")) {
          // default language values
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          axiosInstance.defaults.headers.common.language = DEFAULTS.APP_MAIN_LANGUAGE;

          await i18n.changeLanguage(DEFAULTS.APP_MAIN_LANGUAGE);
          moment.locale("ar");

          const isFirstRestart = (await retrieveItem(APP_RESTART_COUNTER)) || 1;
          // add safe exit to allow only 2 restart since ios RTL needs two restart to adapt
          if (!I18nManager.isRTL && Number(isFirstRestart) < 3) {
            // default language values
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
            // here we save a flag and do one restart only to force RTL
            await storeItem(APP_RESTART_COUNTER, `${Number(isFirstRestart) + 1}`);
            RNRestart.Restart();
          } else {
            await storeItem(APP_RESTART_COUNTER, `1`);
          }
        } else if (
          RNLocalize.findBestAvailableLanguage(["ar", "fr", "en"])?.languageTag === "fr"
        ) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          axiosInstance.defaults.headers.common.language = "fr";
          await i18n.changeLanguage("fr");
          moment.locale("fr");
          dispatch(setSettings({ language: "fr" }));
        } else {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          axiosInstance.defaults.headers.common.language = "en";
          await i18n.changeLanguage("en");
          moment.locale("en");
          dispatch(setSettings({ language: "en" }));
        }
      }

      if (savedThemeMode) {
        dispatch(setSettings({ isThemeDark: savedThemeMode === "dark" }));
      } else {
        // default theme values
        const colorScheme = Appearance.getColorScheme();
        dispatch(setSettings({ isThemeDark: colorScheme === "dark" }));
      }
      axiosInstance.defaults.headers.common.source = "app";
      const token = (await retrieveItem(JWT_TOKEN_FLAG)) ?? null;

      if (token) {
        const authenticatedCurrentUserData = await authenticateCurrentUser();
        const {
          signInUserSession: {
            idToken: { jwtToken: userToken = "", payload = {} } = {},
            refreshToken: { token: refreshToken = "" } = {},
            attributes: { sub, email } = {}
          } = {}
        } = authenticatedCurrentUserData || {};

        handleAuthenticateUser(userToken, refreshToken, payload);
        userToken && dispatch(getUserInfoThunk());
        userToken && dispatch(getUserProfileThunk());
        userToken &&
          userService
            .getNotificationCount()
            .then(({ inboxCount, notificationsCount }: NotificationsCountResponse) => {
              dispatch(setBadges(notificationsCount));
              dispatch(setInboxBadges(inboxCount));
            })
            .catch(error => {
              logError(`Error: getNotificationCount --ProvidersContainer.tsx-- ${error}`);
            });

        userToken &&
          Sentry.setUser({
            id: payload["custom:old_sub"] || payload.sub,
            saf_user_id: payload["custom:old_sub"] || payload.sub
          });
        userToken && setAmplitudeUserId(payload["custom:old_sub"] || payload.sub);

        userToken && !!sub && (await setCrashlyticsUserId(sub));
        userToken && !!email && (await setCrashlyticsAttributes({ email }));
      }
      setUserAttributes({ device_country: deviceCountry });
    } catch (error) {
      logError(`Error: initializeApp --ProvidersContainer.tsx-- ${error} `);
    } finally {
      setIsProvidersLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    configureAmplify();
    initializeApp();

    const hubSubscriber = Hub.listen("auth", async ({ payload: { event, data } }) => {
      const {
        signInUserSession: {
          idToken: { jwtToken: userToken = "", payload = {} } = {},
          refreshToken: { token: refreshToken = "" } = {},
          attributes: { sub, email } = {}
        } = {}
      } = data || {};

      if (event === "signIn") {
        handleAuthenticateUser(userToken, refreshToken, payload);
        userToken && dispatch(getUserInfoThunk());
        userToken && dispatch(getUserProfileThunk());

        userToken && !!sub && (await setCrashlyticsUserId(sub));
        userToken && !!email && (await setCrashlyticsAttributes({ email }));
        userToken &&
          userService
            .getNotificationCount()
            .then(({ inboxCount, notificationsCount }: NotificationsCountResponse) => {
              dispatch(setBadges(notificationsCount));
              dispatch(setInboxBadges(inboxCount));
            })
            .catch(error => {
              logError(`Error: getNotificationCount --ProvidersContainer.tsx-- ${error}`);
            });

        dispatch(setIsRefreshing({}));
      }
    });

    return () => {
      Hub.remove("auth", hubSubscriber);
    };
  }, [dispatch, initializeApp]);

  useEffect(() => {
    if (isUserInfoLoading || !pushNotificationToken || isProvidersLoading) {
      return;
    }
    registerPushNotification();
  }, [
    pushNotificationToken,
    isProvidersLoading,
    registerPushNotification,
    isUserInfoLoading
  ]);

  const theme = isThemeDark ? DarkTheme : LightTheme;

  const handleReinitializeApp = () => {
    const reInitalizeCurrentUser = async () => {
      try {
        const token = (await retrieveItem(JWT_TOKEN_FLAG)) ?? null;

        if (token) {
          const authenticatedCurrentUserData = await authenticateCurrentUser();
          const {
            signInUserSession: {
              idToken: { jwtToken: userToken = "", payload = {} } = {},
              refreshToken: { token: refreshToken = "" } = {},
              attributes: { sub, email } = {}
            } = {}
          } = authenticatedCurrentUserData || {};

          handleAuthenticateUser(userToken, refreshToken, payload);
          userToken && dispatch(getUserInfoThunk());
          userToken && dispatch(getUserProfileThunk());
          userToken &&
            userService
              .getNotificationCount()
              .then(({ inboxCount, notificationsCount }: NotificationsCountResponse) => {
                dispatch(setBadges(notificationsCount));
                dispatch(setInboxBadges(inboxCount));
              })
              .catch(error => {
                logError(
                  `Error: getNotificationCount --ProvidersContainer.tsx-- ${error}`
                );
              });

          userToken &&
            Sentry.setUser({
              id: payload["custom:old_sub"] || payload.sub,
              saf_user_id: payload["custom:old_sub"] || payload.sub
            });
          userToken && setAmplitudeUserId(payload["custom:old_sub"] || payload.sub);

          userToken && !!sub && (await setCrashlyticsUserId(sub));
          userToken && !!email && (await setCrashlyticsAttributes({ email }));
        }
        setUserAttributes({ device_country: deviceCountry });
      } catch (error) {
        logError(`Error: reInitalizeCurrentUser --ProvidersContainer.tsx-- ${error}`);
      }
    };
    reInitalizeCurrentUser();
  };

  return (
    <PaperProvider theme={theme}>
      {!isProvidersLoading && (
        <Router theme={theme} reinitializeAppCb={handleReinitializeApp} />
      )}
    </PaperProvider>
  );
};

export default ProvidersContainer;
