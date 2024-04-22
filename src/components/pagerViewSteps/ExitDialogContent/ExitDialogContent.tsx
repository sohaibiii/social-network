import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme, Checkbox } from "react-native-paper";

import exitDialogContentStyles from "./ExitDialogContent.style";
import { ExitDialogContentProps } from "./ExitDialogContent.types";

import { CText, Icon, IconTypes, Button } from "~/components/";
import { scale } from "~/utils/";

const ExitDialogContent = (props: ExitDialogContentProps): JSX.Element => {
  const {
    withSaveWork = true,
    onCancelCb = () => undefined,
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
    checkboxTextStyle,
    checkboxStyle,
    checkboxContainerStyle,
    actionsContainerStyle,
    saveButtonContainerStyle,
    saveButtonTextStyle,
    saveButtonStyle,
    exitButtonContainerStyle,
    exitButtonTextStyle
  } = exitDialogContentStyles(colors);
  const [shouldSaveWork, setShouldSaveWork] = useState(true);

  const handleCheckboxClicked = () => {
    setShouldSaveWork(state => !state);
  };

  return (
    <View style={containerStyle}>
      <View style={headerContainerStyle}>
        <Icon
          onPress={onCancelCb}
          style={closeButtonStyle}
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          size={scale(16)}
          name={"close"}
          color={colors.text}
        />
        <CText fontSize={14} lineHeight={18} style={headerTextStyle} textAlign={"center"}>
          {t(withSaveWork ? "save_work.title" : "warning")}
        </CText>
      </View>
      <View style={descriptionContainerStyle}>
        <CText style={descriptionTextStyle} fontSize={13}>
          {t(withSaveWork ? "save_work.description" : "save_work.title")}
        </CText>
        {withSaveWork && (
          <View style={checkboxContainerStyle}>
            <Checkbox.Item
              onPress={handleCheckboxClicked}
              mode={"android"}
              position="leading"
              style={checkboxStyle}
              labelStyle={checkboxTextStyle}
              label={t("save_work.checkbox_save")}
              status={shouldSaveWork ? "checked" : "unchecked"}
            />
          </View>
        )}
      </View>
      <View style={actionsContainerStyle}>
        <TouchableOpacity
          onPress={() => onExitCb(shouldSaveWork)}
          style={exitButtonContainerStyle}
        >
          <CText style={exitButtonTextStyle}>{t("save_work.exit")}</CText>
        </TouchableOpacity>
        <View style={saveButtonContainerStyle}>
          <Button
            onPress={onCancelCb}
            labelStyle={saveButtonTextStyle}
            title={t("save_work.save")}
            style={saveButtonStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default ExitDialogContent;
