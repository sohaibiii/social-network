import React from "react";

import { Text, TouchableRipple, useTheme } from "react-native-paper";

import { ButtonType } from "./ProfileButton.types";
import profileButtonsStyle from "./ProfileButtons.style";

import { Icon, IconTypes } from "~/components/";
import { scale, verticalScale } from "~/utils/";

const ProfileButton = (props: ButtonType): JSX.Element => {
  const { title = "", onPress, highlight = false, icon = "" } = props;
  const { colors } = useTheme();
  const { containerStyle, iconStyle, labelStyle } = profileButtonsStyle(
    colors,
    highlight
  );

  return (
    <TouchableRipple onPress={onPress} style={containerStyle}>
      <>
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          width={scale(18)}
          height={scale(18)}
          name={icon}
          style={iconStyle}
        />
        <Text style={labelStyle}>{title}</Text>
      </>
    </TouchableRipple>
  );
};
export default ProfileButton;
