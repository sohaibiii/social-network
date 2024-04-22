import React from "react";
import { Pressable, View } from "react-native";

import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";

import userProfileImageStyle from "./UserProfileImage.style";
import { UserProfileImageType } from "./UserProfileImage.types";

import IMAGES from "~/assets/images";
import { Icon, IconTypes, ProgressiveImage } from "~/components/common";
import { verticalScale } from "~/utils/";

const UserProfileImage = (props: UserProfileImageType): JSX.Element => {
  const {
    source,
    onPress,
    style = {},
    width = verticalScale(100),
    height = verticalScale(100),
    borderRadius = 50,
    shouldRenderProgressive = true,
    ...restOfParams
  } = props;
  const { colors } = useTheme();
  const { image, icon } = userProfileImageStyle(colors);
  const imageStyle = [image, style, { width, height }];

  return source?.uri ? (
    <Pressable onPress={onPress}>
      {shouldRenderProgressive ? (
        <ProgressiveImage
          borderRadius={borderRadius}
          style={imageStyle}
          thumbnailSource={IMAGES.user_profile_default}
          errorSource={IMAGES.user_profile_default}
          source={source}
          {...restOfParams}
        />
      ) : (
        <FastImage style={imageStyle} source={source} {...restOfParams} />
      )}
    </Pressable>
  ) : (
    <View style={imageStyle}>
      <Icon
        width={width}
        height={height}
        name={"user_placeholder"}
        style={icon}
        type={IconTypes.SAFARWAY_ICONS}
        onPress={onPress}
      />
    </View>
  );
};
export default UserProfileImage;
