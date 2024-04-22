import React, { memo } from "react";
import { View } from "react-native";

import { Card, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import hotelsListCardSkeletonStyle from "./HotelsListCardSkeleton.style";

import { isRTL } from "~/constants/";

const HotelsListCardSkeleton = (): JSX.Element => {
  const { colors } = useTheme();

  const {
    containerStyle,
    imageStyle,
    hotelDetailsStyle,
    firstTextSkeleton,
    secondTextSkeleton,
    thirdTextSkeleton
  } = hotelsListCardSkeletonStyle(colors);
  const direction = isRTL ? "left" : "right";

  return (
    <Card style={containerStyle}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item flexDirection={"row"}>
          <View style={imageStyle} />
          <View>
            <View style={firstTextSkeleton} />
            <View style={secondTextSkeleton} />
            <View style={thirdTextSkeleton} />
          </View>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Card>
  );
};
export default memo(HotelsListCardSkeleton);
