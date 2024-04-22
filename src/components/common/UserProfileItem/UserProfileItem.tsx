import React from "react";
import { View } from "react-native";

import FastImage from "react-native-fast-image";
import { Text, useTheme, Avatar } from "react-native-paper";

import userProfileStyle from "./userProfileItem.style";

import IMAGES from "~/assets/images";
import { Icon, IconTypes, ProgressiveImage } from "~/components/";
import { SimpleUser } from "~/types/user";
import { scale } from "~/utils/responsivityUtil";

const UserProfileItem = (props: { user: SimpleUser }): JSX.Element => {
  const { profile, name, verified, roles } = props?.user || {};
  const isRahhal = roles?.includes("rahhal");

  const { colors } = useTheme();

  const {
    root,
    usernameStyle,
    verifiedIconStyle,
    rahhalStyle,
    profileImageStyle,
    avatarLabelStyle
  } = userProfileStyle(colors);
  const firstNameCharacters = `${name}`
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  return (
    <View style={root}>
      <View>
        {profile ? (
          <FastImage style={profileImageStyle} source={{ uri: profile }} />
        ) : (
          <Avatar.Text
            size={scale(40)}
            label={firstNameCharacters}
            labelStyle={avatarLabelStyle}
          />
        )}
        {isRahhal && (
          <View style={rahhalStyle}>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name={"traveller_badge_icon"}
              width={scale(20)}
              height={scale(35)}
              startColor={colors.white}
              color={colors.primary}
            />
          </View>
        )}
      </View>

      {verified && (
        <View style={verifiedIconStyle}>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="verified_user"
            width={scale(14)}
            height={20}
            color={colors.primary}
          />
        </View>
      )}

      <Text numberOfLines={1} style={usernameStyle}>
        {name}
      </Text>
    </View>
  );
};
export default UserProfileItem;
