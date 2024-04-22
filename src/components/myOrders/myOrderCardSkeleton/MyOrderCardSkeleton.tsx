import React, { FC, useMemo } from "react";

import { Card, Divider, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import myOrderCardSkeletonStyles from "./MyOrderCardSkeleton.styles";

import { isRTL } from "~/constants/variables";

const MyOrderCardSkeleton: FC = () => {
  const { colors } = useTheme();

  const styles = useMemo(() => myOrderCardSkeletonStyles(colors), [colors]);

  const { cardStyle, dividerStyle } = styles;

  const direction = isRTL ? "left" : "right";

  return (
    <Card style={cardStyle} elevation={2}>
      <SkeletonPlaceholder
        direction={direction}
        highlightColor={colors.skeleton.highlight}
        backgroundColor={colors.skeleton.background}
      >
        <SkeletonPlaceholder.Item
          marginRight={20}
          marginLeft={12}
          marginTop={12}
          marginBottom={20}
        >
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item width={130} height={80} borderRadius={4} />
            <SkeletonPlaceholder.Item flexDirection="column" marginLeft={10}>
              <SkeletonPlaceholder.Item
                width={120}
                height={18}
                borderRadius={4}
                marginTop={2}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={10}
                borderRadius={4}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={180}
                height={10}
                borderRadius={4}
                marginTop={8}
              />
              <SkeletonPlaceholder.Item
                width={150}
                height={10}
                borderRadius={4}
                marginTop={8}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginTop={10}
          >
            <SkeletonPlaceholder.Item height={25} width={100} />
            <SkeletonPlaceholder.Item height={30} width={100} />
          </SkeletonPlaceholder.Item>
          <Divider style={dividerStyle} />
          <SkeletonPlaceholder.Item height={20} width={100} marginTop={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default MyOrderCardSkeleton;
