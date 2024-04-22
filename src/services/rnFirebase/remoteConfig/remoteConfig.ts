import remoteConfig, {
  FirebaseRemoteConfigTypes
} from "@react-native-firebase/remote-config";

import { logError } from "~/utils/";

const setRemoteConfigSettings = (
  configSetting: FirebaseRemoteConfigTypes.ConfigSettings
): Promise<void> => {
  return remoteConfig().setConfigSettings(configSetting);
};
const setRemoteConfigDefaults = (
  defaultConfig: FirebaseRemoteConfigTypes.ConfigDefaults
): Promise<null> => {
  return remoteConfig().setDefaults(defaultConfig);
};
const fetchAllRemoteConfig =
  (): Promise<FirebaseRemoteConfigTypes.ConfigValues | void> => {
    return remoteConfig()
      .fetchAndActivate()
      .then(() => {
        return remoteConfig().getAll();
      })
      .catch(error => {
        logError(`Error: fetchAllRemoteConfig --remoteConfig.ts-- ${error}`);
      });
  };

export { setRemoteConfigSettings, setRemoteConfigDefaults, fetchAllRemoteConfig };
