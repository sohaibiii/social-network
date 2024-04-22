import React, { memo, useCallback, useMemo } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { Avatar, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, UserProfileAvatar } from "~/components/common";
import avatarStyles from "~/components/common/UserProfileAvatar/UserProfileAvatar.styles";
import LikeCommentShareContainerStyles from "~/components/post/PostHeader/PostHeader.style";
import { PostHeaderTypes } from "~/components/post/PostHeader/PostHeader.types";
import { moderateScale, scale } from "~/utils/";

const PostSponsershipHeader = (props: PostHeaderTypes): JSX.Element => {
  const {
    pkey = "",
    name = "",
    profile_image = "",
    uuid = "",
    timestamp,
    verified,
    roles = []
  } = props || {};

  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const postSelector = useSelector((state: RootState) => state.home.posts.entities[pkey]);
  const isRahhal = roles.length > 0;

  const {
    container,
    userDetailsContainerStyle,
    userDetailsTextStyle,
    userDetailsStyle,
    nameWrapperStyle,
    verifiecIconStyle,
    hoursRowStyle
  } = useMemo(() => LikeCommentShareContainerStyles(colors), [colors]);

  const { profileImageStyle, avatarLabelStyle, rahhalStyle } = useMemo(
    () => avatarStyles(theme, isRahhal),
    [theme, isRahhal]
  );

  const handleGoToProfile = useCallback(() => {
    navigation.navigate("Profile", {
      uuid,
      hasBackButton: true
    });
  }, [navigation, uuid]);

  const handleGoToPostDetails = useCallback(() => {
    navigation.navigate("PostDetails", {
      postPkey: pkey,
      commentsCounter: postSelector?.comments_counter,
      timestamp: timestamp,
      isSponserShip: true,
      enable_post_actions: postSelector?.preferences?.enable_post_actions
    });
  }, [
    navigation,
    pkey,
    postSelector?.comments_counter,
    timestamp,
    postSelector?.preferences?.enable_post_actions
  ]);

  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const userProfileImage = useMemo(() => ({ uri: profile_image }), [profile_image]);

  return (
    <View style={container}>
      <View style={userDetailsContainerStyle}>
        <View>
          <Pressable onPress={handleGoToPostDetails}>
            {profile_image ? (
              <FastImage style={profileImageStyle} source={userProfileImage} />
            ) : (
              <Avatar.Text
                size={moderateScale(40)}
                label={firstNameCharacters}
                labelStyle={avatarLabelStyle}
              />
            )}
          </Pressable>
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
        <View style={userDetailsStyle}>
          <TouchableOpacity onPress={handleGoToPostDetails}>
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
              <CText fontSize={13} lineHeight={17} color={"primary_blue_d"}>
                {name}
              </CText>
              {/* <CText
                fontSize={13}
                lineHeight={17}
                style={{ marginLeft: 4 }}
                color={"text"}
                fontFamily="light"
              >
                shared a link
              </CText> */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoToPostDetails}>
            <View style={hoursRowStyle}>
              <CText
                fontSize={11}
                fontFamily={"light"}
                lineHeight={15}
                style={userDetailsTextStyle}
                onPress={handleGoToPostDetails}
              >
                {t("sponsored")}
              </CText>
              <Icon type={IconTypes.ENTYPO} name="globe" color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(PostSponsershipHeader, isEqual);
