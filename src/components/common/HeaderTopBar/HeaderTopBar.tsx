import React, { memo, useCallback, useEffect, useMemo } from "react";
import { View, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { CText } from "../CText";
import { IconTypes, Icon } from "../Icon";

import styles from "./HeaderTopBar.styles";
import { HeaderTopBarType } from "./HeaderTopBar.types";

import { RootState } from "~/redux/store";

import { HeaderRight } from "~/components/common/";
import defaults from "~/constants/defaults";
import { TRANSLATION_Y_OFFSET } from "~/containers/home/Home";
import { navigationRef } from "~/services/navigation";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const HeaderTopBar = (props: HeaderTopBarType): JSX.Element => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const scrollOffsetValue = useSelector(
    (state: RootState) => state.home.scrollOffsetValue
  );

  const { language = "ar", isHome = false } = props;

  const scrollOffsetSharedValue = useSharedValue(0);

  useEffect(() => {
    if (navigationRef?.current?.getCurrentRoute()?.name !== "Home") {
      scrollOffsetSharedValue.value = 0;
    } else {
      scrollOffsetSharedValue.value = scrollOffsetValue;
    }
  }, [scrollOffsetValue]);

  const searchAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffsetSharedValue.value,
      [0, TRANSLATION_Y_OFFSET],
      [0, 1]
    );

    return {
      opacity,
      display: opacity === 0 ? "none" : "flex"
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffsetSharedValue.value,
      [0, TRANSLATION_Y_OFFSET],
      [1, 0]
    );

    return {
      opacity
    };
  });

  const {
    safeareaViewStyle,
    spacingStyle,
    mainContainerStyle,
    containerStyle,
    searchBarWrapperStyle,
    searchBarStyle,
    textStyle,
    iconSearchStyle,
    logoWrapperStyle,
    searchWrapperStyle,
    searchWrapperNoOpacityStyle,
    searchContainerStyle,
    safarwayIconLogoStyle
  } = useMemo(() => styles(colors, language, insets), [colors, language, insets]);

  const handleSearchPressed = useCallback(() => {
    navigation.navigate("Search");
  }, [navigation]);

  const mainViewStyle = isHome
    ? [searchWrapperStyle, searchAnimatedStyle]
    : searchWrapperNoOpacityStyle;

  const safarwayLogoStyles = isHome
    ? [logoWrapperStyle, logoAnimatedStyle]
    : logoWrapperStyle;

  return (
    <>
      <View style={spacingStyle} />
      <View style={mainContainerStyle}>
        <SafeAreaView style={safeareaViewStyle} />

        <View style={containerStyle}>
          <View style={searchContainerStyle}>
            <Animated.View style={mainViewStyle}>
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                startColor={isThemeDark ? colors.homepageItemText : colors.primary}
                endColor={isThemeDark ? colors.homepageItemText : colors.primary_blue}
                height={verticalScale(40)}
                width={scale(20)}
                name={"safarway_logo_icon"}
                style={safarwayIconLogoStyle}
              />
              <View style={searchBarWrapperStyle}>
                <TouchableOpacity
                  disabled={!isHome}
                  style={searchBarStyle}
                  onPress={handleSearchPressed}
                >
                  <Icon
                    name="search"
                    type={IconTypes.FONTISTO}
                    size={scale(14)}
                    color={isThemeDark ? colors.homepageItemText : colors.primary_blue}
                    style={iconSearchStyle}
                  />
                  <CText
                    fontSize={11}
                    color={isThemeDark ? "homepageItemText" : "primary_blue"}
                    style={textStyle}
                  >
                    {t("homepage_search_placeholder")}
                  </CText>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
          <Animated.View pointerEvents={"none"} style={safarwayLogoStyles}>
            <Icon
              disabled
              type={IconTypes.SAFARWAY_ICONS}
              startColor={colors.primary}
              endColor={colors.primary_blue}
              height={verticalScale(30)}
              width={scale(100)}
              name={"safarway_logo"}
            />
          </Animated.View>
          <HeaderRight />
        </View>
      </View>
    </>
  );
};

export default memo(HeaderTopBar);
