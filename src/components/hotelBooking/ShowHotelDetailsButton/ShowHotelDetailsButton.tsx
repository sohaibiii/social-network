import React, { memo, useCallback } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ShowHotelDetailsButton.styles";
import { ShowHotelDetailsButtonProps } from "./ShowHotelDetailsButton.types";

import { RootState } from "~/redux/store";

import { CText, IconTypes, Icon, RatingBar } from "~/components/";
import { RoomSelectorType } from "~/components/hotelsSearch/RoomSelectorContent/RoomSelectorContent.types";
import { PLATFORM } from "~/constants/";
import {
  HUMAN_READABLE_FORMAT_SHORT_MONTHS,
  SHORT_MONTHS_AND_DAYS
} from "~/constants/moment";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { logEvent, SHOW_BOOKING_DETAILS_PRESSED } from "~/services/";
import { scale } from "~/utils/";

const ShowHotelDetailsButton = (props: ShowHotelDetailsButtonProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { analyticsSource } = props;

  const { occupancy, hotelInfo, reservationInfo } = useSelector(
    (state: RootState) => state.hotels.hotelsPayload
  );
  const { checkin, checkout } = useSelector(
    (state: RootState) => state.hotels.calendarPayload
  );
  const { rooms: roomsDetails = [] } = occupancy?.rooms || {};
  const { price } = reservationInfo || {};

  const childrenCount = roomsDetails?.reduce(
    (prev: number, current: RoomSelectorType) => prev + (current.children || 0),
    0
  );

  const language = useSelector((state: RootState) => state.settings.language);

  const { name: hotelName, rating: hotelRating } = hotelInfo || {};
  const {
    iconStyle,
    bookingDetailsHeaderText,
    flexShrink,
    sectionStyle,
    showBookingDetailsButton
  } = styles(colors);
  const renderSearchContent = useCallback(() => {
    return (
      <SafeAreaView style={iconStyle}>
        <View style={sectionStyle}>
          <CText fontSize={16} lineHeight={21} style={bookingDetailsHeaderText}>
            {t("hotels.hotelName")}:
          </CText>
          <CText fontSize={16} lineHeight={21} style={flexShrink}>
            {hotelName}
          </CText>
        </View>
        <View style={sectionStyle}>
          <CText fontSize={16} lineHeight={21} style={bookingDetailsHeaderText}>
            {t("hotels.hotel_rating")}:
          </CText>
          <RatingBar
            ratingCount={5}
            defaultValue={hotelRating}
            size={scale(20)}
            disabled
          />
        </View>
        <View>
          <View style={sectionStyle}>
            <Icon
              name="calendar"
              width={scale(16)}
              height={scale(16)}
              style={iconStyle}
              color={colors.text}
              type={IconTypes.SAFARWAY_ICONS}
            />
            <CText fontSize={14} color={"text"}>
              {`${moment(checkin).locale("en").format("D")} ${moment(checkin)
                .locale(language)
                .format("MMM")} - ${moment(checkout).locale("en").format("D")} ${moment(
                checkout
              )
                .locale(language)
                .format("MMM")} ${moment(checkout).locale("en").format("YYYY")}`}
            </CText>
          </View>
          <View style={sectionStyle}>
            <Icon
              name="weather-night"
              size={scale(16)}
              style={iconStyle}
              color={colors.text}
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            />
            <CText fontSize={14} color={"text"}>
              {t("hotels.nights_humanized", {
                count: Math.round(moment(checkout).diff(moment(checkin), "days", true))
              })}
            </CText>
          </View>
          {childrenCount > 0 && (
            <View style={sectionStyle}>
              <Icon
                name="baby-face-outline"
                size={scale(16)}
                style={iconStyle}
                color={colors.text}
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              />
              <CText fontSize={14} color={"text"}>
                {t("hotels.children_humanized", {
                  count: childrenCount
                })}
              </CText>
            </View>
          )}
          <View style={sectionStyle}>
            <CText fontSize={16} lineHeight={21} style={bookingDetailsHeaderText}>
              {t("booking.required_price")}:
            </CText>
            <CText
              color={"primary"}
              fontSize={16}
              lineHeight={21}
              style={bookingDetailsHeaderText}
            >
              {`${price?.value} ${t(price?.currency)}`}
            </CText>
          </View>
        </View>
      </SafeAreaView>
    );
  }, [
    bookingDetailsHeaderText,
    checkin,
    checkout,
    childrenCount,
    colors.text,
    flexShrink,
    hotelName,
    hotelRating,
    iconStyle,
    price?.currency,
    price?.value,
    sectionStyle,
    t
  ]);

  const showBookingDetails = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderSearchContent,
        props: {
          modalBackgroundColor: colors.background,
          flatListProps: null,
          scrollViewProps: null,
          HeaderComponent: null,
          shouldKeyboardDismiss: false,
          keyboardAvoidingBehavior: PLATFORM === "ios" ? "padding" : null
        }
      })
    );

    return logEvent(SHOW_BOOKING_DETAILS_PRESSED, { source: analyticsSource });
  }, [dispatch, renderSearchContent, colors.background, analyticsSource]);

  return (
    <TouchableOpacity
      onPress={showBookingDetails}
      activeOpacity={0.8}
      style={showBookingDetailsButton}
    >
      <CText color="white" fontSize={14}>
        {t("booking.show_details")}
      </CText>
    </TouchableOpacity>
  );
};

export default memo(ShowHotelDetailsButton);
