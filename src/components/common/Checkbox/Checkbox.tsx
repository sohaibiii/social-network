import React, { useState } from "react";
import { View } from "react-native";

import { Checkbox as RNPCheckbox } from "react-native-paper";

import checkboxStyle from "./Checkbox.style";
import { CheckBoxType } from "./Checkbox.type";

const Checkbox = (props: CheckBoxType): JSX.Element => {
  const {
    containerStyle = {},
    style = {},
    checkboxColor,
    checkboxUncheckedColor,
    labelStyle,
    label = "",
    disabled,
    testID = "",
    onPressCb = () => {},
    defaultValue = false,
    ...restOfProps
  } = props;

  const [checked, setChecked] = useState(defaultValue);

  const handleOnPress = () => {
    if (disabled) {
      return;
    }
    onPressCb(!checked);
    setChecked(!checked);
  };

  const { checkboxContainer } = checkboxStyle;
  const checkboxContainerStyles = [checkboxContainer, style];
  const status = checked ? "checked" : "unchecked";

  return (
    <View style={containerStyle}>
      <RNPCheckbox.Item
        onPress={handleOnPress}
        mode={"android"}
        position="leading"
        color={checkboxColor}
        style={checkboxContainerStyles}
        labelStyle={labelStyle}
        label={label}
        uncheckedColor={checkboxUncheckedColor}
        status={status}
        disabled={disabled}
        testID={testID}
        {...restOfProps}
      />
    </View>
  );
};
export default Checkbox;
