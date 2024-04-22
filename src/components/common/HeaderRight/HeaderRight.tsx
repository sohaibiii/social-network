import React, { memo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTheme, Badge } from "react-native-paper";
import { useSelector } from "react-redux";

import { IconTypes, Icon } from "../Icon";

import styles from "./HeaderRight.style";

import { RootState } from "~/redux/store";

import { logEvent, NAVIGATE_TO_FAVORITES, NAVIGATE_TO_INBOX } from "~/services/";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const HeaderRight = (): JSX.Element => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const badges = useSelector((state: RootState) => state.notifications.badges) || 0;
  const inboxBadges = useSelector((state: RootState) => state.inbox.badges) || 0;

  const handleFavoritePressed = useCallback(async () => {
    await logEvent(NAVIGATE_TO_FAVORITES, { source: "header_top_bar" });
    navigation.navigate("FavoriteList");
  }, [navigation]);

  const handleNotificationPressed = useCallback(() => {
    navigation.navigate("Notifications");
  }, [navigation]);

  const handleInboxPressed = useCallback(async () => {
    await logEvent(NAVIGATE_TO_INBOX, { source: "header_top_bar" });
    navigation.navigate("Inbox");
  }, [navigation]);

  const { iconContainerStyle, heartIconStyle, bellWrapperStyle, badgeStyle } = styles;

  return (
    <View style={iconContainerStyle}>
      <TouchableOpacity onPress={handleFavoritePressed}>
        <Icon
          name="heart"
          type={IconTypes.SAFARWAY_ICONS}
          width={scale(23)}
          height={scale(23)}
          color={colors.text}
          disabled
          style={heartIconStyle}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotificationPressed} style={bellWrapperStyle}>
        <Icon
          name="bell"
          type={IconTypes.SAFARWAY_ICONS}
          width={scale(23)}
          height={scale(23)}
          color={colors.text}
          style={heartIconStyle}
          disabled
        />
        {badges > 0 && (
          <Badge size={moderateScale(16)} style={badgeStyle}>
            {badges}
          </Badge>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleInboxPressed} style={bellWrapperStyle}>
        <Icon
          name="inbox"
          width={scale(23)}
          height={scale(23)}
          type={IconTypes.SAFARWAY_ICONS}
          color={colors.text}
          disabled
        />
        {inboxBadges > 0 && (
          <Badge size={moderateScale(16)} style={badgeStyle}>
            {inboxBadges}
          </Badge>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(HeaderRight);
