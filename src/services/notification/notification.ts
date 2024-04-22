import { Platform } from "react-native";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import { notificationHandler, notificationReceivedHandler } from "./notificationHandler";

import store from "~/redux/store";

import { setPushNotificationToken } from "~/redux/reducers/auth.reducer";
import { logError } from "~/utils/";

export const initializePushNotification =
  (): //   handleNotification: (notification: any) => void
  void => {
    PushNotification.createChannel(
      {
        channelId: "Safarway",
        channelName: "Safarway",
        channelDescription: "Safarway Notifications"
      },
      created => {}
    );
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        !!token && store.dispatch(setPushNotificationToken(token));
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // process the notification
        if (notification.userInteraction) {
          notificationHandler(notification);
        } else {
          notificationReceivedHandler(notification);
        }
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (error) {
        logError(`Error: onRegistrationError --notification.ts-- ${error}`);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true
    });
  };
