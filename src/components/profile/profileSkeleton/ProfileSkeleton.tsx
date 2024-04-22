import React from "react";
import { View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import style from "./ProfileSkeleton.style";

import { ProfileSkeletonType } from "~/components/profile/profileSkeleton/ProfileSkeleton.types";
import { isRTL } from "~/constants/";

const ProfileSkeleton = (props: ProfileSkeletonType): JSX.Element => {
  const { colors } = useTheme();
  const { isMyProfile = false } = props;
  const {
    container,
    nameContainer,
    imageContainer,
    topBar,
    bottomBar,
    buttonStyle,
    buttonsContainer,
    buttonContainerStyle
  } = style(colors);
  const direction = isRTL ? "left" : "right";
  return (
    <SkeletonPlaceholder
      direction={direction}
      highlightColor={colors.skeleton.highlight}
      backgroundColor={colors.skeleton.background}
    >
      <View style={container}>
        <View style={imageContainer} />
        <View style={nameContainer}>
          <Text style={topBar} />
          <Text style={bottomBar} />
        </View>
        <View style={buttonsContainer}>
          {!isMyProfile ? (
            <View style={buttonContainerStyle}>
              <View style={buttonStyle} />
            </View>
          ) : (
            <View />
          )}
          <View style={buttonContainerStyle}>
            <View style={buttonStyle} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
export default ProfileSkeleton;
