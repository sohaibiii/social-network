import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Switch, Text, useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { UserPreference } from "./PrivacySetting.type";
import style from "./PrivacySettings.styles";

import { RootState } from "~/redux/store";

import { userService } from "~/apiServices/index";
import settingService from "~/apiServices/settings";
import { UserSettingsUnionUserPreferences } from "~/apiServices/user/user.types";
import { Button } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FormikSwitch } from "~/components/formik";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { updateUserPrivacySettingsThunk } from "~/redux/thunk/user.thunk";
import {
  logEvent,
  CLEAR_DATA_REQUEST,
  CLEAR_DATA_REQUEST_FAILED,
  CLEAR_DATA_REQUEST_SUCCESS,
  DISABLE_USER_REQUEST,
  DISABLE_USER_REQUEST_SUCCESS,
  DISABLE_USER_REQUEST_FAILED,
  UPDATE_USER_PRIVACY_SETTING,
  UPDATE_USER_PRIVACY_SETTING_FAILED,
  UPDATE_USER_PRIVACY_SETTING_SUCCESS
} from "~/services/analytics";
import { generalErrorHandler, logError } from "~/utils/";
import { useYupValidationResolver } from "~/utils/";
import { updateUserPreferences } from "~/validationSchemas/";

const PrivacySettings = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isPurgeLoading, setIsPurgeLoading] = useState(false);
  const [isDeactiveLoading, setIsDeactivateLoading] = useState(false);
  const [isReceivingNotifications, setIsReceivingNotifications] = useState(false);
  const { settings = {}, preferences = {} } =
    useSelector((state: RootState) => state.auth.userProfile) || {};

  const deviceToken =
    useSelector((state: RootState) => state.auth.pushNotificationToken?.token) || "";

  const isUserProfileLoading =
    useSelector((state: RootState) => state.auth.isUserProfileLoading) || false;

  const { next_search_update = 0, ...settingsWithoutTimestamp } = settings;
  const initialUserPreferences: UserSettingsUnionUserPreferences = {
    ...preferences,
    ...settingsWithoutTimestamp
  } || {
    receive_email_notifications: true,
    show_on_follow_recommendation: true,
    show_on_users_search: true,
    next_search_update: 0,
    subscribe_to_newsletter: true,
    upload_hd: true,
    enable_sounds: true,
    autoplay_video: true,
    enable_chat_sounds: true
  };
  const resolver = useYupValidationResolver(updateUserPreferences);
  const { control, handleSubmit } = useForm({
    resolver,
    mode: "onSubmit",
    defaultValues: initialUserPreferences
  });

  const userPreferences: (UserPreference | undefined)[] = Object.keys(
    initialUserPreferences
  ).map(pref => {
    if (pref === "autoplay_video") {
      return {
        id: "autoplay_video",
        name: "autoplay_video",
        label: "video_autoplay",
        value: initialUserPreferences[pref]
      };
    } else if (pref === "enable_chat_sounds") {
      return {
        id: "enable_chat_sounds",
        name: "enable_chat_sounds",
        label: "enable_chat_sounds",
        value: initialUserPreferences[pref]
      };
    } else if (pref === "enable_sounds") {
      return {
        id: "enable_sounds",
        name: "enable_sounds",
        label: "activate_like_comment_voice",
        value: initialUserPreferences[pref]
      };
    } else if (pref === "receive_email_notifications") {
      return {
        id: "receive_email_notifications",
        name: "receive_email_notifications",
        label: "activate_receiving_notifications",
        value:
          typeof initialUserPreferences[pref] === "string"
            ? initialUserPreferences[pref] === "true"
            : initialUserPreferences[pref]
      };
    } else if (pref === "show_on_follow_recommendation") {
      return {
        id: "show_on_follow_recommendation",
        name: "show_on_follow_recommendation",
        label: "appear_in_follow_suggestions",
        value:
          typeof initialUserPreferences[pref] === "string"
            ? initialUserPreferences[pref] === "true"
            : initialUserPreferences[pref]
      };
    } else if (pref === "show_on_users_search") {
      return {
        id: "show_on_users_search",
        name: "show_on_users_search",
        label: "appear_in_people_search",
        value:
          typeof initialUserPreferences[pref] === "string"
            ? initialUserPreferences[pref] === "true"
            : initialUserPreferences[pref]
      };
    } else if (pref === "subscribe_to_newsletter") {
      return {
        id: "subscribe_to_newsletter",
        name: "subscribe_to_newsletter",
        label: "receive_email_alerts",
        value:
          typeof initialUserPreferences[pref] === "string"
            ? initialUserPreferences[pref] === "true"
            : initialUserPreferences[pref]
      };
    } else if (pref === "upload_hd") {
      return {
        id: "upload_hd",
        name: "upload_hd",
        label: "upload_photos_high_quality",
        value: initialUserPreferences[pref]
      };
    }
  });

  useEffect(() => {
    userService.getNotificationSettings(deviceToken).then(res => {
      setIsReceivingNotifications(res?.notify || false);
    });
  }, [deviceToken]);

  const handleSaveUserPreferences = async (data: any) => {
    await logEvent(UPDATE_USER_PRIVACY_SETTING, { source: "privacy_settings_page" });
    dispatch(updateUserPrivacySettingsThunk(data));
    userService
      .updateNotificationSettings(deviceToken, isReceivingNotifications)
      .then(() => {
        dispatch(
          showSnackbar({
            text: `${t("privacy_settings_updated_successfully")}`,
            type: SnackbarVariations.SNACKBAR,
            duration: 2500,
            backgroundColor: "green"
          })
        );
        return logEvent(UPDATE_USER_PRIVACY_SETTING_SUCCESS, {
          source: "privacy_settings_page",
          ...data
        });
      })
      .catch(error => {
        logError(`Error saving notify setting ${error}`);
        logEvent(UPDATE_USER_PRIVACY_SETTING_FAILED, { source: "privacy_settings_page" });
      });
  };

  const handleDisableAccount = async () => {
    setIsDeactivateLoading(true);
    await logEvent(DISABLE_USER_REQUEST, { source: "privacy_settings_page" });

    settingService
      .deactivateAccountRequest()
      .then(() => {
        dispatch(
          showSnackbar({
            text: `${t("request_applied_successfully")} \n ${t("contact_you_soon")}`,
            type: SnackbarVariations.SNACKBAR,
            duration: 2500,
            backgroundColor: theme.colors.primary
          })
        );
        return logEvent(DISABLE_USER_REQUEST_SUCCESS, {
          source: "privacy_settings_page"
        });
      })
      .catch(async err => {
        await logEvent(DISABLE_USER_REQUEST_FAILED, { source: "privacy_settings_page" });
        generalErrorHandler(
          `Error: deactivateAccountRequest --PrivacySettings.tsx-- ${error}`
        );
      })
      .finally(() => {
        setIsDeactivateLoading(false);
      });
  };

  const handleClearAllData = async () => {
    setIsPurgeLoading(true);
    await logEvent(CLEAR_DATA_REQUEST, { source: "privacy_settings_page" });
    settingService
      .purgeAccountRequest()
      .then(() => {
        dispatch(
          showSnackbar({
            text: `${t("request_applied_successfully")} \n ${t("contact_you_soon")}`,
            type: SnackbarVariations.SNACKBAR,
            duration: 2500,
            backgroundColor: theme.colors.primary
          })
        );
        return logEvent(CLEAR_DATA_REQUEST_SUCCESS, { source: "privacy_settings_page" });
      })
      .catch(async error => {
        await logEvent(CLEAR_DATA_REQUEST_FAILED, { source: "privacy_settings_page" });
        generalErrorHandler(
          `Error: purgeAccountRequest --PrivacySettings.tsx-- ${error}`
        );
      })
      .finally(() => {
        setIsPurgeLoading(false);
      });
  };

  const {
    safeareviewStyle,
    userPreferencesRowStyle,
    containerStyle,
    saveBtnStyle,
    whiteLabel,
    settingsWrapperStyle,
    privacySettingsWrapperStyle,
    subTitleStyle,
    privacyBtnStyle,
    privacyBtnLabelStyle,
    switchStyle
  } = style(theme);

  return (
    <SafeAreaView style={safeareviewStyle}>
      <View style={containerStyle}>
        <ScrollView>
          <View style={settingsWrapperStyle}>
            <Text style={subTitleStyle}>{t("settings")}</Text>
            <View style={userPreferencesRowStyle} key={"receive_email_notifications"}>
              <Text>{t("activate_receiving_notifications")}</Text>
              <Switch
                style={switchStyle}
                value={isReceivingNotifications}
                onValueChange={setIsReceivingNotifications}
              />
            </View>
            {userPreferences.map((userPref: UserPreference | undefined) => {
              const { label = "", name = "", id = "", value = false } = userPref || {};
              // hide chat settings for now
              if (id === "enable_chat_sounds" || id === "receive_email_notifications") {
                return null;
              }
              return (
                <View style={userPreferencesRowStyle} key={id}>
                  <Text>{t(label)}</Text>
                  <FormikSwitch control={control} name={name} defaultValue={!!value} />
                </View>
              );
            })}
            <Button
              title={t("save")}
              style={saveBtnStyle}
              labelStyle={whiteLabel}
              onPress={handleSubmit(handleSaveUserPreferences)}
              isLoading={!!isUserProfileLoading}
            />
          </View>

          <View style={privacySettingsWrapperStyle}>
            <Text style={subTitleStyle}>{t("privacy")}</Text>

            <Button
              title={t("disable_account_and_affiliation")}
              style={privacyBtnStyle}
              labelStyle={privacyBtnLabelStyle}
              onPress={handleDisableAccount}
              isLoading={isDeactiveLoading}
            />
            <Button
              title={t("clear_all_data")}
              style={privacyBtnStyle}
              labelStyle={privacyBtnLabelStyle}
              onPress={handleClearAllData}
              isLoading={isPurgeLoading}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PrivacySettings;
