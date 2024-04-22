import React, { memo, useCallback, useMemo, useState } from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import reportReplyContentStyle from "./ReportReplyContent.style";
import { ReportReplyContentProps } from "./ReportReplyContent.types";

import { commentsService } from "~/apiServices/index";
import {
  Button,
  CText,
  Icon,
  IconTypes,
  modalizeRef,
  RadioButton,
  RadioGroup,
  TextInput
} from "~/components/common";
import { modalizeContentRef } from "~/components/common/BottomSheet";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { ConfirmContent } from "~/components/post";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ReportReplyContent = (props: ReportReplyContentProps): JSX.Element => {
  const { pkey = "", index, onBackPressedCb } = props || {};
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(0);
  const [reportReason, setReportReason] = useState("");

  const radioProps = useMemo(
    () => [
      {
        label: t("reportAbuseReasons.inappropriate"),
        key: "bad_content",
        value: 0
      },
      {
        label: t("reportAbuseReasons.not_related"),
        key: "not_related",
        value: 1
      },
      {
        label: t("reportAbuseReasons.violates_intellectual_property"),
        key: "copyright",
        value: 2
      },
      {
        label: t("reportAbuseReasons.shady"),
        key: "misleading",
        value: 3
      },
      { label: t("reportAbuseReasons.others"), key: "other", value: 4 }
    ],
    [t]
  );

  const {
    container,
    textInputStyle,
    radioButtonStyle,
    submitButtonStyle,
    backArrowStyle,
    titleContainerStyle,
    submitButtonTextStyle
  } = reportReplyContentStyle(colors);

  const handleTextInputSelected = () => {
    modalizeContentRef?.current?.scrollToEnd();
  };

  const renderReportConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        onPress={() => modalizeRef.current?.close()}
        title={t("report_reply_success")}
        icon={
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="verified_user"
            width={scale(60)}
            height={scale(60)}
            color={"green"}
          />
        }
        confirmText={t("done")}
      />
    ),
    [t]
  );

  const handleSubmitPressed = useCallback(() => {
    setIsLoading(true);
    commentsService
      .reportReply(pkey, index, radioProps[checked].key, reportReason)
      .then(() =>
        dispatch(
          showBottomSheet({
            Content: renderReportConfirmationContent,
            props: {
              flatListProps: null,
              modalHeight: APP_SCREEN_HEIGHT * 0.4
            },
            customProps: {
              scrollViewProps: null
            }
          })
        )
      )
      .catch(() =>
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        )
      );
  }, [
    checked,
    dispatch,
    pkey,
    radioProps,
    renderReportConfirmationContent,
    reportReason,
    index
  ]);

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={container}>
      <TouchableOpacity onPress={onBackPressedCb} style={backArrowStyle}>
        <Appbar.BackAction color={colors.primary} size={20} />
      </TouchableOpacity>
      <View style={titleContainerStyle}>
        <CText fontSize={14}>{t("report_reason")}</CText>
      </View>
      <RadioGroup row={false} onToggle={setChecked} defaultValue={checked}>
        {radioProps.map(radioButton => (
          <RadioButton
            style={radioButtonStyle}
            key={radioButton.key}
            checked={checked}
            value={radioButton.value}
            label={radioButton.label}
          />
        ))}
      </RadioGroup>
      {checked === 4 && (
        <TextInput
          onChangeText={setReportReason}
          onFocus={handleTextInputSelected}
          autoFocus
          multiline
          style={textInputStyle}
        />
      )}
      <Button
        disabled={checked === 4 && reportReason.length === 0}
        isLoading={isLoading}
        style={submitButtonStyle}
        onPress={handleSubmitPressed}
        labelStyle={submitButtonTextStyle}
        title={t("report_reply")}
      />
    </View>
  );
};
export default memo(ReportReplyContent);
