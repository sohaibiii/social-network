import React, { useCallback, memo } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme, Avatar, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./UserLikeRow.styles";

import { RootState } from "~/redux/store";

import userService from "~/apiServices/user";
import { User } from "~/apiServices/user/user.types";
import { CText, Icon, IconTypes } from "~/components/common";
import { followUser, unfollowUser } from "~/redux/reducers/auth.reducer";
import { userUpserted } from "~/redux/reducers/home.reducer";
import {
  logEvent,
  LIKES_LIST_FOLLOW_USER,
  LIKES_LIST_UNFOLLOW_USER,
  NAVIGATE_TO_PROFILE
} from "~/services/analytics";
import { generalErrorHandler } from "~/utils/";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const ANALYTICS_SOURCE = "likes_list";
const UserLikeRow = (props: User): JSX.Element => {
  const { uuid, name = "", country = "", profile_image, roles = [], verified } = props;

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo) || {};
  const userSelector = useSelector((state: RootState) => state.home.users.entities[uuid]);

  const { isFollow } = userSelector || {};

  const handleGoToProfile = useCallback(async () => {
    await logEvent(NAVIGATE_TO_PROFILE, { source: ANALYTICS_SOURCE, uuid });
    navigation.navigate("Profile", {
      uuid,
      hasBackButton: true
    });
  }, [navigation, uuid]);

  const handleFollowPressed = async () => {
    try {
      if (!userToken) {
        return navigation.navigate("PreLoginNavigationModal");
      }
      await userService.followUser(uuid, !isFollow);
      dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
      if (isFollow) {
        await logEvent(LIKES_LIST_UNFOLLOW_USER, { source: ANALYTICS_SOURCE, uuid });
        dispatch(unfollowUser({}));
      } else {
        await logEvent(LIKES_LIST_FOLLOW_USER, { source: ANALYTICS_SOURCE, uuid });
        dispatch(followUser({}));
      }
    } catch (error) {
      generalErrorHandler(`Error: followUser --UserLikeRow.tsx uuid=${uuid} ${error}`);
    }
  };

  const {
    profileImageStyle,
    rahhalProfileImageStyle,
    avatarLabelStyle,
    nameWrapperStyle,
    verifiecIconStyle,
    containerStyle,
    rahhalStyle,
    selectedIconStyle,
    iconStyle,
    verticalPadding
  } = styles(colors);

  const isRahhal = roles.length > 0;
  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const isMyLike = userInfo.id === uuid;

  const followIcon = isFollow ? "following_user" : "follow_user";
  const followIconStyle = isFollow ? selectedIconStyle : iconStyle;
  return (
    <Card>
      <TouchableOpacity style={containerStyle} onPress={handleGoToProfile}>
        <View>
          {profile_image ? (
            <FastImage
              style={isRahhal ? rahhalProfileImageStyle : profileImageStyle}
              source={{ uri: `${Config.AVATAR_MEDIA_PREFIX}/${profile_image}_s.jpg` }}
            />
          ) : (
            <Avatar.Text
              size={moderateScale(36)}
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
        <View style={nameWrapperStyle}>
          {verified && (
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name="verified_user_filled"
              height={scale(15)}
              width={scale(15)}
              style={verifiecIconStyle}
            />
          )}
          <View>
            <CText fontSize={13} lineHeight={17} style={verticalPadding}>
              {name}
            </CText>
            <CText fontSize={12} lineHeight={16} style={verticalPadding}>
              {country}
            </CText>
          </View>
        </View>
        <View>
          {!isMyLike && (
            <TouchableOpacity onPress={handleFollowPressed}>
              <Icon
                disabled
                style={followIconStyle}
                type={IconTypes.SAFARWAY_ICONS}
                name={followIcon}
                width={moderateScale(22)}
                height={moderateScale(22)}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default memo(UserLikeRow);
