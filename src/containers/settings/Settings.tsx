import React, { useState, useCallback, memo, useEffect } from "react";
import { View, SectionList, SafeAreaView, TouchableOpacity } from "react-native";

import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import { Switch, useTheme } from "react-native-paper";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import style from "./Settings.style";

import { RootState } from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import userService from "~/apiServices/user";
import { CText, Icon, IconTypes } from "~/components/common";
import {
  THEME_MODE_FLAG,
  REFRESH_TOKEN_FLAG,
  JWT_TOKEN_FLAG,
  PUSH_NOTIFICATION_TOKEN
} from "~/constants/";
import { isRTL } from "~/constants/";
import { clearUser } from "~/redux/reducers/auth.reducer";
import { setIsRefreshing, setScrollOffsetValue } from "~/redux/reducers/home.reducer";
import { clearInboxAndBadges } from "~/redux/reducers/inbox.reducer";
import { clearNotifications } from "~/redux/reducers/notifications.reducer";
import { setSettings } from "~/redux/reducers/settings.reducer";
import { AppStackProps } from "~/router/Router/Router.types";
import {
  openURL,
  storeItem,
  signOut,
  deleteItem,
  retrieveItem,
  NAVIGATE_TO_FAVORITES
} from "~/services/";
import { logEvent, LOGOUT, DARK_MODE, OPEN_EXTERNAL_URL } from "~/services/analytics";
import { scale, logError } from "~/utils/";

const Settings = ({ navigation }: AppStackProps): JSX.Element => {
  const language = useSelector(
    (state: RootState) => state.settings.language,
    shallowEqual
  );
  const isThemeDark = useSelector(
    (state: RootState) => state.settings.isThemeDark,
    shallowEqual
  );

  const uuid = useSelector((state: RootState) => state.auth.userInfo?.id, shallowEqual);
  const userToken = useSelector((state: RootState) => state.auth.userToken, shallowEqual);
  const social = useSelector(
    (state: RootState) => state.auth.userProfile?.social,
    shallowEqual
  );
  const [isDarkModeSwitchOn, setDarkModeSwitchOn] = useState(isThemeDark);

  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const readableVersion = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const [settingsData, setSettingsData] = useState([]);

  const {
    safeareviewStyle,
    headerSectionStyle,
    arrowIconStyle,
    settingIconStyle,
    settingItemWrapperStyle,
    settingItemLeftWrapperStyle,
    appVersionTextStyle,
    leftWrapperStyle
  } = React.useMemo(() => style(theme, isThemeDark), [theme, isThemeDark]);

  const onToggleDarkModeSwitch = useCallback(async () => {
    setDarkModeSwitchOn(prevState => !prevState);
    dispatch(setSettings({ isThemeDark: !isDarkModeSwitchOn }));
    await storeItem(THEME_MODE_FLAG, !isDarkModeSwitchOn ? "dark" : "light");
    await logEvent(DARK_MODE, { mode: !isDarkModeSwitchOn ? "dark" : "light" });
  }, [dispatch, isDarkModeSwitchOn]);

  useEffect(() => {
    let SETTINGS_DATA = [
      {
        key: "account_settings",
        title: t("account_settings"),
        data: [
          {
            key: "MyOrders",
            name: t("my_orders"),
            icon: "orders",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "MyOrders"
          },
          {
            key: "favoriteList",
            name: t("favorites_list"),
            icon: "favorite_list",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "FavoriteList"
          },
          {
            key: "blockList",
            name: t("blocked_list"),
            icon: "blocked_list",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "BlockList"
          },
          {
            key: "privacySettings",
            name: t("privacy_settings"),
            icon: "privacy_and_settings",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "PrivacySettings"
          }
        ]
      },
      {
        key: "badges",
        title: t("badges"),
        data: [
          {
            key: "verify_rahhal",
            name: t("rahhal_request"),
            icon: "rahhal_circle",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "VerifyRahhal"
          },
          {
            key: "verify_account",
            name: t("verify_account"),
            icon: "verify_circle",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "VerifyAccount"
          }
        ]
      },
      {
        key: "referrals",
        title: t("referrals_and_credits"),
        data: [
          {
            key: "invite_a_friend",
            name: t("invite_a_friend"),
            icon: "invite_friend",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "InviteFriend"
          }
        ]
      },

      {
        key: "preferences",
        title: t("preferences"),
        data: [
          {
            key: "languageSelector",
            name: t("languages"),
            icon: "language",
            iconType: IconTypes.SAFARWAY_ICONS,
            route: "ChangeLanguage",
            leftTitle:
              language === "ar" ? "عربي" : language === "fr" ? "French" : "English"
          },
          {
            key: "darkModeSelector",
            name: t("dark_mode"),
            icon: "dark_mode",
            iconType: IconTypes.SAFARWAY_ICONS
          }
        ]
      },

      {
        key: "business_portal_title",
        title: t("for_business"),
        data: [
          {
            key: "business-portal",
            name: t("business_portal"),
            icon: "business_outlined",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `privacy-policy`
          }
        ]
      },
      {
        key: "safarway_affiliates_title",
        title: t("safarway_affiliates"),
        data: [
          {
            key: "safarway-affiliates",
            name: t("safarway_affiliates"),
            icon: "money_outlined",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `affiliate`
          }
        ]
      },
      {
        key: "settings",
        title: t("help_and_support_center"),
        data: [
          {
            key: "about_us",
            name: t("about_us"),
            icon: "about_us",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `about-us`
          },
          {
            key: "help-center",
            name: t("help_center"),
            icon: "support_center",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `help-center`
          },
          {
            key: "terms_of_use",
            name: t("terms_of_use"),
            icon: "terms_and_conditions",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `terms-eng`
          },
          {
            key: "privacy-policy",
            name: t("privacy_policy"),
            icon: "privacy_policy",
            iconType: IconTypes.SAFARWAY_ICONS,
            isExternal: true,
            url: `privacy-policy`
          }
        ]
      },
    
      {
        key: "logoutItem",
        title: "",
        data: [
          {
            key: "deleteAccount",
            name: t("delete_account"),
            icon: "delete_account",
            iconType: IconTypes.SAFARWAY_ICONS
          },
          {
            key: "logout",
            name: t("logout"),
            icon: "logout",
            iconType: IconTypes.SAFARWAY_ICONS
          }
        ]
      },
     
    ];

    if (!userToken) {
      SETTINGS_DATA = SETTINGS_DATA.filter(item => {
        if (
          !(
            item.key === "badges" ||
            item.key === "referrals" ||
            item.key === "logoutItem"||
            item.key === "DeleteAccount"
          )
        ) {
          return item;
        }
      });
    }

    if (!social && userToken) {
      SETTINGS_DATA[0].data.unshift({
        key: "changePasswordItem",
        name: t("change_password"),
        icon: "change_password",
        iconType: IconTypes.SAFARWAY_ICONS,
        route: "ChangePassword"
      });
    }
    setSettingsData(SETTINGS_DATA);
  }, [isDarkModeSwitchOn, userToken, social, language, t]);

  const handleLogout = useCallback(async () => {
    try {
      const pushNotificationToken = await retrieveItem(PUSH_NOTIFICATION_TOKEN);
      pushNotificationToken &&
        (await userService.unRegisterDeviceToken(pushNotificationToken));
      await signOut();
      await logEvent(LOGOUT, {});
      delete axiosInstance.defaults.headers.common.Authorization;
      await deleteItem(JWT_TOKEN_FLAG);
      await deleteItem(REFRESH_TOKEN_FLAG);
      await deleteItem(PUSH_NOTIFICATION_TOKEN);
      dispatch(clearUser());
      dispatch(setIsRefreshing({}));
      dispatch(clearNotifications({}));
      dispatch(clearInboxAndBadges());
      dispatch(setScrollOffsetValue(0));

      Sentry.configureScope(scope => scope.setUser(null));
    } catch (error) {
      logError(`handleLogout error ${error}`);
    }
  }, [dispatch]);

  const handleSettingCallback = useCallback(
    async (isExternal, url, key, route) => {
      if (key === "logout") {
        return handleLogout();
      }
      if ( key === "deleteAccount") {
        return navigation.navigate("DeleteAccount") ;
      }
      if (key === "favoriteList") {
        await logEvent(NAVIGATE_TO_FAVORITES, { source: "settings_page" });
      }
      if (key === "business-portal") {
        return openURL(`${Config.PORTAL_SAFARWAY_URL}/${language}`);
      }
      if (isExternal) {
        const linkUrl =
          key === "help-center"
            ? `${Config.URL_PREFIX}/mobile_webview?route=/${language}/${url}&uuid=${uuid}&token=${userToken}`
            : `${Config.URL_PREFIX}/mobile_webview?route=/${language}/${url}&token=${userToken}`;
        await logEvent(OPEN_EXTERNAL_URL, { key, linkUrl, source: "settings_page" });
        return openURL(linkUrl);
      }

      navigation.navigate(route);
    },
    [handleLogout, navigation, uuid]
  );

  const handlerenderItem = useCallback(
    ({ item }) => {
      const {
        name,
        icon,
        iconType,
        renderToggle,
        isExternal,
        url,
        key,
        route,
        leftTitle
      } = item;

      return (
        <View>
          <TouchableOpacity
            disabled={key === "darkModeSelector"}
            style={settingItemWrapperStyle}
            onPress={() => handleSettingCallback(isExternal, url, key, route)}
          >
            <View style={settingItemLeftWrapperStyle}>
              <Icon
                type={iconType}
                name={icon}
                width={scale(24)}
                height={scale(24)}
                style={settingIconStyle}
              />
              <CText fontSize={13}>{`${name}`}</CText>
            </View>
            {key === "darkModeSelector" ? (
              <Switch value={isDarkModeSwitchOn} onValueChange={onToggleDarkModeSwitch} />
            ) : (
              <View style={leftWrapperStyle}>
                <CText fontSize={14} lineHeight={18}>
                  {leftTitle}
                </CText>
                <Icon
                  type={IconTypes.ENTYPO}
                  name={isRTL ? "chevron-left" : "chevron-right"}
                  size={scale(18)}
                  color={"#194D9B"}
                  style={arrowIconStyle}
                />
              </View>
            )}
          </TouchableOpacity>
          {((!!userToken && key === "logout") ||
            (!userToken && key === "privacy-policy")) && (
            <CText
              fontSize={13}
              style={appVersionTextStyle}
            >{`V${readableVersion} (${buildNumber})`}</CText>
          )}
        </View>
      );
    },
    [
      appVersionTextStyle,
      arrowIconStyle,
      buildNumber,
      handleSettingCallback,
      leftWrapperStyle,
      readableVersion,
      settingIconStyle,
      settingItemLeftWrapperStyle,
      settingItemWrapperStyle,
      userToken,
      isDarkModeSwitchOn,
      onToggleDarkModeSwitch
    ]
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => <CText style={headerSectionStyle}>{title}</CText>,
    [headerSectionStyle]
  );

  const keyExtractor = useCallback(item => {
    return item.key;
  }, []);

  return (
    <SafeAreaView style={safeareviewStyle}>
      <SectionList
        sections={settingsData}
        keyExtractor={keyExtractor}
        renderItem={handlerenderItem}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default memo(Settings);
