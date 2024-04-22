import React from "react";
import { ActionSheetIOS, TouchableOpacity, View } from "react-native";

import { TouchableRipple, useTheme, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

import { ActionSheetType } from "./ActionSheet.types";

import { RootState } from "~/redux/store";

import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ActionSheet = (props: ActionSheetType): JSX.Element => {
  const { colors } = useTheme();
  const {
    style = {},
    options,
    icon = "image-edit-outline",
    iconColor = colors.primary,
    textStyle,
    mediaType = "mixed",
    text,
    buttonStyle
  } = props;

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const optionsArray = [translate("cancel")].concat(options.map(option => option.title));

  const handleOpenEdit = () => {
    if (mediaType !== "mixed") {
      options.find(option => option?.id === mediaType)?.callback();
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: optionsArray,
        userInterfaceStyle: isThemeDark ? "dark" : "light",
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          return;
        }
        const clickedOption = options[buttonIndex - 1];
        if (clickedOption.callback) {
          clickedOption.callback();
        }
      }
    );
  };

  return (
    <TouchableOpacity style={style} onPress={handleOpenEdit}>
      <View style={buttonStyle}>
        <Icon color={iconColor} size={scale(20)} name={icon} />
        {!!text && <Text style={textStyle}>{text}</Text>}
      </View>
    </TouchableOpacity>
  );
};
export default ActionSheet;
