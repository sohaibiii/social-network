import React from "react";
import { Image, View, I18nManager, SafeAreaView, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";
import RNRestart from "react-native-restart";
import { useSelector, useDispatch } from "react-redux";

import { styles } from "./ChangeLanguage.styles";

import { RootState } from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import FLAGS from "~/assets/images/flags";
import { CText, Icon, IconTypes, showAlert } from "~/components/common";
import { LANGUAGE_FLAG, IS_CHANGING_LANGUAGE } from "~/constants/";
import { setSettings } from "~/redux/reducers/settings.reducer";
import { storeItem } from "~/services/";
import { logEvent, SELECTED_LANGUAGE } from "~/services/analytics";
import { scale } from "~/utils/";

const ChangeLanguage = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.settings.language);

  const LAGUAGES = [
    { id: "english", label: t("english"), flagCode: "GB", value: "en" },
    { id: "arabic", label: t("arabic"), flagCode: "SA", value: "ar" },
    { id: "french", label: t("french"), flagCode: "FR", value: "fr" },
    { id: "persian", label: t("persian"), flagCode: "IR", value: "fa" },
    { id: "indonesian", label: t("indonesian"), flagCode: "ID", value: "id" },
    { id: "hindi", label: t("hindi"), flagCode: "IN", value: "hi" },
    { id: "turkish", label: t("turkish"), flagCode: "TR", value: "tr" }
  ];

  const onToggleLanguageSwitch = async (lang: string) => {
    await storeItem(IS_CHANGING_LANGUAGE, true);
    dispatch(setSettings({ language: lang }));
    axiosInstance.defaults.headers.common.language = lang;

    if (lang === "en" || lang === "fr") {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    } else {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
    await storeItem(LANGUAGE_FLAG, lang);
    await logEvent(SELECTED_LANGUAGE, { selectLanguage: lang });
    RNRestart.Restart();
  };

  const handleLanguageChange = (language: string) => {
    showAlert("", t("app_will_restart", { lng: language }), [
      {
        text: t("continue", { lng: language }),
        onPress: () => onToggleLanguageSwitch(language)
      },
      {
        text: t("cancel", { lng: language })
      }
    ]);
  };
  const {
    primaryTextStyle,
    secondaryTextStyle,
    safeareaStyle,
    languageIconStyle,
    contaierView,
    languageItemStyle,
    flagIconStyle,
    flagWrapperStyle,
    languagesWrapperStyle,
    labelTextStyle,
    checkIconStyle
  } = styles(theme);

  return (
    <SafeAreaView style={safeareaStyle}>
      <View style={contaierView}>
        <Icon
          type={IconTypes.FONTAWESOME}
          name={"language"}
          size={scale(100)}
          color={theme.colors.gray}
          style={languageIconStyle}
        />
        <View>
          <Text style={primaryTextStyle}>{t("choose_preferred_language")}</Text>
          <Text style={secondaryTextStyle}>{t("select_your_language")}</Text>
        </View>
        <View style={languagesWrapperStyle}>
          {LAGUAGES.map(({ id, label, flagCode, value }) => {
            return (
              <TouchableOpacity
                style={languageItemStyle}
                key={id}
                onPress={() => handleLanguageChange(value)}
                disabled={value === language}
              >
                <View style={flagWrapperStyle}>
                  <Image source={FLAGS[flagCode]} style={flagIconStyle} />
                </View>
                <CText fontSize={14} style={labelTextStyle}>
                  {label}
                </CText>
                {value === language && (
                  <Icon
                    type={IconTypes.ENTYPO}
                    name={"check"}
                    size={scale(20)}
                    color={theme.colors.accent}
                    style={checkIconStyle}
                    disabled
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeLanguage;
