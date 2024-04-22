import React, { memo, useMemo, useCallback, useState } from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import cancelOrderContentStyle from "./CancelOrderContent.styles";

import { myOrdersService } from "~/apiServices/index";
import { Button, CText, Icon, IconTypes, modalizeRef } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { ConfirmContent } from "~/components/post";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  ORDER_CANCELLATION_FAILED,
  ORDER_CANCELLATION_INITIATED,
  ORDER_CANCELLATION_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { scale } from "~/utils/";

const ANALYTICS_SOURCE = "my_orders_page";

const CancelOrderContent = (props): JSX.Element => {
  const { item, onBackPressedCb, onCancellationCb = () => undefined } = props || {};
  const {
    mid,
    reservation: { service }
  } = item || {};

  const cancellationPolicy = service?.cancellationPolicy?.policies[0];
  const { charge: cancellationCharge, date: cancellationDate } = cancellationPolicy || {};

  const currencySymbol =
    cancellationCharge?.currency === "USD" ? "$" : cancellationCharge?.currency;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    container,
    backArrowStyle,
    titleContainerStyle,
    bodyContainerStyle,
    cancellationChargeStyle,
    actionButtonsContainerStyle,
    actionButtonStyle,
    actionButtonTextStyle,
    cancelButtonStyle,
    backButtonStyle,
    backButtonTextStyle
  } = useMemo(() => cancelOrderContentStyle(colors), [colors]);

  const navigation = useNavigation();

  const renderCancelConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        onPress={modalizeRef.current?.close}
        title={t("order_cancellation_confirmation")}
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

  const handleCancelPressed = useCallback(async () => {
    setIsLoading(true);
    await logEvent(ORDER_CANCELLATION_INITIATED, {
      source: ANALYTICS_SOURCE,
      order_id: mid
    });
    myOrdersService
      .cancelOrder(mid)
      .then(async () => {
        onCancellationCb(mid);
        dispatch(
          showBottomSheet({
            Content: renderCancelConfirmationContent,
            props: {
              flatListProps: null,
              modalHeight: APP_SCREEN_HEIGHT * 0.35
            }
          })
        );
        await logEvent(ORDER_CANCELLATION_SUCCESS, {
          source: ANALYTICS_SOURCE,
          order_id: mid
        });
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
        return logEvent(ORDER_CANCELLATION_FAILED, {
          source: ANALYTICS_SOURCE,
          order_id: mid
        });
      })
      .finally(() => {
        modalizeRef.current?.close();
      });
  }, [dispatch, mid, navigation, onCancellationCb, renderCancelConfirmationContent]);

  const formatDate = date => moment(date).locale("en").format("DD-MM-YYYY");

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={container}>
      {onBackPressedCb && (
        <TouchableOpacity onPress={onBackPressedCb} style={backArrowStyle}>
          <Appbar.BackAction color={colors.primary} size={20} />
        </TouchableOpacity>
      )}

      <View style={titleContainerStyle}>
        <CText fontSize={14}>{t("cancel_order")}</CText>
      </View>
      <View style={bodyContainerStyle}>
        <CText fontSize={12}>
          {t("order_cancellation_message", { date: formatDate(cancellationDate) })}
        </CText>
        <CText
          fontSize={18}
          style={cancellationChargeStyle}
        >{`${currencySymbol}${cancellationCharge?.value}`}</CText>
      </View>
      <View style={actionButtonsContainerStyle}>
        <Button
          style={[actionButtonStyle, backButtonStyle]}
          onPress={onBackPressedCb || modalizeRef.current?.close}
          labelStyle={backButtonTextStyle}
          title={t("back")}
        />
        <Button
          isLoading={isLoading}
          style={[actionButtonStyle, cancelButtonStyle]}
          onPress={handleCancelPressed}
          labelStyle={actionButtonTextStyle}
          title={t("confirm")}
        />
      </View>
    </View>
  );
};
export default memo(CancelOrderContent);
