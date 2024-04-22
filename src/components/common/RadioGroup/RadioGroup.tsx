import React from "react";
import { View } from "react-native";

import { RadioButton as RNPRadioButton } from "react-native-paper";

import radioGroupStyle from "./RadioGroup.style";
import { RadioGroupProps } from "./RadioGroup.types";

const RadioGroup = (props: RadioGroupProps): JSX.Element => {
  const { children, defaultValue, onToggle = () => {}, row = false, ...restOfProps } = props;

  const [isSwitchOn, setIsSwitchOn] = React.useState(defaultValue);

  const onToggleSwitch = (key: string) => {
    onToggle(key);
    setIsSwitchOn(key);
  };

  const { containerStyle } = radioGroupStyle(row);

  return (
    <RNPRadioButton.Group
      onValueChange={onToggleSwitch}
      value={isSwitchOn}
      {...restOfProps}
    >
      <View style={containerStyle}>
        {React.Children.map(children, child => {
          return (
            !!child &&
            React.cloneElement(child, {
              checked: isSwitchOn,
              onPress: (value: string) => onToggleSwitch(value)
            })
          );
        })}
      </View>
    </RNPRadioButton.Group>
  );
};

export default RadioGroup;
