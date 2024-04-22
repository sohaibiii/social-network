import React, { memo, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Card, useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import variationDetailsCardStyle from "./VariationDetailsCard.style";
import { VariationDetailsCardProps } from "./VariationDetailsCard.types";

import { RootState } from "~/redux/store";

import { hotelsService } from "~/apiServices/index";
import IMAGES from "~/assets/images";
import { Button, CText, Icon, IconTypes, ProgressiveImage } from "~/components/common";
import {
  setHotelInfo,
  seReservationInfo,
  setPrebookInfo,
  setCancellationInfo
} from "~/redux/reducers/hotels.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { logEvent, ROOM_BOOK_PRESSED } from "~/services/analytics";
import { logError, scale } from "~/utils/";

const ANALYTICS_SOURCE = "hotel_details_page";

const VariationDetailsCard = (props: VariationDetailsCardProps): JSX.Element => {
  const {
    variation = {},
    room = {},
    hotel = {},
    onShowDescription = () => undefined,
    onShowGallery = () => undefined
  } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const resultsToken = useSelector((state: RootState) => state.hotels.resultsToken);

  const srkToken = useSelector((state: RootState) => state.hotels.srk);

  const checkin = useSelector((state: RootState) => state.hotels.hotelsPayload.checkIn);
  const checkout = useSelector((state: RootState) => state.hotels.hotelsPayload.checkOut);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const {
    containerStyle,
    imageStyle,
    iconStyle,
    priceTextStyle,
    priceInfoTextStyle,
    buttonsContainerStyle,
    bookButtonContainerStyle,
    whiteTextStyle,
    bookButtonStyle,
    showDescriptionContainerStyle,
    galleryIconStyle,
    variantTextStyle,
    iconsContainerStyle,
    row,
    flex,
    rowAlignItemsCenter
  } = useMemo(() => variationDetailsCardStyle(colors), [colors]);

  const { occupancy, roomReferences } = variation;
  const { adults = 0 } = occupancy || {};

  const {
    boardBasis = "",
    price = 0,
    description,
    name: room_name,
    offerId,
    info,
    nonRefundable,
    images = [],
    roomToken,
    packageToken
  } = roomReferences[0] || {};
  const image = images?.length > 0 ? { uri: images[0]?.url } : IMAGES.default_hotel;
  let bedInfo = "";
  try {
    const bedInfoWithDot = info.split("Beds:")[1];
    bedInfo = bedInfoWithDot.replace(".", "");
  } catch (error) {
    bedInfo = "";
  }
  const nonRefundableTranslated = nonRefundable
    ? "hotels.roomFilters.nonrefundable"
    : "hotels.roomFilters.refundable";

  const nonRefundableTextColor = nonRefundable ? "red" : "green";

  const handleOnBookPressed = async () => {
    const { name = "", stars = 0, id = "", mainImage = {} } = hotel;
    setIsLoadingData(true);
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
        roomsToken: [roomToken],
        price: { value: price?.selling?.value, currency: price?.selling?.currency }
      })
    );

    await logEvent(ROOM_BOOK_PRESSED, {
      source: ANALYTICS_SOURCE,
      hotel_id: hotel?.id,
      hotel_name: hotel?.name,
      offer_id: offerId,
      ...room
    });

    hotelsService
      .preBook(srkToken, id, offerId, resultsToken, packageToken, [roomToken])
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
        logError(`Error: handleOnBookPressed --VariationDetailsCard.tsx-- ${error}`);
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

  if (!offerId) {
    return <View />;
  }
  return (
    <Card style={containerStyle}>
      <View style={row}>
        <TouchableOpacity onPress={onShowGallery}>
          <ProgressiveImage
            style={imageStyle}
            resizeMode={"cover"}
            thumbnailSource={image}
            source={image}
          />
        </TouchableOpacity>
        <View style={galleryIconStyle}>
          <Icon
            name="image"
            size={scale(16)}
            color={colors.white}
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          />
        </View>
        <View style={flex}>
          <CText color={"text"} fontSize={12}>
            {room_name}
          </CText>
          <CText fontSize={12} style={variantTextStyle}>
            {t(`hotels.board.${boardBasis}`)}
          </CText>
          <View style={iconsContainerStyle}>
            <View style={rowAlignItemsCenter}>
              <Icon
                name="person-outline"
                size={scale(16)}
                color={colors.gray}
                type={IconTypes.MATERIAL_ICONS}
              />
              <CText color={"gray"} fontSize={10} style={iconStyle}>
                {t("hotels.adults_humanized", {
                  count: adults
                })}
              </CText>
            </View>
            <View style={rowAlignItemsCenter}>
              <Icon
                name="bed-outline"
                size={scale(16)}
                color={colors.gray}
                type={IconTypes.ION_ICONS}
              />
              <CText color={"gray"} fontSize={10} lineHeight={18} style={iconStyle}>
                {bedInfo}
              </CText>
            </View>
            <View style={rowAlignItemsCenter}>
              <Icon
                name="cash-multiple"
                size={scale(16)}
                color={colors.gray}
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              />
              <CText color={nonRefundableTextColor} fontSize={10} style={iconStyle}>
                {t(nonRefundableTranslated)}
              </CText>
            </View>
          </View>
          <CText fontSize={16} color={"primary_reversed"} style={priceTextStyle}>
            {`${price?.selling?.value} ${price?.selling?.currency}`}
          </CText>
          <CText fontSize={10} color={"gray"} style={priceInfoTextStyle}>
            {t("hotels.nights_humanized_sum", {
              count: Math.round(moment(checkout).diff(moment(checkin), "days", true))
            })}
          </CText>
        </View>
      </View>
      <View style={buttonsContainerStyle}>
        <View style={bookButtonContainerStyle}>
          <Button
            onPress={handleOnBookPressed}
            labelStyle={whiteTextStyle}
            style={bookButtonStyle}
            title={t("hotels.book")}
            isLoading={isLoadingData}
            activeOpacity={0.5}
          />
        </View>
        {!!description && (
          <View style={showDescriptionContainerStyle}>
            <TouchableOpacity onPress={onShowDescription}>
              <CText color={"primary_reversed"} fontSize={12}>
                {t("hotels.show_details")}
              </CText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
};
export default memo(VariationDetailsCard);
