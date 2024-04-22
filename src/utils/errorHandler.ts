import { AlertButton } from "react-native";

import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";

import { showAlert } from "~/components/";
import {
  BAD_GATEWAY_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  UNAUTHENTICATION_ERROR
} from "~/constants/errorCodes";
import { i18n } from "~/translations/";

export const generalErrorHandler = (
  error: any,
  errorTitle: string = i18n.t("something_went_wrong"),
  errorMsg = `${i18n.t("please_try_again_or_contact")} ${Config.CONTACT_SUPPORT}`,
  alertButtons?: AlertButton[]
): void => {
  if (__DEV__) {
    console.log(error);
  } else {
    Sentry.captureException(error);
  }
  if (
    error.response &&
    error.response.status !== BAD_GATEWAY_ERROR &&
    error.response.status !== SERVICE_UNAVAILABLE_ERROR &&
    error.response.status !== UNAUTHENTICATION_ERROR
  ) {
    showAlert(errorTitle, errorMsg, alertButtons);
  }
};

export const logError = (error: string): void => {
  if (__DEV__) {
    console.log(error);
  } else {
    Sentry.captureException(error);
  }
};
