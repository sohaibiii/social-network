import React from "react";
import { View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./ArticleListSkeleton.styles";

import { isRTL } from "~/constants/";

const ArticleListSkeleton = (): JSX.Element => {
  const { colors } = useTheme();

  const { container, nameContainer, imageContainer, topBar, badgeStyle, bottomBar } =
    styles;
  const direction = isRTL ? "left" : "right";

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <View style={container(colors)}>
        <View style={imageContainer} />
        <View style={badgeStyle} />
        <View style={nameContainer}>
          <Text style={topBar} />
        </View>
        <View>
          <Text style={bottomBar} />
          <Text style={bottomBar} />
          <Text style={bottomBar} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default ArticleListSkeleton;
