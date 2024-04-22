import React from "react";

import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { PostCommentSkeletonType } from "./PostCommentSkeleton.types";

import { APP_SCREEN_WIDTH, isRTL } from "~/constants/";
import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const PostCommentSkeleton = (props: PostCommentSkeletonType): JSX.Element => {
  const { colors } = useTheme();
  const { commentsCounter } = props;
  const skeletonCounter = Math.min(10, commentsCounter);
  const direction = isRTL ? "left" : "right";
  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      {new Array(skeletonCounter)?.fill()?.map((item, index) => {
        return (
          <SkeletonPlaceholder.Item key={index} flexDirection="row" marginTop={10}>
            <SkeletonPlaceholder.Item
              width={moderateScale(40)}
              height={moderateScale(40)}
              borderRadius={moderateScale(20)}
              marginRight={5}
            />
            <SkeletonPlaceholder.Item
              width={APP_SCREEN_WIDTH * 0.8}
              height={verticalScale(80)}
              borderRadius={10}
            />
          </SkeletonPlaceholder.Item>
        );
      })}
    </SkeletonPlaceholder>
  );
};

export default PostCommentSkeleton;
