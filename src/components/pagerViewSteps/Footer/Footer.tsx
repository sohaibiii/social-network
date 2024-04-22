import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import footerStyles from "./Footer.style";
import { FooterProps } from "./Footer.types";

import { Button } from "~/components/";
import { APP_SCREEN_WIDTH } from "~/constants/";

const Footer = (props: FooterProps): JSX.Element => {
  const {
    onPreviousPressed = () => undefined,
    onNextPressed = () => undefined,
    onFinishPressed = () => undefined,
    currentPage = 0,
    numberOfPages = 5,
    isNextDisabled,
    lastButtonLabel = ""
  } = props;

  const { colors } = useTheme();
  const currentProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    containerStyle,
    progressBackgroundStyle,
    nextButtonStyle,
    disabledNextButtonStyle,
    progressStyle,
    backButtonStyle,
    nextButtonTextStyle,
    backButtonTextStyle,
    nextButtonContainerStyle,
    buttonsContainerStyle
  } = footerStyles(colors, insets, currentPage);

  useEffect(() => {
    currentProgress.value = withTiming(
      ((currentPage + 1) * APP_SCREEN_WIDTH) / numberOfPages,
      {
        duration: 400
      }
    );
  }, [currentPage, currentProgress, numberOfPages]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: currentProgress.value
    };
  });

  const progressStyles = [animatedStyles, progressStyle];
  const isLastPage = currentPage >= numberOfPages - 1;

  return (
    <View style={containerStyle}>
      <Animated.View style={progressStyles} />
      <View style={progressBackgroundStyle} />

      <View style={buttonsContainerStyle}>
        {currentPage > 0 && (
          <TouchableOpacity style={backButtonStyle} onPress={onPreviousPressed}>
            <Text style={backButtonTextStyle}>{t("previous")}</Text>
          </TouchableOpacity>
        )}
        <View style={nextButtonContainerStyle}>
          <Button
            labelStyle={nextButtonTextStyle}
            style={isNextDisabled ? disabledNextButtonStyle : nextButtonStyle}
            disabled={isNextDisabled}
            title={isLastPage ? lastButtonLabel : t("next")}
            onPress={isLastPage ? onFinishPressed : onNextPressed}
          />
        </View>
      </View>
    </View>
  );
};

export default Footer;
