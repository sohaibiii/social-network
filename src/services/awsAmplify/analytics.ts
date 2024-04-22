import Analytics from "@aws-amplify/analytics";
import { AnalyticsProvider } from "@aws-amplify/analytics/lib/types";

import { GenericObject } from "~/types/common";
import { logError } from "~/utils/errorHandler";

const logAWSEvent = async (
  eventName: string,
  eventParams: GenericObject = {},
  metrics?: GenericObject
): Promise<void> => {
  try {
    const recordParams: GenericObject = { name: eventName, attributes: eventParams };
    if (metrics) {
      recordParams.metrics = metrics;
    }
    await Analytics.record(recordParams);
  } catch (error) {
    logError(`Error: logAWSEvent --analytics.ts-- eventName=${eventName} ${error}`);
  }
};

const startSession = async (provider?: string): Promise<void> => {
  try {
    await Analytics.startSession(provider);
  } catch (error) {
    logError(`Error: startSession --analytics.ts-- provider=${provider} ${error}`);
  }
};

const stopSession = async (provider?: string): Promise<void> => {
  try {
    await Analytics.stopSession(provider);
  } catch (error) {
    logError(`Error: stopSession --analytics.ts-- provider=${provider} ${error}`);
  }
};

const addPluggable = (pluggable: AnalyticsProvider): void => {
  try {
    Analytics.addPluggable(pluggable);
  } catch (error) {
    logError(
      `Error: addPluggable --analytics.ts-- provider=${pluggable.getProviderName()} category=${pluggable.getCategory()} ${error}`
    );
  }
};
const removePluggable = (pluggable: AnalyticsProvider): void => {
  try {
    Analytics.removePluggable(pluggable);
  } catch (error) {
    logError(
      `Error: removePluggable --analytics.ts-- provider=${pluggable.getProviderName()} category=${pluggable.getCategory()} ${error}`
    );
  }
};

const getPluggable = (pluggableName: string): AnalyticsProvider | undefined => {
  try {
    return Analytics.getPluggable(pluggableName);
  } catch (error) {
    logError(
      `Error: getPluggable --analytics.ts-- pluggableName=${pluggableName} ${error}`
    );
  }
};

export {
  logAWSEvent,
  startSession,
  stopSession,
  addPluggable,
  removePluggable,
  getPluggable
};
