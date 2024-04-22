import React, { memo, useCallback, useMemo } from "react";
import { View, KeyboardAvoidingView, Keyboard } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import hotelCheckoutStyles from "./HotelCheckout.styles";

import { RootState } from "~/redux/store";

import {
  Button,
  CText,
  HotelCountdown,
  ParallaxHeaderScrollView,
  ProgressiveImage
} from "~/components/";
import { FormikCountrySelector, FormikTextInput } from "~/components/formik";
import { ShowHotelDetailsButton } from "~/components/hotelBooking";
import { PLATFORM } from "~/constants/variables";
import hotelBookingStyles from "~/containers/hotelBooking/HotelBooking.styles";
import { setPaymentInfo } from "~/redux/reducers/hotels.reducer";
import { AppStackRoutesBookingProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { USER_ENTERED_CONTACT_INFORMATION, logEvent } from "~/services/analytics";
import { scale, useYupValidationResolver, verticalScale } from "~/utils/";
import { CheckoutSchema } from "~/validationSchemas/checkoutSchema";

const ANALYTICS_SOURCE = "hotel_checkout_info_page";

const HotelCheckout = (props: AppStackRoutesBookingProps) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();
  const hotelImage = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.hotelInfo.hotelImage
  );

  const {
    name = "",
    email: hotelsPayloadEmail = "",
    country: hotelsPayloadCountry = {},
    phoneNo: hotelsPayloadPhoneNo = ""
  } = useSelector((state: RootState) => state.hotels.hotelsPayload.paymentInfo);

  const {
    rooms = [
      {
        firstName: name,
        lastName: "",
        country: hotelsPayloadCountry,
        email: hotelsPayloadEmail,
        phoneNo: hotelsPayloadPhoneNo
      }
    ]
  } = {};

  const resolver = useYupValidationResolver(CheckoutSchema(t));
  const { control, handleSubmit } = useForm({
    resolver,
    mode: "onSubmit"
  });

  const { firstName = "", lastName = "", country, email = "", phoneNo = "" } = rooms[0];
  const HeaderHeight = verticalScale(40) + insets.top;
  const parallaxHeaderHeight = verticalScale(260);

  const {
    safeAreaViewStyle,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderBackIconStyle,
    parallaxHeaderWrapperStyle,
    overlayWrapperStyle,
    parallaxHeaderTouchableStyle,
    coverImageStyle,
    containerStyle,
    submitButtonStyle,
    whiteLabel,
    nameStyle,
    flexStyle
  } = useMemo(
    () => hotelCheckoutStyles(theme, insets, parallaxHeaderHeight),
    [theme, insets, parallaxHeaderHeight]
  );

  const { countdownStyle, offerEndsInStyle } = useMemo(
    () => hotelBookingStyles(theme, insets, parallaxHeaderHeight),
    [theme, insets, parallaxHeaderHeight]
  );

  const renderStickyHeader = useCallback(() => {
    return (
      <View style={stickyHeaderWrapperStyle}>
        <Appbar.BackAction
          style={stickyHeaderBackIconStyle}
          color={"white"}
          size={scale(18)}
          onPress={navigation.goBack}
        />
      </View>
    );
  }, [navigation.goBack, stickyHeaderBackIconStyle, stickyHeaderWrapperStyle]);

  const renderParallaxHeader = useCallback(() => {
    return (
      <View style={parallaxHeaderWrapperStyle}>
        <View style={parallaxHeaderTouchableStyle}>
          {!!hotelImage && (
            <ProgressiveImage
              style={coverImageStyle}
              resizeMode={"cover"}
              thumbnailSource={hotelImage}
              source={hotelImage}
              errorSource={hotelImage}
            />
          )}
        </View>
        <ShowHotelDetailsButton analyticsSource={ANALYTICS_SOURCE} />
        <View style={countdownStyle}>
          <CText style={offerEndsInStyle} color={"white"} fontSize={14}>
            {t("offer_ends_in")}
          </CText>
          <HotelCountdown />
        </View>
        <View style={overlayWrapperStyle} />
      </View>
    );
  }, [
    countdownStyle,
    coverImageStyle,
    hotelImage,
    offerEndsInStyle,
    overlayWrapperStyle,
    parallaxHeaderTouchableStyle,
    parallaxHeaderWrapperStyle,
    t,
    whiteLabel
  ]);

  const handleContinuePressed = useCallback(
    async data => {
      dispatch(setPaymentInfo(data));
      await logEvent(USER_ENTERED_CONTACT_INFORMATION, { source: ANALYTICS_SOURCE });
      return navigation.navigate("HotelCheckoutPayment");
    },
    [dispatch, navigation]
  );

  const nameDefaultValue = firstName && lastName ? `${firstName} ${lastName}` : "";

  return (
    <View style={safeAreaViewStyle}>
      <Appbar.BackAction
        style={backIconStyle}
        color={"white"}
        size={scale(18)}
        onPress={navigation.goBack}
      />
      <KeyboardAvoidingView
        behavior={PLATFORM === "ios" ? "padding" : "height"}
        style={flexStyle}
      >
        <ParallaxHeaderScrollView
          parallaxHeaderHeight={parallaxHeaderHeight}
          stickyHeaderHeight={HeaderHeight}
          parallaxHeader={renderParallaxHeader}
          stickyHeader={renderStickyHeader}
        >
          <View style={containerStyle}>
            <CText fontSize={14}>{t("booking.payment_info")}</CText>
            <FormikTextInput
              name={"name"}
              control={control}
              defaultValue={`${firstName} ${lastName}`}
              label={t("creditCard.nameSurname")}
              style={nameStyle}
            />
            <FormikTextInput
              name={"email"}
              control={control}
              defaultValue={email}
              label={t("email")}
              keyboardType={"email-address"}
              shouldTrim
              style={nameStyle}
            />
            <FormikTextInput
              name={"phoneNo"}
              keyboardType={"numeric"}
              control={control}
              defaultValue={phoneNo}
              label={t("phone")}
            />
            <FormikCountrySelector
              control={control}
              defaultValue={country}
              onPressCb={Keyboard.dismiss}
              name={`country`}
              label={t("country")}
            />

            <Button
              labelStyle={whiteLabel}
              title={t("continue")}
              style={submitButtonStyle}
              onPress={handleSubmit(handleContinuePressed)}
            />
          </View>
        </ParallaxHeaderScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default memo(HotelCheckout);
