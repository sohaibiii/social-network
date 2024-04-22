import React, { useState, useMemo, memo, useCallback } from "react";
import { View, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import isEqual from "react-fast-compare";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import styles from "./ParallaxHeaderScrollView.styles";
import { ParallaxHeaderScrollViewType } from "./ParallaxHeaderScrollView.type";

import { RootState } from "~/redux/store";

import { navigationRef } from "~/services/";

const ParallaxHeaderScrollView = (props: ParallaxHeaderScrollViewType): JSX.Element => {
  const {
    children,
    stickyHeader,
    parallaxHeader,
    parallaxHeaderHeight = 0,
    stickyHeaderHeight = 0
  } = props;

  const [isScrolled, setIsScrolled] = useState(false);
  const pressed = useSharedValue(false);
  const startingPosition = parallaxHeaderHeight;
  const insets = useSafeAreaInsets();

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const y = useSharedValue(startingPosition);
  const theme = useTheme();

  const { containerStyle, stickyHeaderWrapperStyle } = useMemo(
    () => styles(theme, parallaxHeaderHeight, insets, stickyHeaderHeight),
    [theme, parallaxHeaderHeight, insets, stickyHeaderHeight]
  );

  const animatedParallaxStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: "transparent",
      overflow: "hidden",
      maxHeight: 450,
      height: parallaxHeaderHeight,
      transform: [
        {
          scale: !pressed.value
            ? withSpring(1, { damping: 20 })
            : withSpring(
                interpolate(
                  y.value,
                  [-50, -4, -0.1, 0],
                  [2.5, 1.5, 1.2, 1],
                  Extrapolate.CLAMP
                ),
                { damping: 15 }
              )
        }
      ]
    };
  });

  const animatedStickyHeaderStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: theme.colors.primary,
      height: stickyHeaderHeight,
      opacity: isScrolled
        ? withSpring(
            interpolate(
              y.value,
              [
                startingPosition - 2 * stickyHeaderHeight,
                startingPosition - stickyHeaderHeight,
                startingPosition
              ],
              [0, 0.7, 1],
              Extrapolate.CLAMP
            ),
            { damping: 15 }
          )
        : 0
    };
  });

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const value = event.nativeEvent.contentOffset.y;
      y.value = value;
    },
    [y]
  );
  /** StickyHeader is that part you want to be over the parallax header but stick to the top of the scrollview and continue during the entire scroll;
   */
  const renderStickyHeader = useCallback(() => {
    if (typeof stickyHeader !== "function") {
      return null;
    }

    return (
      <Animated.View style={animatedStickyHeaderStyles}>
        <View style={stickyHeaderWrapperStyle}>{stickyHeader()}</View>
      </Animated.View>
    );
  }, [stickyHeader, animatedStickyHeaderStyles, stickyHeaderWrapperStyle]);

  /** ParallaxHeader is normally the image or background you want to display when you’re at the beginning of the scrollview; */
  const renderParallaxHeader = useCallback(() => {
    if (typeof parallaxHeader !== "function") {
      return null;
    }

    return (
      <Animated.View style={animatedParallaxStyles}>{parallaxHeader()}</Animated.View>
    );
  }, [animatedParallaxStyles, parallaxHeader]);

  const handleonScrollBeginDrag = useCallback(() => {
    !isScrolled && setIsScrolled(true);
    pressed.value = true;
  }, [isScrolled, pressed]);

  const handleonScrollEndDrag = useCallback(() => {
    pressed.value = false;
  }, [pressed]);

  const content = useMemo(() => <>{children}</>, [children]);

  return (
    <View style={containerStyle}>
      {renderStickyHeader()}

      <ScrollView
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleonScrollBeginDrag}
        onScrollEndDrag={handleonScrollEndDrag}
        keyboardShouldPersistTaps={"handled"}
      >
        {renderParallaxHeader()}
        {content}
      </ScrollView>
    </View>
  );
};

export default memo(ParallaxHeaderScrollView, isEqual);
