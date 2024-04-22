import React, { memo, useEffect, useState, useCallback, useMemo } from "react";
import { StatusBar, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { Appbar, useTheme } from "react-native-paper";
import { HelperText } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import hotelBookingStyles from "./HotelBooking.styles";

import { RootState } from "~/redux/store";

import {
  Button,
  CText,
  HotelCountdown,
  ParallaxHeaderScrollView,
  ProgressiveImage
} from "~/components/";
import { FormikCheckbox } from "~/components/formik";
import {
  CancellationPolicyContent,
  ShowHotelDetailsButton
} from "~/components/hotelBooking";
import { FormikRoomBookingForm } from "~/components/hotels";
import { APP_SCREEN_HEIGHT, PLATFORM } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setRoomsInfo, clearPaymentInfo } from "~/redux/reducers/hotels.reducer";
import { AppStackRoutesBookingProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  USER_AGREED_TO_BOOKING_TERMS,
  logEvent,
  openURL,
  ROOMS_SELECTED
} from "~/services/";
import { scale, verticalScale } from "~/utils/";
import { RoomSelectorSchema } from "~/validationSchemas/roomSelectorSchema";

const ANALYTICS_SOURCE = "hotel_booking_terms_page";

const HotelBooking = (props: AppStackRoutesBookingProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { occupancy, hotelInfo, reservationInfo } = useSelector(
    (state: RootState) => state.hotels.hotelsPayload
  );

  const cancellationInfo = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.cancellationInfo
  );

  const { hotelImage } = hotelInfo || {};
  const { offerId, packageToken } = reservationInfo || {};

  const { rooms: roomsDetails = [] } = occupancy?.rooms || {};

  const [isTimeoutModalVisible, setIsTimeoutModalVisible] = useState(false);
  const [isCancellationVisible, setIsCancellationVisible] = useState(false);
  const parallaxHeaderHeight = verticalScale(260);
  const HeaderHeight = verticalScale(40) + insets.top;

  const resolver = yupResolver(RoomSelectorSchema(t));

  const formikRooms =
    occupancy?.rooms?.map(room => {
      return { firstName: "", lastName: "" };
    }) ?? [];

  const {
    control,
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      rooms: formikRooms
    }
  });

  const { fields, append } = useFieldArray({ name: "rooms", control });

  const {
    safeAreaViewStyle,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderBackIconStyle,
    countdownStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    overlayWrapperStyle,
    coverImageStyle,
    offerEndsInStyle,
    containerStyle,
    clickableTermsStyle,
    checkboxStyle,
    checkboxContainerStyle,
    whiteLabel,
    continueBtnStyle,
    flexStyle,
    checkboxLabelStyle
  } = useMemo(
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      dispatch(clearPaymentInfo());
    });

    return unsubscribe;
  }, [dispatch, navigation]);

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

  useEffect(() => {
    for (let i = 0; i < roomsDetails.length; i++) {
      append({ name: "", email: "" });
    }
  }, [append, roomsDetails?.length]);

  useEffect(() => {
    const onLoad = () => {
      const countOfRooms = occupancy?.rooms?.length;
      const isPackage = countOfRooms > 1;

      return logEvent(ROOMS_SELECTED, {
        source: ANALYTICS_SOURCE,
        is_package: isPackage,
        count_of_rooms: countOfRooms,
        offer_id: offerId,
        package_token: packageToken
      });
    };

    onLoad();
  }, []);

  const handleContinuePressed = async data => {
    const roomsInfo = data?.rooms ?? [];
    const roomsInfoCopy = [...roomsInfo];
    dispatch(setRoomsInfo(roomsInfoCopy));
    await logEvent(USER_AGREED_TO_BOOKING_TERMS, {
      source: ANALYTICS_SOURCE
    });
    navigation.navigate("HotelCheckout");
  };

  const handleCancellationClicked = useCallback(() => {
    setIsCancellationVisible(true);

    dispatch(
      showBottomSheet({
        Content: () => <CancellationPolicyContent cancellationInfo={cancellationInfo} />,
        props: {
          style: {
            marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight
          },
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
  }, [cancellationInfo, dispatch]);

  const handleTermsClicked = useCallback(() => {
    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  }, []);

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
            <View>
              <CText fontSize={18}>{t("booking.guest_information")}</CText>
              {fields.map((_item, index: number) => (
                <FormikRoomBookingForm
                  name={""}
                  register={register}
                  control={control}
                  index={index}
                  key={index}
                />
              ))}
              {!!cancellationInfo && (
                <View style={checkboxContainerStyle}>
                  <FormikCheckbox
                    style={checkboxStyle}
                    control={control}
                    name={"cancellation_policy"}
                    labelStyle={checkboxLabelStyle}
                    label={t("booking.agree_to")}
                    disableError
                  />
                  <TouchableOpacity
                    style={clickableTermsStyle}
                    onPress={handleCancellationClicked}
                  >
                    <CText color={"primary_reversed"} fontSize={13} lineHeight={15}>
                      {t("booking.cancellation_policy")}
                    </CText>
                  </TouchableOpacity>
                </View>
              )}
              <View style={checkboxContainerStyle}>
                <FormikCheckbox
                  style={checkboxStyle}
                  control={control}
                  name={"safarway_terms"}
                  labelStyle={checkboxLabelStyle}
                  label={t("booking.agree_to")}
                  disableError
                />
                <TouchableOpacity
                  style={clickableTermsStyle}
                  onPress={handleTermsClicked}
                >
                  <CText color={"primary_reversed"} fontSize={13} lineHeight={15}>
                    {t("booking.safarway_terms")}
                  </CText>
                </TouchableOpacity>
              </View>
              <FormikCheckbox
                style={checkboxStyle}
                control={control}
                name={"images_terms"}
                labelStyle={checkboxLabelStyle}
                containerStyle={checkboxContainerStyle}
                label={t("booking.images_terms")}
                disableError
              />
              <FormikCheckbox
                style={checkboxStyle}
                control={control}
                name={"price_terms"}
                labelStyle={checkboxLabelStyle}
                containerStyle={checkboxContainerStyle}
                label={t("booking.price_terms")}
                disableError
              />
              {(!!errors?.safarway_terms ||
                !!errors?.price_terms ||
                !!errors?.images_terms ||
                !!errors?.cancellation_policy) && (
                <HelperText type="error" visible>
                  {`${t("booking.accept_all")}`}
                </HelperText>
              )}
              <Button
                labelStyle={whiteLabel}
                style={continueBtnStyle}
                title={t("continue")}
                onPress={handleSubmit(handleContinuePressed)}
              />
            </View>
          </View>
        </ParallaxHeaderScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default memo(HotelBooking);
