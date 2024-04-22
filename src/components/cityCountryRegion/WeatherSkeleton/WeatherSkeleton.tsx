import React from "react";
import { View } from "react-native";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./WeatherSkeleton.styles";

import { isRTL } from "~/constants/";
import { scale, verticalScale } from "~/utils/";

const WeatherSkeleton = (): JSX.Element => {
  const theme = useTheme();
  const direction = isRTL ? "left" : "right";

  const { sliderItemWrapperStyle } = styles(theme);

  return (
    <View style={sliderItemWrapperStyle}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={theme.colors.skeleton.highlight}
        backgroundColor={theme.colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item width={scale(200)} height={verticalScale(40)} />
      </SkeletonPlaceholder>
    </View>
  );
};

export default WeatherSkeleton;
