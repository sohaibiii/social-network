import React, { memo } from "react";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { isRTL } from "~/constants/";

const PropertySkeleton = (): JSX.Element => {
  const { colors } = useTheme();

  const direction = isRTL ? "left" : "right";

  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <SkeletonPlaceholder.Item flexDirection="column" marginRight={3} marginLeft={3}>
        <SkeletonPlaceholder.Item
          width={250}
          height={30}
          borderRadius={4}
          marginLeft={5}
          marginTop={5}
          marginBottom={5}
        />
        <SkeletonPlaceholder.Item
          width={250}
          height={30}
          borderRadius={4}
          marginLeft={5}
          marginTop={5}
          marginBottom={5}
        />
        <SkeletonPlaceholder.Item
          width={400}
          height={240}
          marginBottom={15}
          borderRadius={5}
        />
        <SkeletonPlaceholder.Item flexDirection={"row"} justifyContent={"space-between"}>
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginTop={3}
            marginBottom={5}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={100}
          height={30}
          marginTop={10}
          borderRadius={4}
          marginLeft={5}
          marginBottom={3}
        />
        <SkeletonPlaceholder.Item marginTop={10} flexDirection={"row"}>
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={100}
          height={30}
          marginTop={10}
          borderRadius={4}
          marginLeft={5}
          marginBottom={3}
        />
        <SkeletonPlaceholder.Item flexDirection={"row"}>
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={100}
          height={30}
          marginTop={10}
          borderRadius={4}
          marginLeft={5}
          marginBottom={3}
        />
        <SkeletonPlaceholder.Item flexDirection={"row"} justifyContent={"space-between"}>
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
          <SkeletonPlaceholder.Item
            width={80}
            height={20}
            borderRadius={4}
            marginLeft={5}
            marginRight={5}
            marginTop={3}
            marginBottom={5}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
export default memo(PropertySkeleton);
