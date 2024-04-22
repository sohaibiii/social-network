import React, { memo, useCallback, useMemo } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { CardField, StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import hotelCheckoutPaymentStyles from "./HotelCheckoutPayment.styles";

import { RootState } from "~/redux/store";

import hotelsService from "~/apiServices/hotels";
import {
  Button,
  CText,
  HotelCountdown,
  ParallaxHeaderScrollView,
  ProgressiveImage
} from "~/components/";
import { ShowHotelDetailsButton } from "~/components/hotelBooking";
import { PLATFORM } from "~/constants/";
import hotelBookingStyles from "~/containers/hotelBooking/HotelBooking.styles";
import { hideOverlay, showOverlay } from "~/redux/reducers/overlayLoader.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackRoutesBookingProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  HOTEL_CHECKOUT_PAYMENT_ACTION_INITIATED,
  HOTEL_CHECKOUT_PAYMENT_FAILED,
  HOTEL_CHECKOUT_PAYMENT_INITIATED,
  HOTEL_CHECKOUT_PAYMENT_METHOD_FAIL,
  HOTEL_CHECKOUT_PAYMENT_METHOD_SUCCESS,
  HOTEL_CHECKOUT_PAYMENT_SUCCESS,
  logEvent
} from "~/services/analytics";
import { DarkTheme, LightTheme } from "~/theme/";
import { getAffiliate, logError, scale, verticalScale } from "~/utils/";
const ANALYTICS_SOURCE = "hotel_checkout_payment_page";

const HotelCheckoutPayment = (props: AppStackRoutesBookingProps): JSX.Element => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { createPaymentMethod, confirmPayment } = useStripe();

  const { hotelInfo, reservationInfo, paymentInfo, prebookInfo, occupancy } = useSelector(
    (state: RootState) => state.hotels.hotelsPayload
  );
  const resultsToken = useSelector((state: RootState) => state.hotels.resultsToken);
  const srk = useSelector((state: RootState) => state.hotels.srk);

  const { hotelIndex, hotelImage } = hotelInfo || {};
  const { offerId, packageToken, roomsToken, roomsInfo } = reservationInfo || {};
  const { paymentMethod, availabilityToken } = prebookInfo || {};

  const HeaderHeight = verticalScale(40) + insets.top;
  const parallaxHeaderHeight = verticalScale(200);

  const {
    safeAreaViewStyle,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderBackIconStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    coverImageStyle,
    containerStyle,
    titleTextStyle,
    stripeFormStyle,
    whiteLabel,
    payBtnStyle
  } = useMemo(
    () => hotelCheckoutPaymentStyles(theme, insets, parallaxHeaderHeight),
    [theme, insets, parallaxHeaderHeight]
  );

  const { countdownStyle, offerEndsInStyle, overlayWrapperStyle } = useMemo(
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

  const { name = "", email = "", country = { name: "" }, phoneNo = "" } = paymentInfo;

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  let formStyles = {};
  if (isThemeDark) {
    formStyles = {
      backgroundColor: DarkTheme.colors.profile.gradient2,
      borderRadius: 10,
      textColor: DarkTheme.colors.text,
      cursorColor: DarkTheme.colors.text,
      placeholderColor: DarkTheme.colors.text
    };
  } else {
    formStyles = {
      backgroundColor: LightTheme.colors.background,
      borderRadius: 10,
      textColor: LightTheme.colors.primary_blue,
      placeholderColor: LightTheme.colors.text
    };
  }

  const handlePayPressed = useCallback(async () => {
    dispatch(showOverlay({ visible: true, backgroundColor: theme.colors.overlay }));
    await logEvent(HOTEL_CHECKOUT_PAYMENT_INITIATED, { source: ANALYTICS_SOURCE });

    const affiliateIDOrNull = await getAffiliate();

    createPaymentMethod({
      paymentMethodType: "Card",
      billingDetails: {
        name: name,
        email: email,
        addressLine1: country.name,
        phone: phoneNo
      }
    }).then(async res => {
      const affiliateParams = affiliateIDOrNull
        ? {
            affiliateServiceType: "hotel",
            affiliateId: affiliateIDOrNull
          }
        : {};
      const bookPayload = {
        srk,
        hotelIndex,
        offerIndex: offerId,
        resultsToken,
        packageToken,
        paymentMethod,
        availabilityToken,
        paymentMethodId: res.paymentMethod?.id,
        payerName: name,
        payerEmail: email,
        payerAddress: country?.name,
        payerPhone: phoneNo,
        rooms: roomsInfo?.map((roomInfo, index) => {
          return {
            packageRoomToken: roomsToken[index],
            travelers: Array.from(Array(occupancy?.rooms[index]?.adults).keys())?.map(
              (occupancyRoom, innerIndex) => {
                return {
                  reference: `${index + 1}${innerIndex + 1}`,
                  lead: index === 0 && innerIndex === 0,
                  type: "adult",
                  title: "mr",
                  firstName: roomInfo.firstName,
                  lastName: roomInfo.lastName
                };
              }
            )
          };
        }),
        ...affiliateParams
      };

      if (res.error?.code === "Failed") {
        dispatch(hideOverlay());

        dispatch(
          showSnackbar({
            text: res.error?.localizedMessage,
            duration: 3000,
            backgroundColor: "red"
          })
        );
        return logEvent(HOTEL_CHECKOUT_PAYMENT_METHOD_FAIL, {
          source: ANALYTICS_SOURCE,
          error: res.error?.localizedMessage,
          ...bookPayload
        });
      }

      await logEvent(HOTEL_CHECKOUT_PAYMENT_METHOD_SUCCESS, {
        source: ANALYTICS_SOURCE,
        ...bookPayload
      });

      return hotelsService
        .book(srk, hotelIndex, offerId, resultsToken, bookPayload)
        .then(async data => {
          if (!data) {
            return;
          }

          const { success, requires_action, payment_intent_client_secret } = data || {};
          if (!!success && !requires_action) {
            dispatch(hideOverlay());
            await logEvent(`${HOTEL_CHECKOUT_PAYMENT_SUCCESS}`, {
              source: ANALYTICS_SOURCE,
              with_action: "none",
              ...bookPayload
            });
            navigation.navigate("HotelSuccessBooking");
            return null;
          }

          await logEvent(HOTEL_CHECKOUT_PAYMENT_ACTION_INITIATED, {
            source: ANALYTICS_SOURCE,
            with_action: "3D_secure",
            ...bookPayload
          });
          return confirmPayment(payment_intent_client_secret, {
            paymentMethodType: "Card"
          });
        })
        .then(async res => {
          if (!res) {
            return;
          }
          const { paymentIntent, error = {} } = res || {};
          dispatch(hideOverlay());

          if (paymentIntent) {
            await logEvent(`${HOTEL_CHECKOUT_PAYMENT_SUCCESS}`, {
              source: ANALYTICS_SOURCE,
              with_action: "3D_secure",
              ...bookPayload
            });
            return navigation.navigate("HotelSuccessBooking");
          }

          logError(
            `Error: handlePayPressed --HotelCheckoutPayment.tsx-- error=${error?.localizedMessage}`
          );

          dispatch(
            showSnackbar({
              text: error?.localizedMessage,
              duration: 6000,
              backgroundColor: "red"
            })
          );

          return logEvent(`${HOTEL_CHECKOUT_PAYMENT_FAILED}`, {
            source: ANALYTICS_SOURCE,
            error: error?.localizedMessage,
            with_action: "3D_secure",
            ...bookPayload
          });
        })
        .catch(error => {
          dispatch(hideOverlay());

          logError(
            `Error: handlePayPressed --HotelCheckoutPayment.tsx-- error=${error.message}`
          );

          dispatch(
            showSnackbar({
              text: t("something_went_wrong"),
              duration: 6000,
              backgroundColor: "red"
            })
          );

          return logEvent(`${HOTEL_CHECKOUT_PAYMENT_FAILED}`, {
            source: ANALYTICS_SOURCE,
            with_action: "none",
            ...bookPayload
          });
        });
    });
  }, [
    availabilityToken,
    country?.name,
    createPaymentMethod,
    dispatch,
    email,
    hotelIndex,
    name,
    navigation,
    occupancy?.rooms,
    offerId,
    packageToken,
    paymentMethod,
    phoneNo,
    resultsToken,
    roomsToken,
    srk,
    t,
    theme.colors.overlay
  ]);

  return (
    <StripeProvider publishableKey={Config.STRIPE_PKEY}>
      <View style={safeAreaViewStyle}>
        <Appbar.BackAction
          style={backIconStyle}
          color={"white"}
          size={scale(18)}
          onPress={navigation.goBack}
        />
        <ParallaxHeaderScrollView
          parallaxHeaderHeight={parallaxHeaderHeight}
          stickyHeaderHeight={HeaderHeight}
          parallaxHeader={renderParallaxHeader}
          stickyHeader={renderStickyHeader}
        >
          <KeyboardAvoidingView
            style={containerStyle}
            behavior={PLATFORM === "ios" ? "padding" : "height"}
          >
            <CText fontSize={14} lineHeight={19} style={titleTextStyle}>
              {t("booking.payment_info")}
            </CText>
            <CardField
              postalCodeEnabled={false}
              cardStyle={formStyles}
              style={stripeFormStyle}
            />

            <Button
              style={payBtnStyle}
              onPress={handlePayPressed}
              labelStyle={whiteLabel}
              title={t("booking.pay")}
            />
          </KeyboardAvoidingView>
        </ParallaxHeaderScrollView>
      </View>
    </StripeProvider>
  );
};

export default memo(HotelCheckoutPayment);
