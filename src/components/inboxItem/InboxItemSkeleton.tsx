import React from "react";
import { View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./InboxItemSkeleton.style";

import { isRTL } from "~/constants/";

const InboxItemSkeleton = (): JSX.Element => {
  const { colors } = useTheme();

  const {
    container,
    nameContainer,
    titleStyle,
    checkboxStyle,
    flex,
    badgeStyle,
    bottomBar
  } = styles;
  const direction = isRTL ? "left" : "right";

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <View style={container}>
        <Text style={checkboxStyle} />
        <View style={flex}>
          <View style={nameContainer}>
            <Text style={titleStyle} />
            <View style={badgeStyle} />
          </View>
          <Text style={bottomBar} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default InboxItemSkeleton;
