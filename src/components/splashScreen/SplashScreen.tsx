import React, { useEffect, useState } from "react";
import { View } from "react-native";

import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import RNBootSplash from "react-native-bootsplash";
import { useTheme, Text, ProgressBar } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withDelay
} from "react-native-reanimated";

import { CText } from "../common";

import styles from "./SplashScreen.style";
import { SplashScreenProps } from "./SplashScreen.types";

import LOTTIE from "~/assets/lottie/";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { verticalScale } from "~/utils/responsivityUtil";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const SplashScreen = (props: SplashScreenProps) => {
  const { isLoading, additionalText, forceUpdaterPercentage, isCodePushUpdate } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const [showLottie, setShowLottie] = useState(false);
  const offset = useSharedValue(0);
  const sloganOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -offset.value }, { scale: 0.9 }],
      height: 200, 
      width: 300
    };
  });

  const sloganAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: sloganOpacity.value
    };
  });

  useEffect(() => {
    sloganOpacity.value = withDelay(
      1000,
      withTiming(1, { duration: 500 }, isCompleted => {
        runOnJS(handleSloganCallback)(true);
      })
    );
  }, [sloganOpacity]);
  const handleSloganCallback = () => {
    setShowLottie(true);
  };
  useEffect(() => {
    RNBootSplash.hide({ fade: true }); // fade
    offset.value = withTiming(verticalScale(60), { duration: 1000 });
  }, []);

  const {
    bootSplashContainer,
    bootSplashLogoStyle,
    additionalTextStyle,
    sloganWrapperStyle,
    worldLottieStyle,
    displayFlex,
    forceUpdateWrapperStyles,
    forceUpdateProgressBarStyle,
    forceUpdateProgressBarWrapperStyle
  } = styles(theme);

  const backgroundStyle = bootSplashContainer;
  const animatedImageStyle = [bootSplashLogoStyle, animatedStyles];
  const sloganContainerStyles = [
    sloganWrapperStyle,
    { top: APP_SCREEN_HEIGHT / 2 - verticalScale(80) },
    sloganAnimatedStyles,
    displayFlex
  ];

  return (
    <View style={backgroundStyle}>
      <AnimatedLottieView
        source={LOTTIE.logo_animation}
        autoPlay
        loop={false}
        style={animatedImageStyle}
        speed={1.5}
        
      />
      {isCodePushUpdate ? (
        <View style={forceUpdateWrapperStyles}>
          <CText fontSize={14}>{t("force_update_additional_text_1")}</CText>
          <View style={forceUpdateProgressBarWrapperStyle}>
            <ProgressBar
              progress={forceUpdaterPercentage}
              style={forceUpdateProgressBarStyle}
            />
            <CText textAlign="center">
              {Number(forceUpdaterPercentage * 100).toFixed(0)}%
            </CText>
          </View>
          <CText fontSize={11}>{t("force_update_additional_text_2")}</CText>
        </View>
      ) : (
        <>
          <Animated.View style={sloganContainerStyles}>
       
            <LottieView
              source={LOTTIE.safarway_loading}
              autoPlay
              loop
              style={[worldLottieStyle, { height: 200, width: 100 }]}
            />
          </Animated.View>
          {showLottie && !!additionalText && (
            <Text style={additionalTextStyle}>{additionalText}</Text>
          )}
        </>
      )}
    </View>
  );
};

export default SplashScreen;
