import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTheme } from "react-native-paper";

import nearbyUsersStyles from "./nearbyUsers.styles";

import userService from "~/apiServices/user";
import {
  Icon,
  IconTypes,
  MapView,
  GridView,
  UserInfoCard,
  ToggleView
} from "~/components/";
import { showNearByModal } from "~/components/nearby";
import {
  logEvent,
  NAVIGATE_TO_PROFILE,
  NEARBY_USERS_CHANGE_VIEW_MODE,
  NEARBY_USERS_GET_USERS,
  NEARBY_USERS_GET_USERS_FAILED,
  NEARBY_USERS_GET_USERS_SUCCESS,
  NEARBY_USERS_SETTINGS_PRESSED
} from "~/services/";
import { getLocation } from "~/services/location/location";
import { SimpleUser } from "~/types/user";
import { logError } from "~/utils/";

const NearbyUsers: FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { footerContainer } = nearbyUsersStyles(colors);

  const [selectedUser, setSelectedUser] = useState<SimpleUser | undefined>();
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [mapViewMode, setMapViewMode] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSettingsPress}>
          <Icon
            name="settings"
            color={colors.text}
            type={IconTypes.SIMPLELINE_ICONS}
            size={25}
          />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useEffect(() => {
    nearByScreenActions();
  }, []);

  const nearByScreenActions = async () => {
    try {
      const position = await getLocation();
      const lat = position && position.latitude + "";
      const lon = position && position.longitude + "";
      await logEvent(NEARBY_USERS_GET_USERS, {
        source: "nearby_users_page"
      });
      const response = await userService.getUsersAroundMe(`${lat},${lon}`);
      await logEvent(NEARBY_USERS_GET_USERS_SUCCESS, {
        source: "nearby_users_page"
      });
      setUsers(response);
    } catch (error) {
      logError(`something went wrong with nearByScreenActions function ${error}`);
      await logEvent(NEARBY_USERS_GET_USERS_FAILED, {
        source: "nearby_users_page"
      });
    }
  };

  const onSettingsPress = async () => {
    await logEvent(NEARBY_USERS_SETTINGS_PRESSED, {
      source: "nearby_users_page"
    });

    showNearByModal();
  };

  const onUserImagePress = (item?: SimpleUser) => async () => {
    await logEvent(NAVIGATE_TO_PROFILE, {
      source: "nearby_users_page",
      userUuid: item?.uuid
    });

    navigation.navigate("Profile", {
      uuid: item?.uuid,
      hasBackButton: true
    });
  };

  const onToggleButtonPress = (value: boolean) => async () => {
    await logEvent(NEARBY_USERS_CHANGE_VIEW_MODE, {
      source: "nearby_users_page",
      mode: value
    });
    setMapViewMode(value);
  };

  return (
    <>
      {mapViewMode ? (
        <MapView users={users} onSelectUser={setSelectedUser} />
      ) : (
        <GridView users={users} onUserImagePress={onUserImagePress} />
      )}
      <View style={footerContainer}>
        {mapViewMode && selectedUser && (
          <UserInfoCard item={selectedUser} onUserImagePress={onUserImagePress} />
        )}
        <ToggleView onToggleButtonPress={onToggleButtonPress} mapViewMode={mapViewMode} />
      </View>
    </>
  );
};

export { NearbyUsers };
