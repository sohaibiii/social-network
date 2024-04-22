import React, { FC, memo } from "react";
import { View } from "react-native";

import Config from "react-native-config";
import { useTheme } from "react-native-paper";

import { UserInfoCardProps } from "./userInfoCard.types";

import { Button, CText, IconTypes } from "~/components/common";
import { UserProfileImage } from "~/components/profile";
import nearbyUsersStyles from "~/containers/nearbyUsers/nearbyUsers.styles";
import { translate } from "~/translations/swTranslator";
import { scale } from "~/utils/responsivityUtil";

const UserInfoCard: FC<UserInfoCardProps> = props => {
  const { item, onUserImagePress } = props;

  const { colors } = useTheme();

  const {
    userCardRoot,
    userCardImage,
    userCardContainer,
    userCardButtonStyle,
    userCardButtonLabelStyle
  } = nearbyUsersStyles(colors);

  return (
    <View style={userCardRoot}>
      <View style={userCardImage}>
        <UserProfileImage
          source={{
            uri: `${Config.AVATAR_MEDIA_PREFIX}/${item?.profileImage}_s.jpg`
          }}
          width={scale(60)}
          height={scale(60)}
          borderRadius={10}
          onPress={onUserImagePress(item)}
        />
      </View>
      <View style={userCardContainer}>
        <CText fontSize={16}>{item?.name}</CText>
        <CText fontSize={16}>{item?.country?.name}</CText>
        {/* <Button
          style={userCardButtonStyle}
          labelStyle={userCardButtonLabelStyle}
          iconSize={20}
          icon="chat"
          iconLeft={scale(40)}
          iconColor={colors.white}
          iconType={IconTypes.SAFARWAY_ICONS}
          title={translate("chat")}
        /> */}
        <Button
          style={userCardButtonStyle}
          labelStyle={userCardButtonLabelStyle}
          iconType={IconTypes.SAFARWAY_ICONS}
          title={translate("visit")}
          onPress={onUserImagePress(item)}
        />
      </View>
    </View>
  );
};

export default memo(UserInfoCard);
