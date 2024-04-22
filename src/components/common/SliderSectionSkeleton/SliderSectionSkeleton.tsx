import React from "react";
import { View } from "react-native";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./SliderSectionSkeleton.styles";
import { SliderSectionSkeletonProps } from "./SliderSectionSkeleton.type";

import { isRTL } from "~/constants/";

const SliderSectionSkeleton = (props: SliderSectionSkeletonProps): JSX.Element => {
  const theme = useTheme();
  const direction = isRTL ? "left" : "right";

  const {
    children,
    title = true,
    subTitle = false,
    titleWidth = 120,
    subTitleWidth = 60,
    titleHeight = 30,
    subTitleHeight = 25
  } = props;

  const { sliderItemWrapperStyle } = styles(theme);

  return (
    <View style={sliderItemWrapperStyle}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={theme.colors.skeleton.highlight}
        backgroundColor={theme.colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item flexDirection="column">
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginBottom={10}
            marginLeft={10}
          >
            {title ? (
              <SkeletonPlaceholder.Item width={titleWidth} height={titleHeight} />
            ) : (
              <></>
            )}
            {subTitle ? (
              <SkeletonPlaceholder.Item
                width={subTitleWidth}
                height={subTitleHeight}
                marginLeft={20}
              />
            ) : (
              <></>
            )}
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            marginLeft={10}
          >
            {children}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default SliderSectionSkeleton;
