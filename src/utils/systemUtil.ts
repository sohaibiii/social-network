import { NativeModules } from "react-native";

import { DEFAULTS } from "~/constants";

const getSystemLocale = () => {
  let locale: string | undefined;
  // iOS
  if (
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    [locale] = NativeModules.SettingsManager.settings.AppleLanguages;
    // Android
  } else if (NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
  }

  if (locale === undefined || locale === "undefined") {
    return DEFAULTS.APP_MAIN_LANGUAGE;
  }

  return locale;
};

export { getSystemLocale };
