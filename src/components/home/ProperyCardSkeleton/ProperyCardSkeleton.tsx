import React from "react";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { ProperyCardSkeletonTypes } from "./ProperyCardSkeleton.types";

import { isRTL } from "~/constants/";

const ProperyCardSkeleton = (props: ProperyCardSkeletonTypes): JSX.Element => {
  const WIDTH = 150;
  const ASPECT_RATIO = 1.5;

  const theme = useTheme();
  const direction = isRTL ? "left" : "right";
  const { cardWidth = WIDTH, marginRight = 3 } = props;

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={theme.colors.skeleton.highlight}
      backgroundColor={theme.colors.skeleton.background}
    >
      <SkeletonPlaceholder.Item
        flexDirection="column"
        marginRight={marginRight}
        marginLeft={3}
      >
        <SkeletonPlaceholder.Item
          width={cardWidth - 6}
          height={cardWidth / ASPECT_RATIO}
          borderRadius={5}
        />
        <SkeletonPlaceholder.Item
          width={120}
          height={20}
          borderRadius={4}
          marginLeft={5}
          marginTop={3}
          marginBottom={5}
        />
        <SkeletonPlaceholder.Item
          width={80}
          height={15}
          borderRadius={4}
          marginLeft={5}
          marginBottom={3}
        />
        <SkeletonPlaceholder.Item
          width={100}
          height={15}
          borderRadius={4}
          marginLeft={5}
          marginTop={3}
          marginBottom={5}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default ProperyCardSkeleton;
