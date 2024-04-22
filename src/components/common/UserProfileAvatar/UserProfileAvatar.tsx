import React, { useCallback, memo, useMemo } from "react";
import { Pressable, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import isEqual from "react-fast-compare";
import FastImage from "react-native-fast-image";
import { Avatar } from "react-native-paper";
import { useTheme } from "react-native-paper";

import styles from "./UserProfileAvatar.styles";
import { UserProfileAvatarInterface } from "./UserProfileAvatar.types";

import { IconTypes, Icon } from "~/components/common";
import { logEvent, NAVIGATE_TO_PROFILE } from "~/services/analytics";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const UserProfileAvatar = (props: UserProfileAvatarInterface) => {
  const { name, profile, isRahhal, id, analyticsSource } = props;
  const navigation = useNavigation();
  const theme = useTheme();

  const handleGoToProfile = useCallback(async () => {
    await logEvent(NAVIGATE_TO_PROFILE, { source: analyticsSource });

    navigation.navigate("Profile", {
      uuid: id,
      hasBackButton: true
    });
  }, [navigation, id, analyticsSource]);

  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);
  const userProfileImage = useMemo(() => ({ uri: profile }), [profile]);

  const { profileImageStyle, avatarLabelStyle, rahhalStyle } = useMemo(
    () => styles(theme, isRahhal),
    [theme, isRahhal]
  );

  return (
    <View>
      <Pressable onPress={handleGoToProfile}>
        {profile ? (
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
            startColor={theme.colors.white}
            color={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
};

export default memo(UserProfileAvatar, isEqual);
