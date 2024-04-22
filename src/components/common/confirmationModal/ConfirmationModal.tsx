import React, { FC, memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import confirmationModalStyles from "./confirmationModal.styles";
import { ConfirmationModalProps } from "./confirmationModal.types";

import { CText, Icon, IconTypes, Button } from "~/components/";
import { scale } from "~/utils/";

const ConfirmationModal: FC<ConfirmationModalProps> = props => {
  const {
    description,
    confirmText,
    cancelTitle,
    confirmColor,
    onConfirmCb = () => undefined,
    onExitCb = () => undefined
  } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    containerStyle,
    headerContainerStyle,
    closeButtonStyle,
    headerTextStyle,
    descriptionContainerStyle,
    descriptionTextStyle,
    actionsContainerStyle,
    saveButtonContainerStyle,
    saveButtonTextStyle,
    saveButtonStyle,
    exitButtonContainerStyle,
    exitButtonTextStyle
  } = confirmationModalStyles(colors, confirmColor);

  return (
    <View style={containerStyle}>
      <View style={headerContainerStyle}>
        <Icon
          onPress={onExitCb}
          style={closeButtonStyle}
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          size={scale(16)}
          name={"close"}
          color={"black"}
        />
        <CText fontSize={14} lineHeight={18} style={headerTextStyle} textAlign={"center"}>
          {t("warning")}
        </CText>
      </View>
      <View style={descriptionContainerStyle}>
        <CText style={descriptionTextStyle} fontSize={13}>
          {description}
        </CText>
      </View>
      <View style={actionsContainerStyle}>
        <TouchableOpacity onPress={onExitCb} style={exitButtonContainerStyle}>
          <CText style={exitButtonTextStyle}>{cancelTitle}</CText>
        </TouchableOpacity>
        <View style={saveButtonContainerStyle}>
          <Button
            onPress={onConfirmCb}
            labelStyle={saveButtonTextStyle}
            title={confirmText}
            style={saveButtonStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(ConfirmationModal);
