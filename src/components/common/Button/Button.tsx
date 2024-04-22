import React from "react";
import { View } from "react-native";

import { useTheme, ActivityIndicator, Card } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Entypo from "react-native-vector-icons/Entypo";

import buttonStyle from "./Button.style";
import { ButtonType } from "./Button.types";

import { Icon, IconTypes, CText } from "~/components/";
import { scale } from "~/utils/";

const Button = (props: ButtonType): JSX.Element => {
  const {
    title = "",
    icon,
    iconType = IconTypes.ENTYPO,
    iconSize = scale(18),
    labelStyle = {},
    onPress = () => undefined,
    style = {},
    isLoading = false,
    disabled = false,
    finishedLoading = false,
    finishedIcon = "check",
    iconColor,
    testID = "",
    iconLeft,
    subtitle = "",
    subtitleStyle: subtitleStyleParam = {},
    ...restOfParams
  } = props;
  const { colors } = useTheme();

  const {
    label,
    subtitleStyle,
    textWrapperStyle,
    loaderStyle,
    iconStyle,
    RNPButtonStyle,
    RNPButtonDisabledStyle
  } = buttonStyle(colors, iconLeft, !!subtitle);
  const RNPButtonStyles = [RNPButtonStyle, style];
  const RNPButtonDisabledStyles = [RNPButtonStyle, RNPButtonDisabledStyle, style];
  const labelStyles = [label, labelStyle];
  const subtitleStyles = [subtitleStyle, subtitleStyleParam];

  return (
    <Card
      activeOpacity={0.7}
      onPress={!(isLoading || disabled) && onPress}
      style={disabled ? RNPButtonDisabledStyles : RNPButtonStyles}
      testID={testID}
      {...restOfParams}
    >
      {!!icon && (
        <Icon
          style={iconStyle}
          name={icon}
          type={iconType}
          size={iconSize}
          width={iconSize}
          height={iconSize}
          color={iconColor || colors.background}
        />
      )}
      <View style={textWrapperStyle}>
        <CText style={labelStyles}>{title}</CText>
        {!!subtitle && <CText style={subtitleStyles}>{subtitle}</CText>}
        {!!isLoading && (
          <ActivityIndicator
            animating={true}
            style={loaderStyle}
            color={labelStyle?.color || colors.background}
            size={iconSize}
          />
        )}
        {!!finishedLoading && (
          <Entypo
            style={loaderStyle}
            name={finishedIcon}
            size={iconSize}
            color={colors.background}
          />
        )}
      </View>
    </Card>
  );
};
export default Button;
