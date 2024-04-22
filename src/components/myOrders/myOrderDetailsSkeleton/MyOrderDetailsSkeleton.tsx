import React, { FC } from "react";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { isRTL } from "~/constants/variables";
import { verticalScale } from "~/utils/responsivityUtil";

const MyOrderDetailsSkeleton: FC = () => {
  const { colors } = useTheme();

  const direction = isRTL ? "left" : "right";

  return (
    <>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item height={verticalScale(250)} />
        <SkeletonPlaceholder.Item marginHorizontal={20}>
          <SkeletonPlaceholder.Item flexDirection="row" marginVertical={20}>
            <SkeletonPlaceholder.Item width={150} height={45} />
            <SkeletonPlaceholder.Item width={100} height={20} marginLeft={10} />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={180} height={20} />
          <SkeletonPlaceholder.Item
            width={300}
            height={30}
            marginTop={20}
            marginLeft={50}
          />
          <SkeletonPlaceholder.Item
            width={300}
            height={30}
            marginTop={20}
            marginLeft={50}
          />
          <SkeletonPlaceholder.Item
            width={300}
            height={90}
            marginTop={20}
            marginLeft={50}
          />
          <SkeletonPlaceholder.Item width={180} height={20} marginTop={30} />
          <SkeletonPlaceholder.Item
            width={150}
            height={30}
            marginTop={20}
            marginLeft={50}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </>
  );
};

export default MyOrderDetailsSkeleton;
