import React from "react";
import { View } from "react-native";

import { Card, Text, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import style from "./UserRow.style";

import { isRTL } from "~/constants/";

const UserRowSkeleton = (): JSX.Element => {
  const { colors } = useTheme();
  const { cardStyle, nameContainer, imageContainer, topBar, bottomBar, cardRowStyle } =
    style(colors);
  const direction = isRTL ? "left" : "right";
  return (
    <Card style={cardStyle}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <View style={cardRowStyle}>
          <View style={imageContainer} />
          <View style={nameContainer}>
            <Text style={topBar} />
            <Text style={bottomBar} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </Card>
  );
};
export default UserRowSkeleton;
