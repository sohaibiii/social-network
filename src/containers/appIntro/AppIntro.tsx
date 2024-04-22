import React, { useState, useRef } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, I18nManager } from "react-native";

import { useTranslation } from "react-i18next";
import AppIntroSlider from "react-native-app-intro-slider";
import { useTheme } from "react-native-paper";
import RNRestart from "react-native-restart";
import { useSelector, useDispatch } from "react-redux";

import styles from "./AppIntro.styles";
import { SliderItemType } from "./AppIntro.types";

import { RootState } from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import IMAGES from "~/assets/images";
import FLAGS from "~/assets/images/flags";
import { CText, Icon, IconTypes, Button } from "~/components/common";
import { LANGUAGE_FLAG, IS_CHANGING_LANGUAGE, APP_INTRO_FLAG } from "~/constants/";
import { setSettings } from "~/redux/reducers/settings.reducer";
import { storeItem } from "~/services/";
import {
  logEvent,
  INTRO_SCREEN_SELECTED_LANGUAGE,
  INTRO_SCREEN
} from "~/services/analytics";
import { logError } from "~/utils/";
import { scale } from "~/utils/responsivityUtil";

const AppIntro = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const sliderRef = useRef();

  const LAGUAGES = [
    { id: "english", label: t("english"), flagCode: "GB", value: "en" },
    { id: "arabic", label: t("arabic"), flagCode: "SA", value: "ar" },
    { id: "french", label: t("french"), flagCode: "FR", value: "fr" },
    { id: "persian", label: t("Persian"), flagCode: "IR", value: "fa" },
    { id: "indonesian", label: t("Indonesian"), flagCode: "ID", value: "id" },
    { id: "hindi", label: t("Hindi"), flagCode: "IN", value: "hi" },
    { id: "turkish", label: t("Turkish"), flagCode: "TR", value: "tr" }
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedLanguage, setselectedLanguage] = useState("en");

  const handleSelectLanguage = async value => {
    await logEvent(INTRO_SCREEN_SELECTED_LANGUAGE, { selectLanguage: value });
    setselectedLanguage(value);
  };

  const handleContinue = () => {
    setSlideIndex(1);
    sliderRef.current.goToSlide(1);
  };

  const slides = [
    {
      key: "one",
      title: "Title 1",
      text: "Description.\nSay something cool",
      icon: "intro_bg",
      renderSlide: () => {
        return (
          <View style={selectLanguageWrapperStyle}>
            <CText fontFamily="medium" color="black" style={selectLanguageTextStyle}>
              {t("intro_select_language", { lng: selectedLanguage })}
            </CText>
            {LAGUAGES.map(item => {
              const { id, label, flagCode, value } = item;
              const isSelected = value === selectedLanguage;

              return (
                <TouchableOpacity
                  style={isSelected ? languageItemSelectedStyle : languageItemStyle}
                  key={id}
                  onPress={() => handleSelectLanguage(value)}
                >
                  <View style={flagWrapperStyle}>
                    <Image source={FLAGS[flagCode]} style={flagIconStyle} />
                    <CText fontSize={14} fontFamily="medium">
                      {label}
                    </CText>
                  </View>

                  <Icon
                    type={IconTypes.FONTISTO}
                    name={isSelected ? "radio-btn-active" : "radio-btn-passive"}
                    size={scale(20)}
                    color={isSelected ? theme.colors.primary : theme.colors.lightGray}
                  />
                </TouchableOpacity>
              );
            })}
            <Button
              mode="contained"
              title={t("continue", { lng: selectedLanguage })}
              labelStyle={continueLabelStyle}
              onPress={handleContinue}
              style={continueButtonStyle}
            />
          </View>
        );
      }
    },
    {
      key: "two",
      title: t("intro_page1_title", { lng: selectedLanguage }),
      text: t("intro_page1_paragraph", { lng: selectedLanguage }),
      icon: "intro_trips"
    },
    {
      key: "three",
      title: t("intro_page2_title", { lng: selectedLanguage }),
      text: t("intro_page2_paragraph", { lng: selectedLanguage }),
      icon: "intro_points"
    },
    {
      key: "four",
      title: t("intro_page3_title", { lng: selectedLanguage }),
      text: t("intro_page3_paragraph", { lng: selectedLanguage }),
      icon: "intro_explorer"
    },
    {
      key: "five",
      title: t("intro_page4_title", { lng: selectedLanguage }),
      text: t("intro_page4_paragraph", { lng: selectedLanguage }),
      icon: "intro_hotels"
    },
    {
      key: "six",
      title: t("intro_page5_title", { lng: selectedLanguage }),
      text: t("intro_page5_paragraph", { lng: selectedLanguage }),
      icon: "intro_followers"
    },
    {
      key: "seven",
      title: t("intro_page6_title", { lng: selectedLanguage }),
      text: t("intro_page6_paragraph", { lng: selectedLanguage }),
      icon: "intro_survey"
    }
  ];

  const {
    safeareaviewStyle,
    flexGrow,
    titleStyle,
    paragraphStyle,
    wrapperStyle,
    iconStyle,
    activeDotStyle,
    continueLabelStyle,
    continueButtonStyle,
    languageItemStyle,
    flagIconStyle,
    flagWrapperStyle,
    selectLanguageWrapperStyle,
    languageItemSelectedStyle,
    topWrapperStyle,
    skipTextStyle,
    fullIconStyle,
    headerTextWrapperStyle,
    welcomeTextStyle,
    logoStyle,
    selectLanguageTextStyle
  } = styles(theme);

  const _renderItem = ({ item }: SliderItemType) => {
    return (
      <View style={flexGrow}>
        <View style={topWrapperStyle}>
          {slideIndex === 0 ? (
            <Image source={IMAGES.intro_bg} style={fullIconStyle} />
          ) : (
            <Icon type={IconTypes.SAFARWAY_ICONS} name={item.icon} style={iconStyle} />
          )}

          {item.renderSlide ? (
            <View style={headerTextWrapperStyle}>
              <CText
                fontFamily="medium"
                textAlign="center"
                color="black"
                style={welcomeTextStyle}
              >
                {t("intro_welcome_to", { lng: selectedLanguage })}
              </CText>
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                name={"safarway_logo"}
                style={logoStyle}
                startColor={theme.colors.primary}
                endColor={theme.colors.primary_blue}
              />
            </View>
          ) : null}
        </View>
        <View style={wrapperStyle}>
          {item.renderSlide ? (
            item.renderSlide()
          ) : (
            <>
              <CText
                textAlign="center"
                color="black"
                fontFamily="medium"
                style={titleStyle}
              >
                {item.title}
              </CText>
              <CText textAlign="center" fontSize={14} style={paragraphStyle}>
                {item.text}
              </CText>
            </>
          )}
        </View>
      </View>
    );
  };

  const handleFinishIntro = async () => {
    try {
      await logEvent(INTRO_SCREEN, { finishIntro: true });
      await storeItem(APP_INTRO_FLAG, true);
      await storeItem(IS_CHANGING_LANGUAGE, true);
      dispatch(setSettings({ language: selectedLanguage }));
      axiosInstance.defaults.headers.common.language = selectedLanguage;

      if (selectedLanguage === "en" || selectedLanguage === "fr") {
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
      } else {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
      }
      await storeItem(LANGUAGE_FLAG, selectedLanguage);
      RNRestart.Restart();
    } catch (error) {
      logError(
        `Error: handleFinishIntro --AppIntro.tsx-- selectedLanguage=${selectedLanguage} ${error}`
      );
    }
  };

  const _renderSkipButton = () => {
    return (
      <CText textAlign="center" color="black" style={skipTextStyle}>
        {t("skip", { lng: selectedLanguage })}
      </CText>
    );
  };

  const _renderDoneButton = () => {
    return (
      <Button
        mode="contained"
        title={t("continue", { lng: selectedLanguage })}
        labelStyle={continueLabelStyle}
        onPress={handleFinishIntro}
        style={continueButtonStyle}
      />
    );
  };

  const handleOnSlideChange = async (index: number, lastIndex: number) => {
    await logEvent(INTRO_SCREEN, { pageIndex: index });

    setSlideIndex(index);
  };

  const handleOnSkip = async () => {
    await logEvent(INTRO_SCREEN, { skip: true });
    setSlideIndex(slides.length - 1);
    sliderRef.current.goToSlide(slides.length - 1);
  };

  const renderEmptyView = () => <View />;

  return (
    <SafeAreaView style={safeareaviewStyle}>
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        showNextButton={false}
        showSkipButton={slideIndex !== 0}
        renderPagination={slideIndex !== 0 ? undefined : renderEmptyView}
        dotClickEnabled={false}
        bottomButton
        activeDotStyle={activeDotStyle}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
        onSlideChange={handleOnSlideChange}
        onSkip={handleOnSkip}
        ref={sliderRef}
      />
    </SafeAreaView>
  );
};

export default AppIntro;
