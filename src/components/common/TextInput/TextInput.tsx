import React, { forwardRef, useState } from "react";
import { TextInput as TextInputRef, View } from "react-native";

import { HelperText, TextInput as RNPTextInput, useTheme } from "react-native-paper";
import { ICON_SIZE } from "react-native-paper/src/components/TextInput/Adornment/TextInputIcon";

import textInputStyle from "./TextInput.style";
import { TextInputType } from "./TextInput.types";

const TextInput: React.ForwardRefRenderFunction<TextInputRef, TextInputType> = (
  props: TextInputType,
  forwardedRef
): JSX.Element => {
  const { colors } = useTheme();
  const {
    onChangeText,
    onBlur,
    label = "",
    placeholder = "",
    error = "",
    errorWithNoMessage = false,
    isPassword = false,
    leftIcon,
    rightIcon = "",
    style,
    numberOfLines = 1,
    leftIconColor = colors.primary,
    rightIconColor = colors.primary,
    mode = "outlined",
    testID = "",
    dense = true,
    errorVisible = true,
    name = "",
    register = () => undefined,
    textInputContainerStyle = {},
    rightIconOnPressCb = () => {},
    ...restOfProps
  } = props;
  const [passwordVisible, setIsPasswordVisible] = useState(false);
  const handleOnClick = () => {
    setIsPasswordVisible(!passwordVisible);
  };

  const { textInput, helperText, textInputContainer, eyeIconStyle, rightIconStyle } =
    textInputStyle(rightIcon);

  const textInputStyles = [textInput, style];
  const textInputContainerStyles = [textInputContainer, textInputContainerStyle];
  const textInputTheme = { colors: { text: colors.text, placeholder: colors.text } };
  const leftIconComponent = !!leftIcon && (
    <RNPTextInput.Icon
      rippleColor={"transparent"}
      size={ICON_SIZE}
      color={!!error || errorWithNoMessage ? colors.error : leftIconColor}
      name={leftIcon}
    />
  );
  const rightIconComponent = (!!rightIcon || !!leftIcon) && (
    <RNPTextInput.Icon
      onPress={rightIconOnPressCb}
      style={rightIconStyle}
      rippleColor={"transparent"}
      size={ICON_SIZE}
      color={!!error || errorWithNoMessage ? colors.error : rightIconColor}
      name={rightIcon ? rightIcon : "account"}
    />
  );

  return (
    <View style={textInputContainerStyles}>
      <RNPTextInput
        ref={forwardedRef}
        mode={mode}
        label={label}
        numberOfLines={numberOfLines}
        multiline={numberOfLines > 1}
        theme={textInputTheme}
        onChangeText={onChangeText}
        onBlur={onBlur}
        dense={dense}
        secureTextEntry={isPassword && !passwordVisible}
        placeholder={placeholder}
        error={!!error || errorWithNoMessage}
        outlineColor={colors.text}
        left={leftIconComponent}
        right={rightIconComponent}
        style={textInputStyles}
        testID={testID}
        {...register(name)}
        {...restOfProps}
      />
      {!!error && errorVisible && (
        <HelperText style={helperText} type="error" visible={!!error}>
          {`${error}`}
        </HelperText>
      )}
      {isPassword && (
        <View style={eyeIconStyle}>
          <RNPTextInput.Icon
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={colors.gray}
            onPress={handleOnClick}
          />
        </View>
      )}
    </View>
  );
};
export default forwardRef(TextInput);
