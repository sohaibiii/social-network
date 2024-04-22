import React from "react";
import { TouchableOpacity, View } from "react-native";

import { RadioButton as RNPRadioButton } from "react-native-paper";

import { CText } from "../";

import radioButtonStyle from "./RadioButton.style";
import { RadioButtonProps } from "./RadioButton.types";

import { LightTheme } from "~/theme/";

const RadioButton = (props: RadioButtonProps): JSX.Element => {
  const {
    label = "",
    color = LightTheme.colors.primary,
    uncheckedColor = LightTheme.colors.primary,
    disabled,
    checked = "",
    value = "",
    style = {},
    containerStyle = {},
    labelStyle = {},
    testID = "",
    onPress,
    ...restOfProps
  } = props;

  const { labelContainerStyle, radioButtonContainer } = radioButtonStyle;
  const radioButtonContainers = [radioButtonContainer, containerStyle];
  const handleButtonRadioPress = () => {
    onPress && onPress(value);
  };

  return (
    <TouchableOpacity style={radioButtonContainers} onPress={handleButtonRadioPress}>
      <RNPRadioButton.Android
        style={style}
        color={color}
        uncheckedColor={uncheckedColor}
        disabled={!!disabled}
        value={value}
        status={checked === value ? "checked" : "unchecked"}
        testID={testID}
        {...restOfProps}
      />
      <View style={labelContainerStyle}>
        {typeof label === "string" ? (
          <CText fontSize={14} style={labelStyle}>
            {label}
          </CText>
        ) : (
          label(checked === value)
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
