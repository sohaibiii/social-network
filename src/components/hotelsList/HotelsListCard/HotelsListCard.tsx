import React, { memo, useMemo } from "react";
import { Image, View } from "react-native";

import { useTranslation } from "react-i18next";
import { Card, useTheme } from "react-native-paper";

import hotelsListCardStyle from "./HotelsListCard.style";
import { HotelsListCardProps } from "./HotelsListCard.types";

import IMAGES from "~/assets/images";
import { CText, Icon, IconTypes, RatingBar } from "~/components/common";
import { scale } from "~/utils/";

const HotelsListCard = (props: HotelsListCardProps): JSX.Element => {
  const {
    hotel,
    minPrice = { value: 0, currency: "USD" },
    onHotelPressed = () => undefined
  } = props;
  const { t } = useTranslation();

  const { colors } = useTheme();

  const {
    containerStyle,
    imageStyle,
    imageContainerStyle,
    hotelDetailsStyle,
    ratingBarStyle,
    row,
    centeredRow,
    startingPriceContainerStyle,
    boldTextStyle,
    capitalizedText,
    flex,
    spacingStyle
  } = useMemo(() => hotelsListCardStyle(colors), [colors]);

  const {
    id = 0,
    mainImage = "",
    name = "",
    address = "",
    stars = 0,
    reviews = null
  } = hotel;

  const handleHotelPressed = () => {
    onHotelPressed(hotel);
  };

  const imageUri = useMemo(
    () =>
      mainImage?.url
        ? { uri: mainImage?.url?.replace("http", "https") }
        : IMAGES.default_hotel,
    [mainImage?.url]
  );

  return (
    <Card elevation={2} onPress={handleHotelPressed} key={id} style={containerStyle}>
      <View style={centeredRow}>
        <View style={imageContainerStyle}>
          <Image source={imageUri} style={imageStyle} />
        </View>
        <View style={hotelDetailsStyle}>
          <CText style={capitalizedText} fontSize={14} lineHeight={19}>
            {name.toLowerCase()}
          </CText>
          <RatingBar
            ratingCount={5}
            defaultValue={stars}
            spacing={2}
            size={scale(15)}
            disabled
            containerStyle={ratingBarStyle}
          />
          <View style={row}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              name={"map-marker-outline"}
              size={scale(16)}
              color={colors.gray}
            />
            <CText
              numberOfLines={1}
              style={flex}
              color={"gray"}
              fontSize={11}
              lineHeight={16}
            >
              {address}
            </CText>
          </View>
          {reviews && (
            <CText color={"gray"} fontSize={11} lineHeight={16}>
              {`${t("hotels.rating")} ${reviews?.rating || 0}/10`}
            </CText>
          )}
        </View>
        <View style={spacingStyle} />
        <View style={startingPriceContainerStyle}>
          <CText
            textAlign={"center"}
            color={"primary_reversed"}
            fontSize={12}
            lineHeight={17}
          >
            {t("hotels.starting_price")}
          </CText>
          <CText textAlign={"center"} fontSize={20} style={boldTextStyle}>
            {`${t(`currency.symbol_${minPrice.currency}`)}${parseFloat(
              `${minPrice.value}`
            ).toFixed(0)}`}
          </CText>
        </View>
      </View>
    </Card>
  );
};
export default memo(HotelsListCard);
