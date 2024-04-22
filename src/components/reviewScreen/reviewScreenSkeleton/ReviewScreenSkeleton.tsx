import React, { FC } from "react";
import { View } from "react-native";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import reviewScreenSkeletonStyle from "./reviewScreenSkeleton.styles";

import { isRTL } from "~/constants/variables";

const ReviewScreenSkeleton: FC = () => {
  const direction = isRTL ? "left" : "right";

  const { colors } = useTheme();
  const {
    root,
    imageStyle,
    flexStyle,
    headerContainer,
    titleStyle,
    starsStyle,
    reviewStyle1,
    reviewStyle2
  } = reviewScreenSkeletonStyle;

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <View style={root}>
        <View style={imageStyle} />

        <View style={flexStyle}>
          <View style={headerContainer}>
            <View style={flexStyle}>
              <View style={titleStyle} />
            </View>

            <View style={starsStyle} />
          </View>

          <View style={reviewStyle1} />
          <View style={reviewStyle2} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export { ReviewScreenSkeleton };
