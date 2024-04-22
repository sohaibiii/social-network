import React, { memo, useMemo } from "react";
import { Text, View, Image } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { Svg, Image as ImageSvg } from "react-native-svg";

import hotelMapCardStyle from "./HotelMapCard.style";
import { HotelsListCardProps } from "./HotelMapCard.types";

import IMAGES from "~/assets/images";
import { CText, Icon, IconTypes, RatingBar } from "~/components/common";
import { PLATFORM } from "~/constants/";
import { scale, moderateScale } from "~/utils/";

const HotelMapCard = (props: HotelsListCardProps): JSX.Element => {
  const { hotel, minPrice } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  const {
    containerStyle,
    imageStyle,
    hotelDetailsStyle,
    ratingBarStyle,
    centeredRow,
    row,
    spacingStyle,
    flex,
    capitalizedTextStyle,
    startingPriceContainerStyle,
    boldTextStyle
  } = useMemo(() => hotelMapCardStyle(colors), [colors]);

  const { mainImage = "", name = "", address = "", stars = 0, reviews = null } = hotel;

  const imageUri = useMemo(
    () =>
      mainImage?.url
        ? { uri: mainImage?.url?.replace("http", "https") }
        : IMAGES.default_hotel,
    [mainImage?.url]
  );

  const renderImage = () => {
    return PLATFORM === "android" ? (
      <Svg style={imageStyle} width={moderateScale(70)} height={moderateScale(70)}>
        <ImageSvg width={"100%"} height={"100%"} href={imageUri} />
      </Svg>
    ) : (
      <Image source={imageUri} style={imageStyle} />
    );
  };

  return (
    <View style={containerStyle}>
      <View style={centeredRow}>
        {renderImage()}
        <View style={hotelDetailsStyle}>
          <CText numberOfLines={2} style={capitalizedTextStyle} fontSize={11}>
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
            <CText numberOfLines={1} style={flex} color={"gray"} fontSize={9}>
              {address}
            </CText>
          </View>
          {reviews && (
            <CText color={"gray"} fontSize={10} lineHeight={16}>
              {`${t("hotels.rating")} ${reviews?.rating || 0}/10`}
            </CText>
          )}
        </View>
        <View style={spacingStyle} />
        <View style={startingPriceContainerStyle}>
          <CText textAlign={"center"} color={"primary_reversed"} fontSize={10}>
            {t("hotels.starting_price")}
          </CText>
          <CText textAlign={"center"} fontSize={15} style={boldTextStyle}>
            {`${t(`currency.symbol_${minPrice?.currency}`)}${parseFloat(
              `${minPrice?.value}`
            ).toFixed(0)}`}
          </CText>
        </View>
      </View>
    </View>
  );
};
export default HotelMapCard;
