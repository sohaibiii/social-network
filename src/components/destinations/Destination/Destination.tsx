import React, { useMemo, memo } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";

import styles from "./Destination.styles";
import { DestinationProps } from "./Destination.type";

import { ProgressiveImage, CText } from "~/components/common";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { AppStackRoutesCityCountryRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  DESTINATION_VISITED,
  logEvent,
  NAVIGATE_TO_CITY_COUNTRY_REGION
} from "~/services/analytics";

const Destination = (props: DestinationProps): JSX.Element => {
  const {
    title,
    slug,
    subTitle,
    hiddenSubTitle,
    featuredImage,
    width,
    aspectRatio,
    type,
    shouldRenderProgressive = true,
    shouldRenderFast = true,
    analyticsSource,
    isSpecialDestination = false,
    pkey,
    index,
    isFromContinents = false
  } = props;
  const theme = useTheme();
  const navigation = useNavigation<AppStackRoutesCityCountryRegionProps["navigation"]>();

  const handleCountryPressed = async () => {
    let analyticsProps = {
      source: analyticsSource,
      pkey,
      slug,
      title,
      subTitle,
      type,
      index,
      continent: hiddenSubTitle
    };

    analyticsProps = isSpecialDestination
      ? { ...analyticsProps, pressed_from: "special_destinations" }
      : isFromContinents
      ? { ...analyticsProps, pressed_from: "continents_section" }
      : analyticsSource === "home_page_top_destinations"
      ? { ...analyticsProps, pressed_from: "top_destinations" }
      : analyticsProps;

    if (type === DestinationsType.PROPERTY) {
      return navigation.navigate({
        name: "Property",
        params: { slug },
        key: `${moment().unix()}`
      });
    }
    await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, { ...analyticsProps });
    navigation.navigate({
      name: "CityCountryRegion",
      params: { title, slug, type },
      key: `${moment().unix()}`
    });
  };

  const {
    destinationWrapperStyle,
    imageOverlayStyle,
    titleViewWrapperStyle,
    destinationImageStyle
  } = useMemo(() => styles(theme, width, aspectRatio), [theme, width, aspectRatio]);

  const smallImageSource = {
    uri: `${Config.CONTENT_MEDIA_PREFIX}/${featuredImage}_sm.jpg`
  };

  return (
    <TouchableOpacity onPress={handleCountryPressed} style={destinationWrapperStyle}>
      {shouldRenderProgressive ? (
        <ProgressiveImage
          source={smallImageSource}
          thumbnailSource={{
            uri: `${Config.CONTENT_MEDIA_PREFIX}/${featuredImage}_xs.jpg`
          }}
          style={destinationImageStyle}
          borderRadius={5}
        />
      ) : shouldRenderFast ? (
        <FastImage
          style={destinationImageStyle}
          borderRadius={5}
          source={smallImageSource}
        />
      ) : (
        <Image style={destinationImageStyle} borderRadius={5} source={smallImageSource} />
      )}

      <View style={imageOverlayStyle} />
      <View style={titleViewWrapperStyle}>
        <CText color="white" fontSize={16} fontFamily="medium" textAlign="center">
          {title}
        </CText>
        {!!subTitle && (
          <CText color="white" fontSize={12}>
            {subTitle}
          </CText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(Destination);
