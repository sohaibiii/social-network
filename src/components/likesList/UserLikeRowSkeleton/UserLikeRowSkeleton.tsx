import React from "react";

import { Card } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import styles from "./UserLikeRowSkeleton.styles";

import { moderateScale } from "~/utils/responsivityUtil";

const UserLikeRowSkeleton = () => {
  const { cardStyle } = styles;
  return (
    <Card style={cardStyle}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={10}
          paddingVertical={10}
        >
          <SkeletonPlaceholder.Item
            width={moderateScale(35)}
            height={moderateScale(35)}
            borderRadius={moderateScale(18)}
          />
          <SkeletonPlaceholder.Item marginLeft={moderateScale(20)} flex={1}>
            <SkeletonPlaceholder.Item
              width={moderateScale(120)}
              height={moderateScale(20)}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={moderateScale(80)}
              height={moderateScale(20)}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={moderateScale(25)}
            height={moderateScale(35)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default UserLikeRowSkeleton;
