import crashlytics from "@react-native-firebase/crashlytics";

import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const setCrashlyticsUserId = async (userId: string) => {
  try {
    await crashlytics().setUserId(userId);
  } catch (error) {
    logError(`Error in setCrashlyticsUserId ${error}`);
  }
};

const setCrashlyticsAttributes = async (attributes: GenericObject) => {
  try {
    await crashlytics().setAttributes(attributes);
  } catch (error) {
    logError(`Error in setCrashlyticsUserId ${error}`);
  }
};

const recordErrorCrashlytics = async (error: any) => {
  try {
    await crashlytics().recordError(error);
  } catch (error) {
    logError(`Error in setCrashlyticsUserId ${error}`);
  }
};

export { setCrashlyticsUserId, setCrashlyticsAttributes, recordErrorCrashlytics };
