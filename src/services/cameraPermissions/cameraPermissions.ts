import { Linking } from "react-native";

import {
  PERMISSIONS,
  RESULTS,
  request,
  PermissionStatus
} from "react-native-permissions";

import { showAlert } from "~/components/";
import { PLATFORM } from "~/constants/variables";
import { i18n } from "~/translations/";
import { logError } from "~/utils/";

export const openAppSettings = () => {
  if (PLATFORM === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};
export const requestGalleryPermissions = async () => {
  try {
    let result: PermissionStatus;
    if (PLATFORM === "ios") {
      result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    } else {
      result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
    if (result === RESULTS.BLOCKED) {
      showAlert(i18n.t("permissions.title"), i18n.t("permissions.gallery_description"), [
        {
          text: i18n.t("permissions.go_to_settings"),
          onPress: openAppSettings
        },
        {
          text: i18n.t("permissions.cancel")
        }
      ]);
    }

    return (
      result === RESULTS.GRANTED || (PLATFORM === "ios" && result === RESULTS.LIMITED)
    );
  } catch (error) {
    logError(`Error: requestGalleryPermissions --cameraPermissions.ts-- ${error}`);
  }
};

export const requestCameraPermission = async () => {
  try {
    let result: PermissionStatus;
    if (PLATFORM === "ios") {
      result = await request(PERMISSIONS.IOS.CAMERA);
    } else {
      result = await request(PERMISSIONS.ANDROID.CAMERA);
    }
    if (result === RESULTS.BLOCKED) {
      showAlert(i18n.t("permissions.title"), i18n.t("permissions.camera_description"), [
        {
          text: i18n.t("permissions.go_to_settings"),
          onPress: openAppSettings
        },
        {
          text: i18n.t("permissions.cancel")
        }
      ]);
    }
    return result === RESULTS.GRANTED;
  } catch (error) {
    logError(`Error: requestCameraPermission --cameraPermissions.ts-- ${error}`);
  }
};
