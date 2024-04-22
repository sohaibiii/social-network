import React from "react";

import { useTheme, Card } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./PropertyMiniCardSkeleton.styles";
import { SliderSectionSkeletonProps } from "./PropertyMiniCardSkeleton.types";

import { isRTL } from "~/constants/";
import { scale, verticalScale } from "~/utils/";

const PropertyMiniCardSkeleton = (props: SliderSectionSkeletonProps): JSX.Element => {
  const theme = useTheme();
  const direction = isRTL ? "left" : "right";

  const {
    titleWidth = scale(60),
    imageWidth = scale(80),
    subTitleWidth = scale(120),
    titleHeight = verticalScale(20),
    subTitleHeight = verticalScale(17)
  } = props;

  const { sliderItemWrapperStyle } = styles(theme);

  return (
    <Card style={sliderItemWrapperStyle}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={theme.colors.skeleton.highlight}
        backgroundColor={theme.colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item flexDirection="row">
          <SkeletonPlaceholder.Item width={imageWidth} height={"100%"} />
          <SkeletonPlaceholder.Item borderRadius={4} marginBottom={10} marginLeft={10}>
            <SkeletonPlaceholder.Item
              borderRadius={4}
              marginBottom={10}
              marginTop={10}
              width={titleWidth}
              height={titleHeight}
            />
            <SkeletonPlaceholder.Item width={subTitleWidth} height={subTitleHeight} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default PropertyMiniCardSkeleton;
