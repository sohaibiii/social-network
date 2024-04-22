import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import Modal from "react-native-modal";
import { useTheme, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ActionSheetType } from "./ActionSheet.types";

import actionSheetStyle from "~/components/common/ActionSheet/ActionSheet.style";
import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ActionSheet = (props: ActionSheetType): JSX.Element => {
  const { colors } = useTheme();
  const {
    style = {},
    options,
    icon = "image-edit-outline",
    iconColor = colors.primary,
    mediaType = "mixed",
    textStyle,
    text,
    buttonStyle,
    actionTitle = ""
  } = props;
  const [isVisible, setIsVisible] = useState(false);

  const hideSheet = () => {
    setIsVisible(false);
  };

  const showSheet = () => {
    if (mediaType !== "mixed") {
      options.find(option => option?.id === mediaType)?.callback();
      return;
    }
    setIsVisible(true);
  };

  const {
    row,
    dividerLine,
    optionsContainer,
    actionSheetContainer,
    titleText,
    optionText,
    containerStyle
  } = actionSheetStyle(colors);

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} style={style} onPress={showSheet}>
        <View style={buttonStyle}>
          <Icon color={iconColor} size={scale(20)} name={icon} />
          {!!text && <Text style={textStyle}>{text}</Text>}
        </View>
      </TouchableOpacity>
      {/* Todo use different method to implement feeding */}

      <Modal
        onBackButtonPress={hideSheet}
        isVisible={isVisible}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        avoidKeyboard
        statusBarTranslucent
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        onBackdropPress={hideSheet}
        onSwipeComplete={hideSheet}
        onDismiss={hideSheet}
      >
        <View style={containerStyle}>
          <View style={actionSheetContainer}>
            <Text style={titleText}>{actionTitle}</Text>
            <View style={dividerLine} />
            <View style={optionsContainer}>
              {options.map(option => {
                const { title = "", callback = () => undefined, icon } = option;

                const onOptionSelected = () => {
                  hideSheet();
                  callback();
                };

                return (
                  <TouchableOpacity key={title} style={row} onPress={onOptionSelected}>
                    {!!icon && <Icon name={icon} color={colors.text} size={scale(22)} />}
                    <Text style={optionText}>{title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default ActionSheet;
