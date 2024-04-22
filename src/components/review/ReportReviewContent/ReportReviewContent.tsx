import React, { memo, useCallback, useMemo, useState } from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import reportReviewContentStyle from "./ReportReviewContent.style";
import { ReportPostContentProps } from "./ReportReviewContent.types";

import { postService, reviewService } from "~/apiServices/index";
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
import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { ConfirmContent } from "~/components/post";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  REVIEW_CARD_REPORT_REVIEW,
  REVIEW_CARD_REPORT_REVIEW_FAILED,
  REVIEW_CARD_REPORT_REVIEW_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ReportReviewContent = (props: ReportPostContentProps): JSX.Element => {
  const { pkey = "", timestamp = 0, onBackPressedCb, analyticsType } = props || {};
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

  let reportEvent = "",
    reportEventSuccess = "",
    reportEventFailed = "";

  switch (analyticsType) {
    case ReviewCardAnalyticsTypes.ARTICLE:
      reportEvent = `article_details${REVIEW_CARD_REPORT_REVIEW}`;
      reportEventSuccess = `article_details${REVIEW_CARD_REPORT_REVIEW_SUCCESS}`;
      reportEventFailed = `article_details${REVIEW_CARD_REPORT_REVIEW_FAILED}`;
      break;

    default:
      reportEvent = `${analyticsType}${REVIEW_CARD_REPORT_REVIEW}`;
      reportEventSuccess = `${analyticsType}${REVIEW_CARD_REPORT_REVIEW_SUCCESS}`;
      reportEventFailed = `${analyticsType}${REVIEW_CARD_REPORT_REVIEW_FAILED}`;
      break;
  }
  const {
    container,
    textInputStyle,
    radioButtonStyle,
    submitButtonStyle,
    backArrowStyle,
    titleContainerStyle,
    submitButtonTextStyle
  } = reportReviewContentStyle(colors);

  const handleTextInputSelected = () => {
    modalizeContentRef?.current?.scrollToEnd();
  };

  const renderReportConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        onPress={() => modalizeRef.current?.close()}
        title={t("report_review_success")}
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

  const handleSubmitPressed = useCallback(async () => {
    setIsLoading(true);

    const analyticsProps = {
      source: analyticsType,
      pkey,
      timestamp,
      report_reason: radioProps[checked].key,
      other_reason: reportReason
    };
    await logEvent(reportEvent, analyticsProps);
    reviewService
      .reportReview(pkey, timestamp, radioProps[checked].key, reportReason)
      .then(() => {
        dispatch(
          showBottomSheet({
            Content: renderReportConfirmationContent,
            props: {
              flatListProps: null,
              modalHeight: APP_SCREEN_HEIGHT * 0.35
            }
          })
        );
        return logEvent(reportEventSuccess, analyticsProps);
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(reportEventFailed, analyticsProps);
      });
  }, [
    checked,
    dispatch,
    pkey,
    radioProps,
    renderReportConfirmationContent,
    reportReason,
    timestamp
  ]);

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={container}>
      <TouchableOpacity onPress={onBackPressedCb} style={backArrowStyle}>
        <Appbar.BackAction color={colors.primary} size={20} />
      </TouchableOpacity>
      <View style={titleContainerStyle}>
        <CText fontSize={14}>{t("report_reason")}</CText>
      </View>
      <RadioGroup onToggle={setChecked} defaultValue={checked}>
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
        title={t("reportReview")}
      />
    </View>
  );
};
export default memo(ReportReviewContent);
