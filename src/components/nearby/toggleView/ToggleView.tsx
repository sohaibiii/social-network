import React, { FC, memo } from "react";
import { View, TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";

import { ToggleViewProps } from "./toggleView.types";

import { Icon, IconTypes } from "~/components/common";
import nearbyUsersStyles from "~/containers/nearbyUsers/nearbyUsers.styles";
import { scale } from "~/utils/responsivityUtil";

const ToggleView: FC<ToggleViewProps> = props => {
  const { onToggleButtonPress, mapViewMode } = props;

  const { colors } = useTheme();
  const { toggleViewContainer, userCardButtonIconStyle } = nearbyUsersStyles(colors);

  const mapIconStyle = [
    userCardButtonIconStyle,
    {
      backgroundColor: mapViewMode ? colors.primary : colors.white
    }
  ];

  const gridIconStyle = [
    userCardButtonIconStyle,
    {
      backgroundColor: !mapViewMode ? colors.primary : colors.white
    }
  ];

  return (
    <View style={toggleViewContainer}>
      <TouchableOpacity
        disabled={mapViewMode}
        onPress={onToggleButtonPress(true)}
        style={mapIconStyle}
      >
        <Icon
          name={"map"}
          width={scale(25)}
          height={scale(25)}
          type={IconTypes.SAFARWAY_ICONS}
          color={mapViewMode ? colors.white : colors.primary}
          onPress={onToggleButtonPress(true)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!mapViewMode}
        onPress={onToggleButtonPress(false)}
        style={gridIconStyle}
      >
        <Icon
          name={"group"}
          width={scale(25)}
          height={scale(25)}
          type={IconTypes.SAFARWAY_ICONS}
          color={!mapViewMode ? colors.white : colors.primary}
          onPress={onToggleButtonPress(false)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ToggleView);
