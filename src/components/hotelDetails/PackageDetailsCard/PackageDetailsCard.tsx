import React, { memo, useMemo, useState } from "react";
import { Pressable, ScrollView, StatusBar, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Card, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import packageDetailsCardStyle from "./PackageDetailsCard.style";
import { PackageDetailsCardProps } from "./PackageDetailsCard.types";

import { RootState } from "~/redux/store";

import { hotelsService } from "~/apiServices/index";
import { ArticleMarkdown } from "~/components/articles";
import { Button, CText } from "~/components/common";
import { PackageRoomDetailsCard } from "~/components/hotelDetails";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import {
  setHotelInfo,
  seReservationInfo,
  setPrebookInfo,
  setCancellationInfo
} from "~/redux/reducers/hotels.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  PACKAGE_BOOK_PRESSED,
  SHOW_PACKAGE_DESCRIPTION_PRESSED
} from "~/services/analytics";
import { logError } from "~/utils/";

const PackageDetailsCard = (props: PackageDetailsCardProps): JSX.Element => {
  const { packageParam, index, hotel = {}, analyticsSource = "" } = props;

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { name = "", stars = 0, id = "", mainImage = {} } = hotel;
  const { packageRooms = [], price = {}, packageToken } = packageParam;
  const { roomReferences = {} } = packageRooms[0] || {};
  const { offerId } = roomReferences[0] || {};

  const resultsToken = useSelector((state: RootState) => state.hotels.resultsToken);

  const srkToken = useSelector((state: RootState) => state.hotels.srk);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    containerStyle,
    row,
    flex,
    roomSectionTextStyle,
    bookingContainerStyle,
    bookingWrapperStyle,
    whiteTextStyle,
    bookingStyle,
    descriptionStyle,
    markdownStyle
  } = useMemo(() => packageDetailsCardStyle(colors), [colors]);

  const handleOnBookPressed = async () => {
    setIsLoadingData(true);

    const { roomReferences = {} } = packageRooms[0] || {};
    const { offerId, roomToken } = roomReferences[0] || {};

    const roomsToken = packageRooms?.map(packageRoom => {
      const { roomToken } = packageRoom?.roomReferences[0] || {};
      return roomToken;
    });
    const { value = 0, currency = "" } = price?.selling || {};

    dispatch(
      setHotelInfo({
        name,
        rating: stars,
        hotelIndex: id,
        hotelImage: { uri: mainImage?.url?.replace("http", "https") }
      })
    );
    dispatch(
      seReservationInfo({
        offerId,
        packageToken,
        roomsToken: roomsToken,
        price: { value, currency: currency }
      })
    );

    await logEvent(PACKAGE_BOOK_PRESSED, {
      source: analyticsSource,
      hotel_id: hotel?.id,
      hotel_name: hotel?.name,
      offer_id: offerId,
      package_token: packageToken
    });

    hotelsService
      .preBook(srkToken, id, offerId, resultsToken, packageToken, roomsToken)
      .then(res => {
        const paymentMethod = res?.paymentMethods?.credit?.code || false;
        const availabilityToken = res?.availabilityToken;
        dispatch(setPrebookInfo({ paymentMethod, availabilityToken }));
        const { cancellationPolicy, remarksformatted = "" } = res || {};
        const { policies = [] } = cancellationPolicy || {};
        dispatch(setCancellationInfo({ policies, remarksFormatted: remarksformatted }));
        navigation.navigate("HotelBooking");
      })
      .catch(error => {
        logError(`Error: handleOnBookPressed --PackageDetailsCard.tsx-- ${error}`);
        dispatch(
          showSnackbar({
            text: t("something_went_wrong"),
            duration: 6000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

  const handleShowDescription = (description: string) => {
    const article = { body: description };

    dispatch(
      showBottomSheet({
        Content: () => (
          <ScrollView style={descriptionStyle}>
            <Pressable>
              <ArticleMarkdown containerStyle={markdownStyle} article={article} />
            </Pressable>
          </ScrollView>
        ),
        scrollViewProps: null,
        props: {
          style: { marginTop: APP_SCREEN_HEIGHT * 0.15 + StatusBar?.currentHeight },
          scrollViewProps: null
        }
      })
    );
    return logEvent(SHOW_PACKAGE_DESCRIPTION_PRESSED, {
      source: analyticsSource,
      hotel_id: hotel?.id,
      hotel_name: hotel?.name,
      ...packageParam
    });
  };

  const handleShowGallery = imageList => {
    if (imageList.length === 0) {
      return;
    }
    dispatch(
      showGalleryViewer({
        data: imageList,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0
      })
    );
  };

  const checkin = useSelector((state: RootState) => state.hotels.hotelsPayload.checkIn);
  const checkout = useSelector((state: RootState) => state.hotels.hotelsPayload.checkOut);

  if (!offerId) {
    return <View />;
  }

  return (
    <View style={containerStyle}>
      <CText
        color={isThemeDark ? "primary_blue_light" : "primary_blue"}
        fontSize={16}
        style={roomSectionTextStyle}
        lineHeight={21}
      >
        {`${t("hotels.room_package")} #${index + 1} (${t("booking.room", {
          count: packageRooms.length
        })})`}
      </CText>
      <View style={row}>
        <View style={flex}>
          {packageRooms?.map(room => (
            <PackageRoomDetailsCard
              onShowGallery={handleShowGallery}
              onShowDescription={handleShowDescription}
              key={room.id}
              room={room}
            />
          ))}
        </View>
        <Card style={bookingContainerStyle}>
          <View style={bookingWrapperStyle}>
            <CText color={"primary_reversed"} fontSize={14}>
              {price?.selling?.currency}
              <CText color={"primary_reversed"} fontSize={16}>
                {price?.selling?.value}
              </CText>
            </CText>
            <CText fontSize={10} color={"gray"}>
              {t("hotels.nights_humanized_sum", {
                count: Math.round(moment(checkout).diff(moment(checkin), "days", true))
              })}
            </CText>
          </View>
          <Button
            style={bookingStyle}
            onPress={handleOnBookPressed}
            labelStyle={whiteTextStyle}
            title={t("hotels.book_now")}
            isLoading={isLoadingData}
          />
        </Card>
      </View>
    </View>
  );
};
export default memo(PackageDetailsCard);
