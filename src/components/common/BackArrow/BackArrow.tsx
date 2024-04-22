import React from "react";

import { useNavigation } from "@react-navigation/native";
import { Appbar, TouchableRipple, useTheme } from "react-native-paper";

import backArrowStyle from "./BackArrow.style";
import { BackArrowType } from "./BackArrow.types";

export const BackArrow = (props: BackArrowType): JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const {
    onPress = () => navigation.goBack(),
    color = colors.text,
    size = 24,
    style = {}
  } = props;
  const { iconStyle, iconContainerStyle } = backArrowStyle;
  const arrowIconStyle = [iconStyle, style];
  return (
    <TouchableRipple style={iconContainerStyle} onPress={onPress}>
      <Appbar.BackAction
        style={arrowIconStyle}
        color={color}
        size={size}
        onPress={onPress}
      />
    </TouchableRipple>
  );
};
