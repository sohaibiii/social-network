import React, { useEffect } from "react";
import { Pressable } from "react-native";

import { useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AnimatedRatingComponentProps } from "./AnimatedRatingComponent.types";

import { isRTL } from "~/constants/";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedRatingComponent = (props: AnimatedRatingComponentProps): JSX.Element => {
  const { colors } = useTheme();
  const {
    isChecked = false,
    type = "heart",
    size = 30,
    testID = "",
    style,
    currentRating,
    onPress = () => undefined,
    ...restOfProps
  } = props;
  const pulseAnimation = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateAnimation.value}deg` },
        { scale: pulseAnimation.value }
      ]
    };
  });

  const handleOnPressed = () => {
    onPress();
  };

  useEffect(() => {
    if (isChecked) {
      const rotateAmount = isRTL ? -72 : 72;
      rotateAnimation.value = withTiming(rotateAnimation.value + rotateAmount, {
        duration: 500
      });
      pulseAnimation.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [isChecked, pulseAnimation, currentRating, rotateAnimation]);

  return (
    <AnimatedPressable onPress={handleOnPressed} style={[style, animatedStyles]}>
      <Icon
        name={type}
        size={size}
        color={isChecked ? colors.orange : colors.gray}
        testID={testID}
        {...restOfProps}
      />
    </AnimatedPressable>
  );
};

export default AnimatedRatingComponent;
