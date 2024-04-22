import analytics from "@react-native-firebase/analytics";

import { GenericObject } from "~/types/common";
import { logError } from "~/utils/errorHandler";

const logFirebaseEvent = async (
  eventName: string,
  eventParams: GenericObject
): Promise<void> => {
  try {
    await analytics().logEvent(eventName, eventParams);
  } catch (error) {
    logError(
      `Error: logFirebaseEvent --analytics_index.ts-- eventName=${eventName} ${error}`
    );
  }
};

const logScreenView = async (screenName: string, screenClass: string) => {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass
    });
  } catch (error) {
    logError(
      `Error: logScreenView --analytics_index.ts-- screenName=${screenName} screenClass=${screenClass} ${error}`
    );
  }
};

export { logFirebaseEvent, logScreenView };
