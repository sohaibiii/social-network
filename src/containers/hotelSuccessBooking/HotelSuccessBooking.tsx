import React, { useEffect, useMemo } from "react";
import { BackHandler, Linking, SafeAreaView, View } from "react-native";

import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import styles from "./HotelSuccessbooking.styles";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, Button } from "~/components/common";
import { clearHotelBooking } from "~/redux/reducers/hotels.reducer";
import {
  RETURNED_TO_HOMEPAGE,
  HOTEL_BOOKING_SUCCESS_PAGE_LOADED,
  logEvent,
  MY_ORDERS_PAGE_VISITED
} from "~/services/analytics";

const ANALYTICS_SOURCE = "hotel_booking_success_page";

const HotelSuccessBooking = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userToken = useSelector((state: RootState) => state.auth.userToken);

  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("Home");
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const onPageLoad = () =>
      logEvent(HOTEL_BOOKING_SUCCESS_PAGE_LOADED, {
        source: "hotel_booking_success_page"
      });
    onPageLoad();
  }, []);

  const handleNavigateToHome = async () => {
    dispatch(clearHotelBooking());

    await logEvent(RETURNED_TO_HOMEPAGE, { source: ANALYTICS_SOURCE });

    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "HomeTabs" }]
      })
    );
  };

  const handleVisitMyOrders = async () => {
    dispatch(clearHotelBooking());

    await logEvent(MY_ORDERS_PAGE_VISITED, { source: ANALYTICS_SOURCE });

    return navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "HomeTabs" },
          {
            name: "MyOrders"
          }
        ]
      })
    );
  };

  const {
    safeareaViewStyle,
    headerIconStyle,
    topParagraphStyle,
    middleParagraphStyle,
    bottomParagraphStyle,
    sectionStyle,
    whiteLabel,
    mainPageBtn,
    mainPageBtnLabel,
    bottomWrapperStyle
  } = useMemo(() => styles(colors), [colors]);

  return (
    <SafeAreaView style={safeareaViewStyle}>
      <Icon
        type={IconTypes.SAFARWAY_ICONS}
        name={"hotel_success"}
        style={headerIconStyle}
      />

      <CText fontFamily="medium" textAlign="center" style={topParagraphStyle}>
        {t("hotel_booking_success_title")}
      </CText>
      <CText
        fontFamily="light"
        textAlign="center"
        fontSize={14}
        style={middleParagraphStyle}
      >
        {t("hotel_booking_success_paragraph")}
      </CText>
      <CText
        fontFamily="light"
        textAlign="center"
        fontSize={14}
        style={bottomParagraphStyle}
      >
        {t("hotel_booking_success_thanks")}
      </CText>
      <CText fontFamily="light" textAlign="center" fontSize={14}>
        {t("hotel_booking_success_contact_info")}{" "}
        <CText
          fontFamily="light"
          fontSize={14}
          color="primary_reversed"
          onPress={handleSendEmail}
        >
          reservations@safarway.com
        </CText>
      </CText>
      <View style={bottomWrapperStyle}>
        {!!userToken && (
          <Button
            labelStyle={whiteLabel}
            style={sectionStyle}
            title={t("my_orders")}
            onPress={handleVisitMyOrders}
          />
        )}

        <Button
          labelStyle={mainPageBtnLabel}
          style={mainPageBtn}
          title={t("main")}
          onPress={handleNavigateToHome}
        />
      </View>
    </SafeAreaView>
  );
};

export default HotelSuccessBooking;
