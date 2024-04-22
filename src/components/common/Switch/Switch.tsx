import React, { useState } from "react";
import { Pressable } from "react-native";

import { Switch as RNPSwitch, Text } from "react-native-paper";

import switchStyle from "./Switch.style";
import { SwitchProps, SwitchSizes, SwitchTypes } from "./Switch.types";

const Switch = (props: SwitchProps): JSX.Element => {
  const {
    label,
    labelStyle: labelStyleProp,
    disabled,
    onToggle = () => {},
    type = SwitchTypes.HORIZONTAL,
    size = SwitchSizes.SMALL,
    testID = "",
    defaultValue = false,
    ...restOfProps
  } = props;
  const [isSwitchOn, setIsSwitchOn] = useState(!!defaultValue);
  const onToggleSwitch = () => {
    onToggle(!isSwitchOn);
    setIsSwitchOn(!isSwitchOn);
  };

  const { vertical, centered, horizontal, disabledLabel, labelStyle } = switchStyle;

  const textStyle = [labelStyle, !!disabled && disabledLabel, labelStyleProp];
  const containerStyle = [
    centered,
    type === SwitchTypes.VERTICAL ? vertical : horizontal
  ];

  return (
    <Pressable disabled={!!disabled} onPress={onToggleSwitch} style={containerStyle}>
      {!!label && <Text style={textStyle}>{label}</Text>}
      <RNPSwitch
        style={switchStyle[size as SwitchSizes]}
        disabled={!!disabled}
        value={isSwitchOn}
        onValueChange={onToggleSwitch}
        testID={testID}
        {...restOfProps}
      />
    </Pressable>
  );
};

export default Switch;
