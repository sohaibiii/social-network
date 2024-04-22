import { SCREEN_VIEW } from "./eventNames";

import { logAmplitudeEvent, setAmplitudeUserAttributes } from "~/services/amplitude";
import { logFirebaseEvent } from "~/services/rnFirebase/analytics";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/errorHandler";

const firebaseEventNameMapper = (eventName: string) => {
  return eventName
    .replace("city_country_region", "ccr")
    .replace("favorite_items", "fi")
    .replace("related_properties", "rp")
    .replace("surrounding_landmarks", "sr")
    .replace("property_get_properties_by_location", "get_by_location")
    .replace(
      "suggest_property_get_current_location_success",
      "suggest_prop_get_current_location_suc"
    )
    .replace("property_social_action_navigate_to_add_post", "pca_navigate_to_add_post")
    .replace(
      "property_social_action_navigate_to_suggest_property",
      "pca_navigate_to_suggest_property"
    )
    .replace(
      "property_social_action_navigate_to_rate_property",
      "pca_navigate_to_rate_property"
    )
    .replace(
      "suggest_property_get_current_location_failed",
      "suggest_prop_get_current_location_fail"
    )
    .replace("my_profile", "mp")
    .replace("others_profile", "op");
};

export const logEvent = async (
  eventName: string,
  eventParams: GenericObject = {}
): Promise<void> => {
  try {
    if (__DEV__) {
      console.log(`Event: ${eventName}`, eventParams);
    } else {
      logAmplitudeEvent(eventName, eventParams);
      await logFirebaseEvent(firebaseEventNameMapper(eventName), eventParams);
    }
  } catch (error) {
    logError(`logEvent wrapper Error: ${error}`);
  }
};

export const setUserAttributes = async (userProperties: GenericObject) => {
  try {
    setAmplitudeUserAttributes(userProperties);
  } catch (error) {
    logError(`setUserAttributes wrapper Error: ${error}`);
  }
};

export const logAmplitudeScreenView = async (screenName: string, screenClass: string) => {
  try {
    logAmplitudeEvent(SCREEN_VIEW, {
      screen_name: screenName,
      screen_class: screenClass
    });
  } catch (error) {
    logError(`Error: logAmplitudeScreenView --analytics.ts-- ${error}`);
  }
};
