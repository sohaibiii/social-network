import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import TRANSLATIONS_AR from "./ar";
import TRANSLATIONS_EN from "./en";
import TRANSLATIONS_FR from "./fr";
import TRANSLATIONS_FA from "./fa";
import TRANSLATIONS_ID from "./id";
import TRANSLATIONS_HI from "./hi";
import TRANSLATIONS_TR from "./tr";

import { DEFAULTS } from "~/constants/";
import { logError } from "~/utils/errorHandler";
import { getSystemLocale } from "~/utils/systemUtil";

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULTS.APP_MAIN_LANGUAGE,
    resources: {
      ar: TRANSLATIONS_AR,
      en: TRANSLATIONS_EN,
      fr: TRANSLATIONS_FR,
      fa: TRANSLATIONS_FA,
      id: TRANSLATIONS_ID,
      hi: TRANSLATIONS_HI,
      tr: TRANSLATIONS_TR
    },
    compatibilityJSON: "v3",
    lng: getSystemLocale()
  })
  .catch(error => {
    logError(`Error: i18n.init --swTranslator.ts-- locale=${getSystemLocale()} ${error}`);
  });

const translate = (
  word: string | string[],
  options?: Record<string, number | string>
): string => {
  return i18n.t(word, options);
};

export default i18n;
export { translate };
