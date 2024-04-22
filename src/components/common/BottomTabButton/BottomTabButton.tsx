import React, { useEffect, memo } from "react";
import { Pressable, View } from "react-native";

import isEqual from "react-fast-compare";
import { useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from "react-native-reanimated";

import bottomTabButtonStyle from "./BottomTabButton.style";
import { BottomTabButtonType } from "./BottomTabButton.types";

import { CText } from "~/components/";

const INITIAL_SCALE = 1;
const FINAL_SCALE = 1.1;

export const BottomTabButton = (props: BottomTabButtonType): JSX.Element => {
  const theme = useTheme();
  const {
    onPress = () => {},
    shouldRotate = false,
    children,
    text = "",
    isFocused = false,
    testID = "",
    isThemeDark = false,
    ...restOfProps
  } = props;
  const pulseAnimation = useSharedValue(INITIAL_SCALE);
  const rotateAnimation = useSharedValue(0);
  const translateAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnimation.value },
        { translateY: -translateAnimation.value },
        { rotate: `${rotateAnimation.value}deg` }
      ]
    };
  });

  useEffect(() => {
    if (shouldRotate) {
      return;
    }
    pulseAnimation.value = withTiming(isFocused ? FINAL_SCALE : INITIAL_SCALE, {
      duration: 200
    });
  }, [isFocused, pulseAnimation, shouldRotate]);

  const handleAnimateButton = () => {
    if (
      !(pulseAnimation.value === INITIAL_SCALE || pulseAnimation.value === FINAL_SCALE)
    ) {
      return;
    }
    if (shouldRotate) {
      rotateAnimation.value = withSpring(rotateAnimation.value === 0 ? 45 : 0, {
        velocity: 500
      });
    }
    pulseAnimation.value = withRepeat(
      withTiming(!isFocused ? FINAL_SCALE : INITIAL_SCALE, { duration: 150 }),
      2,
      true
    );
    onPress();
  };

  const { labelFocused, labelUnfocused, container, buttonContainer } =
    bottomTabButtonStyle(theme, isThemeDark);

  return (
    <Pressable
      style={container}
      onPress={handleAnimateButton}
      testID={testID}
      {...restOfProps}
    >
      <View style={buttonContainer}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
        <CText fontSize={11} style={isFocused ? labelFocused : labelUnfocused}>
          {text}
        </CText>
      </View>
    </Pressable>
  );
};
export default memo(BottomTabButton, isEqual);
