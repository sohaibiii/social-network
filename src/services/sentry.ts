import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";

export const initializeSentry = async () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENVIRONMENT,
    initialScope: {
      tags: {
        saf_appVersion: DeviceInfo.getVersion(),
        saf_buildNumber: DeviceInfo.getBuildNumber(),
        saf_systemName: DeviceInfo.getSystemName(),
        saf_systemVersion: DeviceInfo.getSystemVersion(),
        saf_deviceName: await DeviceInfo.getDeviceName()
      }
    },
    ignoreErrors: ["Non-Error exception captured"],
    tracesSampleRate: 1,
    integrations: [
      new Sentry.ReactNativeTracing({
        tracingOrigins: ["localhost", Config.API_HOST, /^\//]
        // ... other options
      })
    ]
  });
};
