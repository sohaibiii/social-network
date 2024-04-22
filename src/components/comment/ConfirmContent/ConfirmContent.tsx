import React, {memo, useState} from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";

import { Appbar, useTheme } from "react-native-paper";

import confirmContentStyle from "./ConfirmContent.style";
import { ConfirmContentProps } from "./ConfirmContent.types";

import { Button, CText } from "~/components/common";

const ConfirmContent = (props: ConfirmContentProps): JSX.Element => {
  const {
    title = "",
    description = "",
    onPress = () => undefined,
    icon = <View />,
    confirmText = "",
    cancelText = "",
    onBackPressedCb,
    hasLoading = false
  } = props || {};

  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnPress = () => {
    setIsLoading(true);
    onPress();
  };

  const {
    container,
    cancelTextStyle,
    confirmTextStyle,
    textContainerStyle,
    buttonsContainerStyle,
    buttonStyle,
    backArrowStyle,
    descriptionTextStyle,
    flex
  } = confirmContentStyle(colors);

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={container}>
      {!!onBackPressedCb && (
        <TouchableOpacity onPress={onBackPressedCb} style={backArrowStyle}>
          <Appbar.BackAction color={colors.primary} size={20} />
        </TouchableOpacity>
      )}
      {icon}
      <View style={textContainerStyle}>
        <CText fontSize={14}>{title}</CText>
        {!!description && (
          <CText fontSize={11} style={descriptionTextStyle}>
            {description}
          </CText>
        )}
      </View>
      <View style={buttonsContainerStyle}>
        {!!cancelText && (
          <TouchableOpacity onPress={onBackPressedCb} style={flex}>
            <CText fontSize={12} lineHeight={16} style={cancelTextStyle}>
              {cancelText}
            </CText>
          </TouchableOpacity>
        )}
        <Button
          isLoading={hasLoading && isLoading}
          style={buttonStyle}
          onPress={handleOnPress}
          labelStyle={confirmTextStyle}
          title={confirmText}
        />
      </View>
    </View>
  );
};
export default memo(ConfirmContent);
