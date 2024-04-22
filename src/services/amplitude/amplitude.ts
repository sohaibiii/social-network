import { Amplitude } from "@amplitude/react-native";
import Config from "react-native-config";

import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

type RevenueProperties = {
  price: number;
  productId?: string;
  quantity?: number;
  revenueType?: string;
  receipt?: string;
  receiptSignature?: string;
  eventProperties?: GenericObject;
};

const initializeAmplitude = () => {
  try {
    const ampInstance = Amplitude.getInstance();
    ampInstance.init(Config.AMPLITUDE_API_KEY);
  } catch (error) {
    logError(`Error: initializeAmplitude --amplitude.ts-- ${error}`);
  }
};

const setAmplitudeUserId = (userId: string) => {
  try {
    Amplitude.getInstance().setUserId(userId);
  } catch (error) {
    logError(`Error: setAmplitudeUserId --amplitude.ts-- userId=${userId} ${error}`);
  }
};
const logAmplitudeEvent = (eventName: string, eventParams: GenericObject = {}): void => {
  try {
    Amplitude.getInstance().logEvent(eventName, eventParams);
  } catch (error) {
    logError(`Error: logAmplitudeEvent --amplitude.ts-- eventName=${eventName} ${error}`);
  }
};

const setAmplitudeUserAttributes = (userProperties: GenericObject = {}): void => {
  try {
    Amplitude.getInstance().setUserProperties(userProperties);
  } catch (error) {
    logError(`Error: setAmplitudeUserAttributes --amplitude.ts-- ${error}`);
  }
};

const logAmplitudeRevenue = (revenueProperties: RevenueProperties): void => {
  try {
    Amplitude.getInstance().logRevenue(revenueProperties);
  } catch (error) {
    logError(`Error: logAmplitudeRevenue --amplitude.ts-- ${error}`);
  }
};

export {
  initializeAmplitude,
  setAmplitudeUserId,
  logAmplitudeRevenue,
  setAmplitudeUserAttributes,
  logAmplitudeEvent
};
