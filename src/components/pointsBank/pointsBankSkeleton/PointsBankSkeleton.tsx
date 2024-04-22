import React, { FC } from "react";
import { View } from "react-native";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import pointsBankSkeletonStyles from "./pointsBankSkeleton.styles";

import { isRTL } from "~/constants/variables";

const PointsBankSkeleton: FC = () => {
  const { colors } = useTheme();

  const direction = isRTL ? "left" : "right";

  const {
    skeletonRoot,
    skeletonContainer,
    skeletonLeftContainer,
    skeletonImage,
    skeletonName,
    skeletonRightContainer,
    skeletonPoints,
    skeletonImageCoins,
    skeletonPrize,
    skeletonDot,
    skeletonCounter
  } = pointsBankSkeletonStyles(colors);

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <View style={skeletonRoot}>
        {Array(20)
          .fill(null)
          .map((_, index) => (
            <View key={index} style={skeletonContainer}>
              <View style={skeletonLeftContainer}>
                <View style={skeletonCounter} />
                <View style={skeletonDot} />
                <View style={skeletonImage} />
                <View style={skeletonName} />
              </View>

              <View style={skeletonRightContainer}>
                <View style={skeletonPoints} />
                <View style={skeletonImageCoins} />
                {index < 3 ? <View style={skeletonPrize} /> : <></>}
              </View>
            </View>
          ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export { PointsBankSkeleton };
