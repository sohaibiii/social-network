import React, { useCallback, FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./TopUsersList.styles";
import { TopUserItemProps } from "./TopUsersList.types";

import { Icon, IconTypes } from "~/components/common";
import { UserProfileItem } from "~/components/common/UserProfileItem";
import { logEvent, PROFILE_VISITED } from "~/services/analytics";
import { scale } from "~/utils/responsivityUtil";

const TopUserItem: FC<TopUserItemProps> = ({ item, index }): JSX.Element => {
  const { colors } = useTheme();
  const userID = useSelector((state: RootState) => state.auth.userInfo?.id);

  const { root, serialNumberStyle, prizeStyle, pointsContainer, pointsStyle } =
    styles(colors);

  const navigation = useNavigation();

  const getIcon = useCallback((itemIndex: number) => {
    let iconName = "";
    if (itemIndex === 0) {
      iconName = "gold_cup";
    }
    if (itemIndex === 1) {
      iconName = "silver_cup";
    }
    if (itemIndex === 2) {
      iconName = "bronze_cup";
    }

    return (
      <View style={prizeStyle}>
        {iconName ? (
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={iconName}
            width={scale(35)}
            height={scale(35)}
          />
        ) : null}
      </View>
    );
  }, []);

  const onItemPress = async () => {
    const isMyProfile = userID === item.uuid;
    const othersEventsParams = { profile_user_id: item.uuid };
    await logEvent(
      `${isMyProfile ? "my" : "others"}${PROFILE_VISITED}`,
      isMyProfile
        ? { source: "points_bank_page" }
        : {
            source: "points_bank_page",
            profile_user_id: item.uuid,
            name: item.name
          }
    );
    navigation.navigate("Profile", {
      uuid: item.uuid,
      hasBackButton: true
    });
  };

  return (
    <TouchableOpacity style={root} onPress={onItemPress}>
      <Text style={serialNumberStyle}>{index + 1}.</Text>
      <UserProfileItem user={item} />
      <View style={pointsContainer}>
        <Text style={pointsStyle}>{item.points}</Text>

        <Icon type={IconTypes.SAFARWAY_ICONS} name="coin" width={scale(25)} height={20} />
      </View>
      {getIcon(index)}
    </TouchableOpacity>
  );
};

export default TopUserItem;
