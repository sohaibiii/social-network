import React, { useMemo, useCallback, memo, useEffect } from "react";
import { View } from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import style from "./TabBar.style";

import { RootState } from "~/redux/store";

import { BottomTabButton } from "~/components/common";
import { APP_SCREEN_WIDTH, isRTL } from "~/constants/";
import defaults from "~/constants/defaults";
import { flatListRef } from "~/containers/home/Home";
import { profileTabFlatListRef } from "~/containers/profile/Profile";
import { logEvent, FOOTER_TAB_PRESSED, SCROLL_TO_TOP } from "~/services/analytics";
import { logError, moderateScale, verticalScale } from "~/utils/";

const TabBar = memo(
  ({ state, descriptors, navigation }: BottomTabBarProps): JSX.Element => {
    const isThemeDark = useSelector(
      (reduxState: RootState) => reduxState.settings.isThemeDark
    );

    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const offset = useSharedValue(0);

    const connectionStatusIsVisible = useSelector(
      (state: RootState) => state.connectionStatus.isVisible
    );
    const tabWidth = useMemo(
      () => APP_SCREEN_WIDTH / state.routes.length,
      [state.routes.length]
    );
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offset.value }]
      };
    });

    const animateSlider = useCallback(
      (index: number) => {
        offset.value = withSpring((isRTL ? -1 : 1) * (index * tabWidth), {
          velocity: 1000,
          damping: 15,
          stiffness: 150,
          restSpeedThreshold: 10
        });
      },
      [offset, tabWidth]
    );

    const {
      containerDark,
      containerLight,
      tabContainer,
      slider,
      buttonContainer,
      buttonsContainer
    } = useMemo(
      () => style(theme, !!isThemeDark, insets.bottom),
      [isThemeDark, theme, insets.bottom]
    );

    const hasBottomSafeArea = !!insets.bottom;

    const insetOffset = useSharedValue(insets.bottom);

    const containerStyle = useMemo(
      () => (isThemeDark ? containerDark : containerLight),
      [containerDark, containerLight, isThemeDark]
    );

    useEffect(() => {
      const targetValue = connectionStatusIsVisible
        ? verticalScale(10)
        : hasBottomSafeArea
        ? insets.bottom
        : 0;
      insetOffset.value = withTiming(targetValue, {
        duration: 500
      });
    }, [connectionStatusIsVisible, hasBottomSafeArea, insetOffset, insets.bottom]);

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        height: defaults.TAB_BAR_HEIGHT + insetOffset.value
      };
    });

    const animatedContainerViewStyle = useMemo(
      () => [containerStyle, animatedContainerStyle],
      [animatedContainerStyle, containerStyle]
    );

    const animatedTabStyle = useMemo(
      () => [
        slider,
        animatedStyles,
        {
          width: tabWidth - 20
        }
      ],
      [animatedStyles, slider, tabWidth]
    );

    const onPress = useCallback(
      async (isFocused, name, index) => {
        if (!isFocused) {
          await logEvent(FOOTER_TAB_PRESSED, { route_name: name });
          return navigation.dispatch(CommonActions.navigate({ name }));
        }
        if (name === "Home") {
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          await logEvent(SCROLL_TO_TOP, { route_name: name, offset: 0 });
        }
        if (name === "MyProfile") {
          profileTabFlatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          await logEvent(SCROLL_TO_TOP, { route_name: name, offset: 0 });
        }
      },
      [navigation]
    );

    useEffect(() => {
      const unsubscribe = navigation.addListener("state", e => {
        try {
          animateSlider(navigation?.getState()?.index ?? 0);
        } catch (error) {
          logError(
            `Error: animateSlider --TabBar.tsx-- index=${
              navigation?.getState()?.index ?? 0
            } ${error}`
          );
        }
      });
      return unsubscribe;
    }, [navigation, animateSlider]);

    return (
      <Animated.View style={animatedContainerViewStyle}>
        <View style={tabContainer}>
          <Animated.View style={animatedTabStyle} />
          <View style={buttonsContainer}>
            {state.routes.map((route, index) => {
              const { key, name } = route;
              const { tabBarIcon, tabBarLabel } = descriptors[key].options;
              const isFocused = state.index === index;
              if (!tabBarIcon) {
                return <></>;
              }
              const handleOnPress = () => onPress(isFocused, name, index);
              return (
                <View key={key} style={buttonContainer}>
                  <BottomTabButton
                    onPress={handleOnPress}
                    text={`${tabBarLabel}`}
                    isFocused={isFocused}
                    isThemeDark={isThemeDark}
                  >
                    {tabBarIcon({
                      focused: isFocused,
                      color: isThemeDark
                        ? theme.colors.primary
                        : theme.colors.primary_blue,
                      size: moderateScale(30)
                    })}
                  </BottomTabButton>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  }
);
TabBar.displayName = "TabBar";
export { TabBar };
