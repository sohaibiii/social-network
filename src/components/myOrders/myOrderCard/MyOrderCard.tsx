import React, { useMemo, useCallback } from "react";
import { View, Image, UIManager, LayoutAnimation } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Card, Divider } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { CancelOrderContent } from "../cancelOrderContent";
import { ViewReceiptsContent } from "../viewReceiptsContent";

import myOrderCardStyles from "./MyOrderCard.styles";
import { MyOrderCardProps } from "./MyOrderCard.types";

import { CText, IconTypes, Icon, modalizeRef } from "~/components/common";
import { ReportPostButton } from "~/components/post";
import { PLATFORM } from "~/constants/variables";
import { MyOrdersTypes } from "~/containers/myOrders/MyOrders.types";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  CANCEL_ORDER_PRESSED,
  logEvent,
  ORDER_CANCELLATION_INITIATED,
  ORDER_MORE_SETTINGS_PRESSED,
  VIEW_ORDER_RECEIPTS_PRESSED
} from "~/services/analytics";
import { openURL } from "~/services/inappbrowser";
import { logError } from "~/utils/";
import { scale } from "~/utils/responsivityUtil";
import { currencyFormat } from "~/utils/stringUtil";

const ANALYTICS_SOURCE = "my_orders_page";
const MyOrderCard = (props: MyOrderCardProps): JSX.Element => {
  const { item, onCancellationCb } = props || {};
  const { canCancel = true } = item;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { amount, currency, hotelInfo, status, createdAt, mid, reservation } = item || {};
  const { shortDescription, mainImage, name } = hotelInfo || {};
  const mainHotelImage = mainImage?.url ?? "";
  const currencySymbol = currency === "USD" ? "$" : currency;
  const { service = {} } = reservation || {};
  const { serviceDates = {} } = service || {};
  const { startDate, endDate } = serviceDates || {};

  const styles = useMemo(() => myOrderCardStyles(colors), [colors]);
  const {
    cardStyle,
    headerWrapperStyle,
    mainImageStyle,
    headerTextWrapperStyle,
    cardContentStyle,
    hotelNameTextStyle,
    dividerStyle,
    cardActionsStyle,
    hotelNameWrapperStyle,
    statusTextWrapperStyle,
    statusTextStyle,
    bottomSpacing
  } = styles;

  const getStatusBgColor = useCallback(() => {
    switch (status) {
      case MyOrdersTypes.SUCCESS:
        return "rgb(234,248,243)";
      case MyOrdersTypes.CANCELED:
        return "rgb(230,230,232)";
      case MyOrdersTypes.CANCELED_AND_REFUNDED:
        return "rgb(230,230,232)";
      case MyOrdersTypes.ERROR:
        return "#eb6060";
      case MyOrdersTypes.PENDING:
        return "#F7CB73";
      default:
        return colors.gray;
    }
  }, [status, colors.gray]);

  const getStatusTextColor = useCallback(() => {
    switch (status) {
      case MyOrdersTypes.SUCCESS:
        return "rgb(82,137,106)";
      case MyOrdersTypes.CANCELED:
        return "rgb(149,151,158)";
      case MyOrdersTypes.CANCELED_AND_REFUNDED:
        return "rgb(149,151,158)";
      case MyOrdersTypes.ERROR:
        return colors.black;
      case MyOrdersTypes.PENDING:
        return "#FFF";

      default:
        return colors.gray;
    }
  }, [status, colors.gray, colors.black]);

  const statusTextStyles = useMemo(
    () => [
      statusTextStyle,
      {
        color: getStatusTextColor()
      }
    ],
    [statusTextStyle, getStatusTextColor]
  );

  const statusTextWrapperStyles = useMemo(
    () => [
      statusTextWrapperStyle,
      {
        backgroundColor: getStatusBgColor()
      }
    ],
    [statusTextWrapperStyle, getStatusBgColor]
  );

  const handleCancelOrder = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <CancelOrderContent
            onBackPressedCb={handleMoreOrderSettingsPressed}
            onCancellationCb={onCancellationCb}
            {...props}
          />
        ),
        props: {
          useDynamicSnapPoints: true,
          flatListProps: null
        },
        customProps: {
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
    await logEvent(CANCEL_ORDER_PRESSED, {
      source: ANALYTICS_SOURCE,
      order_id: mid
    });
  }, [dispatch, handleMoreOrderSettingsPressed, props]);

  const handleViewReceipts = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <ViewReceiptsContent
            onBackPressedCb={handleMoreOrderSettingsPressed}
            {...props}
          />
        ),
        props: {
          useDynamicSnapPoints: true,
          flatListProps: null
        },
        customProps: {
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
    await logEvent(VIEW_ORDER_RECEIPTS_PRESSED, {
      source: ANALYTICS_SOURCE,
      order_id: mid
    });
  }, [dispatch, handleMoreOrderSettingsPressed, props]);

  const navigateToOrderDetailsBottomSheet = useCallback(() => {
    modalizeRef.current?.close();
    navigation.navigate("MyOrderDetails", {
      orderId: mid,
      onCancellationCb: onCancellationCb
    });
  }, [navigation, mid]);

  const navigateToOrderDetails = useCallback(() => {
    navigation.navigate("MyOrderDetails", {
      orderId: mid,
      onCancellationCb: onCancellationCb
    });
  }, [navigation, mid]);

  const bottomSheetContent: Element = useCallback(() => {
    if (PLATFORM === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    return (
      <View layout={LayoutAnimation.easeInEaseOut()} style={bottomSpacing}>
        <>
          <CText fontSize={14} textAlign="center">
            {name}
          </CText>
          <ReportPostButton
            onPress={navigateToOrderDetailsBottomSheet}
            title={t("view_order_details")}
            description={t("view_order_details_description")}
            icon={
              <Icon
                type={IconTypes.FONTISTO}
                disabled
                name={"preview"}
                color={colors.text}
                size={scale(24)}
              />
            }
          />
          <ReportPostButton
            onPress={handleViewReceipts}
            title={t("view_receipt")}
            description={t("view_receipt_description")}
            icon={
              <Icon
                type={IconTypes.MATERIAL_ICONS}
                disabled
                name={"receipt-long"}
                color={colors.text}
                size={scale(24)}
              />
            }
          />
          {status === MyOrdersTypes.SUCCESS && canCancel && (
            <ReportPostButton
              title={t("cancel_order")}
              onPress={handleCancelOrder}
              description={t("cancel_order_description")}
              icon={
                <Icon
                  type={IconTypes.MATERIAL_ICONS}
                  disabled
                  name={"cancel"}
                  color={colors.text}
                  size={scale(25)}
                />
              }
            />
          )}
        </>
      </View>
    );
  }, [
    bottomSpacing,
    name,
    navigateToOrderDetailsBottomSheet,
    t,
    colors.text,
    handleViewReceipts,
    status,
    canCancel,
    handleCancelOrder
  ]);

  const handleMoreOrderSettingsPressed = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent
      })
    );
    await logEvent(ORDER_MORE_SETTINGS_PRESSED, {
      source: ANALYTICS_SOURCE,
      order_id: mid
    });
  }, [dispatch, bottomSheetContent, mid]);

  const formattedStartDate = moment(startDate).locale("en").format("DD/MM/YYYY");
  const formattedEndDate = moment(endDate).locale("en").format("DD/MM/YYYY");

  return (
    <Card style={cardStyle} elevation={2} onPress={navigateToOrderDetails}>
      <View style={headerWrapperStyle}>
        <Image source={{ uri: mainHotelImage }} style={mainImageStyle} />
        <View style={headerTextWrapperStyle}>
          <CText fontSize={15} color="black">
            {currencyFormat(amount, currencySymbol)}
          </CText>
          <CText fontSize={12} fontFamily="light">
            {shortDescription}
          </CText>
        </View>
      </View>

      <Card.Content style={cardContentStyle}>
        <View style={hotelNameWrapperStyle}>
          <CText fontSize={14} color={"gray"} style={hotelNameTextStyle}>
            {name}
          </CText>
        </View>

        <View style={statusTextWrapperStyles}>
          <CText fontFamily="regular" fontSize={14} style={statusTextStyles}>
            {t(`order_status.${status.toLowerCase().replaceAll("-", "_")}`)}
          </CText>
        </View>
      </Card.Content>
      <Divider style={dividerStyle} />

      <Card.Actions style={cardActionsStyle}>
        <CText fontSize={13} forceRTL>
          {`${formattedStartDate} - ${formattedEndDate}`}
        </CText>

        <Icon
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          name="dots-horizontal"
          size={30}
          color={colors.gray}
          onPress={handleMoreOrderSettingsPressed}
        />
      </Card.Actions>
    </Card>
  );
};

export default MyOrderCard;
