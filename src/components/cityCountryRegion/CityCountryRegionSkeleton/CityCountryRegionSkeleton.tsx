import React from "react";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { APP_SCREEN_HEIGHT, isRTL } from "~/constants/variables";
import { verticalScale } from "~/utils/responsivityUtil";

const CityCountryRegionSkeleton = (): JSX.Element => {
  const { colors } = useTheme();
  const direction = isRTL ? "left" : "right";

  const parallaxHeaderHeight = verticalScale(280);

  return (
    <>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item
          width={APP_SCREEN_HEIGHT}
          height={parallaxHeaderHeight}
        />
        <SkeletonPlaceholder.Item
          width={200}
          height={40}
          alignSelf="center"
          marginTop={15}
          marginBottom={5}
        />
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginBottom={15}
          marginLeft={12}
        >
          <SkeletonPlaceholder.Item width={60} height={40} />
          <SkeletonPlaceholder.Item width={120} height={25} marginLeft={15} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="column"
          marginBottom={20}
          marginLeft={12}
        >
          <SkeletonPlaceholder.Item width={"95%"} height={20} marginVertical={4} />
          <SkeletonPlaceholder.Item width={"95%"} height={20} marginVertical={4} />
          <SkeletonPlaceholder.Item width={"95%"} height={20} marginVertical={4} />
          <SkeletonPlaceholder.Item width={"80%"} height={20} marginVertical={4} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item
          flexDirection="column"
          marginBottom={20}
          marginLeft={12}
        >
          <SkeletonPlaceholder.Item flexDirection="row" marginTop={20}>
            <SkeletonPlaceholder.Item width={75} height={20} />
            <SkeletonPlaceholder.Item width={85} height={20} marginLeft={10} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item flexDirection="row" marginTop={15}>
            <SkeletonPlaceholder.Item width={75} height={20} />
            <SkeletonPlaceholder.Item width={160} height={20} marginLeft={10} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            height={25}
            width={130}
            marginVertical={4}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item height={20} width={"95%"} marginVertical={4} />
          <SkeletonPlaceholder.Item height={20} width={"95%"} marginVertical={4} />
          <SkeletonPlaceholder.Item height={20} width={"95%"} marginVertical={4} />
          <SkeletonPlaceholder.Item height={20} width={"80%"} marginVertical={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </>
  );
};

export default CityCountryRegionSkeleton;
