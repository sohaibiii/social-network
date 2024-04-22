import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import parallaxScrollViewStyle from "./ParallaxScrollView.style";
import {
  ParallaxScrollViewType,
  ParallaxScrollViewRef,
  AnimatedScrollViewRef
} from "./ParallaxScrollView.types";

import { BackArrow } from "~/components/";
import { verticalScale } from "~/utils/";

const ParallaxScrollView: React.ForwardRefRenderFunction<
  ParallaxScrollViewRef,
  ParallaxScrollViewType
> = (props: ParallaxScrollViewType, forwardedRef): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {
    expandedHeader,
    unexpandedHeader,
    content,
    bounces = true,
    hasBackButton = false,
    contentWithInset = false,
    headerCollapsedHeight = verticalScale(48) + insets.top,
    headerExpandedHeight = verticalScale(100),
    animationSpeed = 2,
    gradientColors = ["#0f5593", "#40a7d2", "#0F3493", "#000"],
    gradientLocations = [0, 0.25, 0.75, 1],
    gradientStart = { x: 0, y: 0 },
    gradientEnd = { x: 0, y: 1 },
    headerComponent: HeaderTitle = () => <View />,
    ...restOfProps
  } = props;
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const animatedHeight = useSharedValue(headerExpandedHeight);
  const snapPosition =
    headerExpandedHeight -
    headerCollapsedHeight -
    (contentWithInset ? insets.top * 2 : 0);
  const maxInterpolateValue = snapPosition / animationSpeed;

  useEffect(() => {
    animatedHeight.value = withTiming(headerExpandedHeight - insets.bottom, {
      duration: 500
    });
  }, [animatedHeight, headerExpandedHeight, insets.bottom]);

  const scrollViewRef = useRef<AnimatedScrollViewRef>(null);

  useImperativeHandle(forwardedRef, () => ({
    scrollTo(x, y) {
      scrollViewRef?.current?.scrollTo({ x, y });
    },
    scrollToEnd() {
      scrollViewRef?.current?.scrollToEnd();
    }
  }));

  const unexpandedOpacityAnimation = (scrollYParam: Animated.SharedValue<number>) => {
    "worklet";

    return interpolate(
      scrollYParam.value,
      [0, maxInterpolateValue],
      [0, 1],
      Extrapolate.CLAMP
    );
  };

  const expandedOpacityAnimation = (scrollYParam: Animated.SharedValue<number>) => {
    "worklet";

    return interpolate(
      scrollYParam.value,
      [0, maxInterpolateValue],
      [1, 0],
      Extrapolate.CLAMP
    );
  };

  const headerHeightAnimation = (scrollYParam: Animated.SharedValue<number>) => {
    "worklet";

    return interpolate(
      scrollYParam.value,
      [0, maxInterpolateValue],
      [headerExpandedHeight - insets.bottom - insets.top, headerCollapsedHeight],
      Extrapolate.CLAMP
    );
  };

  const headerHeightStyle = useAnimatedStyle(() => {
    return {
      height: headerHeightAnimation(scrollY)
    };
  });
  const expandedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: expandedOpacityAnimation(scrollY),
      display: scrollY.value < snapPosition / 2 ? "flex" : "none"
    };
  });
  const unexpandedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: unexpandedOpacityAnimation(scrollY)
    };
  });

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const {
    flex,
    headerStyle,
    unexpandedContainerStyle,
    unexpandedHeaderStyle,
    shadowStyle,
    scrollViewStyle
  } = parallaxScrollViewStyle(
    theme,
    headerExpandedHeight,
    headerCollapsedHeight,
    insets.top
  );

  const headerStyles = [headerStyle, headerHeightStyle];
  const unexpandedContainerStyles = [unexpandedOpacityStyle, unexpandedContainerStyle];

  const shadowColors = ["rgba(0,0,0,0.15)", "transparent", "transparent"];
  const shadowLocations = [0, 2 / 3, 1];
  const snapToOffsets = [0, snapPosition];

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: animatedHeight.value
    };
  });

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: 1,
      top: animatedHeight.value - 30
    };
  });

  const handleDismissKeyboard = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y <= 0) {
      Keyboard.dismiss();
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      style={flex}
      start={gradientStart}
      end={gradientEnd}
    >
      <Animated.View style={headerStyles}>
        {hasBackButton && <BackArrow />}
        {headerCollapsedHeight > 10 && (
          <Animated.View style={unexpandedContainerStyles}>
            <Animated.View style={unexpandedHeaderStyle}>
              {unexpandedHeader}
            </Animated.View>
            <LinearGradient
              locations={shadowLocations}
              colors={shadowColors}
              style={shadowStyle}
            />
          </Animated.View>
        )}
        <Animated.View focusable={false} style={expandedOpacityStyle}>
          {expandedHeader}
        </Animated.View>
      </Animated.View>
      <Animated.View style={headerTextAnimatedStyle}>
        <HeaderTitle />
      </Animated.View>
      <Animated.ScrollView
        ref={scrollViewRef}
        snapToOffsets={snapToOffsets}
        bounces={bounces}
        snapToEnd={false}
        snapToStart={false}
        decelerationRate={"fast"}
        style={scrollViewStyle}
        onScroll={handleOnScroll}
        onMomentumScrollEnd={handleDismissKeyboard}
        onScrollEndDrag={handleDismissKeyboard}
        scrollEventThrottle={16}
        {...restOfProps}
      >
        <Animated.View style={contentAnimatedStyle}>{content}</Animated.View>
      </Animated.ScrollView>
    </LinearGradient>
  );
};

export default forwardRef(ParallaxScrollView);
