import React, { useState } from "react";
import { View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import config from "react-native-config";
import { Card, Text, Avatar, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import style from "./UserRow.style";

import { RootState } from "~/redux/store";

import { homeAPI } from "~/apis/";
import { Follower } from "~/apiServices/user/user.types";
import { Icon, IconTypes } from "~/components/common";
import { UserProfileImage } from "~/components/profile";
import { followUser, unfollowUser } from "~/redux/reducers/auth.reducer";
import { userUpserted } from "~/redux/reducers/home.reducer";
import { moderateScale, scale } from "~/utils/";

const UserRow = (props: Follower & { hasButtons: boolean }): JSX.Element => {
  const {
    name = "",
    uuid = "",
    country = { name: "" },
    profileImage,
    verified,
    hasButtons = true
  } = props;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.home.users.entities[uuid]);
  const userInfoId = useSelector((state: RootState) => state.auth.userInfo?.id);

  const { isFollow = false } = userSelector || {};

  const {
    cardStyle,
    cardRowStyle,
    nameContainer,
    nameVerifiedContainer,
    nameStyle,
    iconStyle,
    selectedIconStyle,
    avatarLabelStyle
  } = style(colors);

  const handleFollow = async () => {
    if (isFollow) {
      homeAPI.userUnfollowRequest(uuid);
      dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
      dispatch(unfollowUser({}));
    } else {
      homeAPI.userFollowRequest(uuid);
      dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
      dispatch(followUser({}));
    }
  };

  const handleChat = () => {};

  const handleGoToProfile = () => {
    navigation.navigate({
      name: "Profile",
      key: `${moment().unix()}`,
      params: {
        uuid,
        hasBackButton: true
      }
    });
  };

  const followIcon = isFollow ? "following_user" : "follow_user";
  const followIconStyle = isFollow ? selectedIconStyle : iconStyle;
  const isMyProfile = uuid === userInfoId;
  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  return (
    <Card onPress={handleGoToProfile} style={cardStyle}>
      <View style={cardRowStyle}>
        {profileImage ? (
          <UserProfileImage
            shouldRenderProgressive={false}
            source={{ uri: `${config.AVATAR_MEDIA_PREFIX}/${profileImage}_s.jpg` }}
            borderRadius={20}
            height={moderateScale(45)}
            width={moderateScale(45)}
            onPress={handleGoToProfile}
          />
        ) : (
          <Avatar.Text
            size={moderateScale(40)}
            label={firstNameCharacters}
            labelStyle={avatarLabelStyle}
          />
        )}
        <View style={nameContainer}>
          <View style={nameVerifiedContainer}>
            <Text style={nameStyle}>{name}</Text>
            {verified && (
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                height={scale(20)}
                width={scale(20)}
                name={"verified_user_filled"}
                color={colors.primary_blue}
              />
            )}
          </View>
          <Text>{country?.name}</Text>
        </View>
        {hasButtons && !isMyProfile && (
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            style={followIconStyle}
            height={moderateScale(22)}
            width={moderateScale(22)}
            name={followIcon}
            onPress={handleFollow}
          />
        )}
        {/* {hasButtons && (
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            style={iconStyle}
            height={moderateScale(22)}
            width={moderateScale(22)}
            name={"chat"}
            onPress={handleChat}
          />
        )} */}
      </View>
    </Card>
  );
};
export default UserRow;
