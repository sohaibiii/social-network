import React, { FC, memo } from "react";
import { View } from "react-native";

import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { MapViewProps } from "./mapView.types";

import { RootState } from "~/redux/store";

import { UserProfileImage } from "~/components/profile";
import nearbyUsersStyles from "~/containers/nearbyUsers/nearbyUsers.styles";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const MapView: FC<MapViewProps> = props => {
  const { users, onSelectUser } = props;

  const { colors } = useTheme();

  const {
    mapContainer,
    firstGridStyle,
    secondGridStyle,
    thirdGridStyle,
    fourthGridStyle,
    fifthGridStyle
  } = nearbyUsersStyles(colors);

  const userProfile = useSelector((state: RootState) => state.auth.userProfile);

  return (
    <View style={mapContainer}>
      <View style={firstGridStyle} />
      <View style={secondGridStyle} />
      <View style={thirdGridStyle} />
      <View style={fourthGridStyle} />
      <View style={fifthGridStyle}>
        <UserProfileImage
          source={{
            uri: `${Config.AVATAR_MEDIA_PREFIX}/${userProfile?.images?.avatar_s3}_s.jpg`
          }}
          width={scale(30)}
          height={scale(30)}
          borderRadius={10}
        />
      </View>

      {users.map(item => {
        const rand = Math.random() * Math.PI * 2;
        const mapUserContainer = {
          marginTop: verticalScale(-5),
          position: "absolute",
          top: scale(135) + scale(Math.sin(rand) * Math.max(Math.random(), 0.4) * 135),
          start: scale(135) + scale(Math.cos(rand) * Math.max(Math.random(), 0.4) * 135),
          width: scale(25),
          height: scale(25)
        };

        return (
          <View key={item.uuid} style={mapUserContainer}>
            <UserProfileImage
              source={{
                uri: `${Config.AVATAR_MEDIA_PREFIX}/${item.profileImage}_s.jpg`
              }}
              width={scale(25)}
              height={scale(25)}
              onPress={() => onSelectUser && onSelectUser(item)}
              borderRadius={10}
            />
          </View>
        );
      })}
    </View>
  );
};

export default memo(MapView);
