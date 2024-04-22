import { Text, View, SafeAreaView, ScrollView } from "react-native";
import * as Sentry from "@sentry/react-native";
import React,{useCallback} from "react";
import { Button } from "../../components/common/Button";
import styles from "./deleteAcount.stayle";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Alert from "../../components/common/Alert/Alert";
import { clearUser } from "~/redux/reducers/auth.reducer";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { clearInboxAndBadges } from "~/redux/reducers/inbox.reducer";
import { clearNotifications } from "~/redux/reducers/notifications.reducer";
import { setSettings } from "~/redux/reducers/settings.reducer";
import { setIsRefreshing, setScrollOffsetValue } from "~/redux/reducers/home.reducer";
import { logEvent, LOGOUT, DARK_MODE, OPEN_EXTERNAL_URL } from "~/services/analytics";
import { scale, logError } from "~/utils/";
import userService from "~/apiServices/user";
import axiosInstance from "~/apiServices/axiosService";

import {
    openURL,
    storeItem,
    signOut,
    deleteItem,
    retrieveItem,
    NAVIGATE_TO_FAVORITES
  } from "~/services/";
  import {
    THEME_MODE_FLAG,
    REFRESH_TOKEN_FLAG,
    JWT_TOKEN_FLAG,
    PUSH_NOTIFICATION_TOKEN
  } from "~/constants/";
const index = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { container, heading, buttonStyle, text } = styles(theme);


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

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={container}>
          <Text style={heading}>{t("deleteAcount.initiation_account_deletion")}</Text>
          <Text style={text}>
            {t("deleteAcount.initiation_account_deletion_description")}
          </Text>
          <Text style={heading}>{t("deleteAcount.confirmation_security")}</Text>
          <Text style={text}>{t("deleteAcount.confirmation_security_description")}</Text>
          <Text style={heading}>{t("deleteAcount.acount_restrictions")}</Text>

          <Text style={text}>{t("deleteAcount.acount_restrictions_description")}</Text>

          <Text style={heading}>{t("deleteAcount.confirmations")}</Text>

          <Text style={text}>{t("deleteAcount.confirmations_description")}</Text>

          <Text style={heading}>{t("deleteAcount.timeframe")}</Text>

          <Text style={text}>{t("deleteAcount.timeframe_description")}</Text>

          <Text style={heading}>{t("deleteAcount.final_notice")}</Text>

          <Text style={text}>{t("deleteAcount.final_notice_description")}</Text>

          <Text style={heading}>{t("deleteAcount.content_queries")}</Text>

          <Text style={text}>{t("deleteAcount.content")}</Text>

          <Text style={text}>{t("deleteAcount.queries")}</Text>

          <Button style={buttonStyle} title="Delete Acount" onPress={() => {
           Alert(t("delete"), t("deleta_account_message"), [
                {
                  text: t("cancel"),
                  style: "cancel"
                },
                {
                  text: t("confirm"),
                  onPress: () => {
                    handleLogout()
                  }
                }
              ]);
          }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
