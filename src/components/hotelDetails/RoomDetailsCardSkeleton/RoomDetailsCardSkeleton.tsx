import React, { memo } from "react";
import { View } from "react-native";

import { Card, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import roomDetailsCardSkeletonStyle from "./RoomDetailsCardSkeleton.style";

import { isRTL } from "~/constants/";

const RoomDetailsCardSkeleton = (): JSX.Element => {
  const { colors } = useTheme();

  const {
    containerStyle,
    imageSkeleton,
    row,
    firstTextSkeleton,
    secondTextSkeleton,
    thirdTextSkeleton
  } = roomDetailsCardSkeletonStyle;
  const direction = isRTL ? "left" : "right";

  return (
    <View>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <View style={secondTextSkeleton} />
      </SkeletonPlaceholder>
      <Card style={containerStyle}>
        <View style={row}>
          <SkeletonPlaceholder
            direction={direction}
            highlightColor={colors.skeleton.highlight}
            backgroundColor={colors.skeleton.background}
          >
            <View style={imageSkeleton} />
          </SkeletonPlaceholder>
          <View>
            <SkeletonPlaceholder
              direction={direction}
              highlightColor={colors.skeleton.highlight}
              backgroundColor={colors.skeleton.background}
            >
              <View style={firstTextSkeleton} />
              <View style={secondTextSkeleton} />
              <View style={thirdTextSkeleton} />
            </SkeletonPlaceholder>
          </View>
        </View>
      </Card>
    </View>
  );
};
export default memo(RoomDetailsCardSkeleton);
