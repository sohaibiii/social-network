import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, SafeAreaView, ScrollView, Image } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme, Button } from "react-native-paper";
import { useDispatch } from "react-redux";

import myOrderDetailsStyles from "./MyOrderDetails.styles";

import myOrdersService from "~/apiServices/myOrders";
import { MyOrdersTypes } from "~/apiServices/myOrders/myOrders.types";
import { CText, Icon, IconTypes, RatingBar } from "~/components/common";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import {
  CancelOrderContent,
  MyOrderDetailsSkeleton,
  ViewReceiptsContent
} from "~/components/myOrders";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  CANCEL_ORDER_PRESSED,
  logEvent,
  ORDER_DETAILS_VISITED,
  VIEW_ORDER_RECEIPTS_PRESSED
} from "~/services/analytics";
import { logError, scale } from "~/utils/index";

const ANALYTICS_SOURCE = "order_details_page";
const MyOrderDetails = (props: any): JSX.Element => {
  const { route } = props;

  const { orderId, onCancellationCb = () => undefined } = route?.params || {};

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [orderDetails, setOrderDetails] = useState<MyOrdersTypes>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateOrderToCancelled = useCallback(
    (mid: string) => {
      onCancellationCb(mid);
      setOrderDetails(prev => ({ ...prev, canCancel: false }));
    },
    [onCancellationCb]
  );

  useEffect(() => {
    setIsLoading(true);
    myOrdersService
      .getMyOrderDetails(orderId)
      .then(res => {
        setOrderDetails(res?.data);
        return logEvent(ORDER_DETAILS_VISITED, {
          source: ANALYTICS_SOURCE,
          order_id: orderId
        });
      })
      .catch(err => {
        logError(
          `Error: getMyOrderDetails --MyOrderDetails.tsx-- orderId=${orderId} ${err}`
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderId]);

  const {
    ratingStyle,
    safeAreaViewStyle,
    contentContainerStyle,
    sectionWrapperStyle,
    headerIconStyle,
    infoSectionWrapper,
    infoSectionLabel,
    wrappedTextStyle,
    miniIconStyle,
    cityCountryTextStyle,
    wrapperStyle,
    imageStyle,
    actionWrapperStyle,
    cancelBtnStyle,
    viewReceiptStyle
  } = useMemo(() => myOrderDetailsStyles(colors), [colors]);
  const { hotelInfo = {}, reservation = {}, canCancel = false } = orderDetails;

  const { name, city, country, shortDescription, stars, address, telephone, mainImage } =
    hotelInfo || {};
  const { id: reservationId, service = {} } = reservation || {};
  const { serviceDates = {}, rooms = [], cancellationPolicy = {} } = service || {};
  const { startDate, endDate, duration } = serviceDates || {};
  const { policies = [] } = cancellationPolicy || {};

  const { charge: cancellationCharge, date: cancellationDate } = policies[0] || {};

  const imageSource = useMemo(() => ({ uri: `${mainImage?.url}` }), [mainImage?.url]);

  const generateCancellationMessage = () => {
    const formattedDate = moment(cancellationDate).locale("en").format("DD-MM-YYYY");

    const currencySymbol =
      cancellationCharge?.currency === "USD" ? "$" : cancellationCharge?.currency;

    return `${t("order_cancellation_message", {
      date: formattedDate
    })} ${currencySymbol}${cancellationCharge?.value}`;
  };

  const handleCancelOrder = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <CancelOrderContent
            item={orderDetails}
            onCancellationCb={updateOrderToCancelled}
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
      order_id: orderId
    });
  }, [dispatch, orderDetails, orderId]);

  const handleViewReceipts = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: () => <ViewReceiptsContent item={orderDetails} />,
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
      order_id: orderId
    });
  }, [dispatch, orderDetails, orderId]);

  if (isLoading) {
    return <MyOrderDetailsSkeleton />;
  }

  const formattedStartDate = moment(startDate).locale("en").format("DD/MM/YYYY hh:mm A");
  const formattedEndDate = moment(endDate).locale("en").format("DD/MM/YYYY hh:mm A");

  return (
    <SafeAreaView style={safeAreaViewStyle}>
      <ScrollView>
        <View>
          <Image source={imageSource} style={imageStyle} />
        </View>
        <View style={contentContainerStyle}>
          <View style={sectionWrapperStyle}>
            <View style={wrapperStyle}>
              <CText fontSize={16} fontFamily="medium">
                {name}
              </CText>
              <RatingBar
                ratingCount={5}
                defaultValue={stars}
                type={RatingComponentTypes.STAR}
                size={scale(16)}
                spacing={2}
                disabled
                containerStyle={ratingStyle}
              />
            </View>
            <CText fontSize={14} style={cityCountryTextStyle}>
              {`${city?.name}, ${country?.name}`}
            </CText>
          </View>
          <View style={sectionWrapperStyle}>
            <View style={wrapperStyle}>
              <Icon
                type={IconTypes.FONTAWESOME5}
                name="hotel"
                size={24}
                color={colors.black}
                style={headerIconStyle}
              />
              <CText fontSize={16} fontFamily="medium">
                {t("order_details_hotel_information")}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <Icon
                type={IconTypes.EVIL_ICONS}
                name="location"
                size={30}
                color={colors.black}
                style={miniIconStyle}
              />
              <CText fontSize={14} style={wrappedTextStyle}>
                {`${t("address")}: `}
                {
                  <CText fontSize={14} fontFamily="thin">
                    {address}
                  </CText>
                }
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <Icon
                type={IconTypes.FEATHER}
                name="phone"
                size={24}
                color={colors.black}
                style={miniIconStyle}
              />
              <CText fontSize={14} style={wrappedTextStyle}>
                {`${t("phone_number")}: `}
                {
                  <CText fontSize={14} fontFamily="thin">
                    {telephone}
                  </CText>
                }
              </CText>
            </View>

            <View style={infoSectionWrapper}>
              <Icon
                type={IconTypes.ENTYPO}
                name="info"
                size={24}
                color={colors.black}
                style={miniIconStyle}
              />
              <View>
                <CText fontSize={14} style={wrappedTextStyle}>
                  {`${t("other_information")}: `}
                </CText>
                <CText fontSize={14} fontFamily="thin">
                  {shortDescription}
                </CText>
              </View>
            </View>
          </View>
          <View style={sectionWrapperStyle}>
            <View style={wrapperStyle}>
              <Icon
                type={IconTypes.FONTAWESOME5}
                name="money-bill-wave"
                size={24}
                color={colors.black}
                style={headerIconStyle}
              />
              <CText fontSize={16} fontFamily="medium">
                {t("the_order")}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <CText fontSize={14} style={infoSectionLabel}>{`${t("order_id")}:`}</CText>
              <CText fontSize={14} fontFamily="thin">
                {reservationId}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <CText fontSize={14} style={infoSectionLabel}>{`${t("check_in")}:`}</CText>
              <CText fontSize={14} fontFamily="thin">
                {formattedStartDate}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <CText fontSize={14} style={infoSectionLabel}>{`${t("check_out")}:`}</CText>
              <CText fontSize={14} fontFamily="thin">
                {formattedEndDate}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <CText fontSize={14} style={infoSectionLabel}>{`${t(
                "duration_of_stay"
              )}:`}</CText>
              <CText fontSize={14} fontFamily="thin">{`${t("hotels.nights_humanized", {
                count: duration,
                context: `_${duration}`
              })}`}</CText>
            </View>
          </View>
          <View style={sectionWrapperStyle}>
            <View style={wrapperStyle}>
              <Icon
                type={IconTypes.ION_ICONS}
                name="bed"
                size={30}
                color={colors.black}
                style={headerIconStyle}
              />
              <CText fontSize={16} fontFamily="medium">
                {t("hotels.rooms")}
              </CText>
            </View>
            <View style={infoSectionWrapper}>
              <CText fontSize={14}>
                {`${t("room_information")}: `}
                {rooms.map(room => {
                  return (
                    <CText
                      key={room.id}
                      fontSize={14}
                      fontFamily="thin"
                    >{`${room.info}`}</CText>
                  );
                })}
              </CText>
            </View>
          </View>

          <View style={sectionWrapperStyle}>
            <View style={wrapperStyle}>
              <Icon
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                name="book-cancel"
                size={30}
                color={colors.black}
                style={headerIconStyle}
              />
              <CText fontSize={16} fontFamily="medium">
                {t("cancellation_policy")}
              </CText>
            </View>
            {policies.map(policy => {
              return (
                <View style={infoSectionWrapper} key={policy.date}>
                  <CText
                    fontSize={14}
                    fontFamily="thin"
                    style={wrappedTextStyle}
                  >{` ${generateCancellationMessage()}`}</CText>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={actionWrapperStyle}>
        {canCancel && (
          <Button
            mode="outlined"
            color={colors.danger_red}
            style={cancelBtnStyle}
            onPress={handleCancelOrder}
          >
            {t("cancel_order")}
          </Button>
        )}

        <Button
          mode="contained"
          color={colors.primary_blue}
          icon="export-variant"
          style={viewReceiptStyle}
          onPress={handleViewReceipts}
        >
          {t("view_receipt")}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default MyOrderDetails;
