import React, { memo, useCallback, useEffect, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";
import { useSelector, shallowEqual } from "react-redux";

import styles from "./PropertyCard.style";
import { PropertyCardProps } from "./PropertyCard.type";

import { CText, ProgressiveImage, Icon, IconTypes, RatingBar } from "~/components/common";
import { Favourite } from "~/components/property";
import { getPropertyById } from "~/redux/selectors";
import { AppStackRoutesPropertyProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { getDistanceBetweenLocations, logEvent, NAVIGATE_TO_PROPERTY } from "~/services/";
import { logError, moderateScale, scale } from "~/utils/";

const WIDTH = 150;
const ASPECT_RATIO = 1.5;
const FavIconSize = moderateScale(22);

const PropertyCard = (props: PropertyCardProps): JSX.Element => {
  const theme = useTheme();
  const navigation = useNavigation<AppStackRoutesPropertyProps["navigation"]>();
  const { t } = useTranslation();

  const {
    cardWidth = WIDTH,
    pkey,
    referenceLocation,
    language,
    shouldRenderProgressive = false,
    containerStyle = {}
  } = props;

  const propertyByIdSelector = useMemo(() => getPropertyById(pkey), [pkey]);
  const property = useSelector(propertyByIdSelector, shallowEqual);

  const {
    city: _city,
    country: _country,
    featured_image,
    rate,
    slug,
    title,
    location,
    analyticsSource
  } = props;

  const { is_favorite = false } = property || {};

  useEffect(() => {
    if (!featured_image?.image_uuid) {
      logError(`Error: Featured image --PropertyCard.tsx-- slug=${slug}`);
    }
  }, []);

  const handlePropertyPressed = useCallback(async () => {
    await logEvent(NAVIGATE_TO_PROPERTY, {
      source: analyticsSource,
      slug
    });
    navigation.navigate({
      name: "Property",
      key: `${moment().unix()}`,
      params: {
        slug
      }
    });
  }, [analyticsSource, navigation, slug]);

  const {
    imageOverlayStyle,
    cardWrapperStyle,
    coverImageStyle,
    favoriteIconStyle,
    ratingWrapperStyle,
    locationWrapperStyle,
    cardContentStyle,
    propertyPrimaryTextStyle,
    propertySecondaryTextStyle
  } = useMemo(() => styles(theme, cardWidth, ASPECT_RATIO), [theme, cardWidth]);

  const getDistance = useCallback(() => {
    if (!referenceLocation) return;
    return getDistanceBetweenLocations(
      {
        lat: referenceLocation?.latitude || referenceLocation?.lat,
        lon: referenceLocation?.longitude || referenceLocation?.lon
      },
      location
    );
  }, [location, referenceLocation]);

  const locationTitle = useMemo(() => {
    const city = _city?.name ?? "";
    const country = _country?.name ?? "";
    return referenceLocation
      ? `${getDistance()} ${t("km")}`
      : `${city ? `${city} -` : ""} ${country ? `${country}` : ""}`;
  }, [_city?.name, _country?.name, getDistance, referenceLocation, t]);

  const rating = useMemo(
    () => rate?.rate_calculated || rate?.google_rate,
    [rate?.google_rate, rate?.rate_calculated]
  );

  const cardWrapperStyles = useMemo(
    () => [cardWrapperStyle, containerStyle],
    [cardWrapperStyle, containerStyle]
  );
  const sourceUri = useMemo(
    () => ({
      uri: `${Config.CONTENT_MEDIA_PREFIX}/${featured_image?.image_uuid}_xs.jpg`
    }),
    [featured_image?.image_uuid]
  );
  const thumbnailUri = useMemo(
    () => ({
      uri: `${Config.CONTENT_MEDIA_PREFIX}/${featured_image?.image_uuid}_xs.jpg`
    }),
    [featured_image?.image_uuid]
  );

  return (
    <TouchableOpacity style={cardWrapperStyles} onPress={handlePropertyPressed}>
      <View>
        {shouldRenderProgressive ? (
          <ProgressiveImage
            source={sourceUri}
            thumbnailSource={thumbnailUri}
            style={coverImageStyle}
            borderRadius={5}
          />
        ) : (
          <FastImage style={coverImageStyle} borderRadius={5} source={sourceUri} />
        )}
        <View style={imageOverlayStyle} />

        <View style={favoriteIconStyle}>
          <Favourite
            size={FavIconSize}
            color={is_favorite ? theme.colors.darkRed : theme.colors.white}
            isFavorite={is_favorite}
            pkey={pkey}
          />
        </View>
      </View>

      <View style={cardContentStyle}>
        <CText fontSize={13} style={propertyPrimaryTextStyle} numberOfLines={1}>
          {title[language] || title.ar}
        </CText>
        <View style={ratingWrapperStyle}>
          <RatingBar
            disabled
            ratingCount={5}
            defaultValue={rating}
            size={scale(16)}
            spacing={2}
          />
        </View>
        <View style={locationWrapperStyle}>
          <Icon
            type={IconTypes.SIMPLELINE_ICONS}
            name={"location-pin"}
            size={12}
            color={theme.colors.text}
          />
          <CText
            fontSize={11}
            fontFamily="thin"
            style={propertySecondaryTextStyle}
            numberOfLines={1}
          >
            {locationTitle}
          </CText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(PropertyCard, isEqual);
