import React, { useMemo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import MapView from "react-native-maps";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./GetDirections.styles";
import { GetDirectionsTypes } from "./GetDirections.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, MapPreview } from "~/components/common";
import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";
import { isRTL } from "~/constants/variables";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackRoutesCityCountryRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { logEvent, NAVIGATE_TO_CITY_COUNTRY_REGION } from "~/services/";
import { getLocation, requestLocationPermission } from "~/services/location";
import { logError, splitAddress } from "~/utils/";
import { scale } from "~/utils/responsivityUtil";

const GetDirections = (props: GetDirectionsTypes): JSX.Element => {
  const {
    location = {},
    address,
    cityOrRegionName,
    countryName,
    cityOrRegionSlug,
    countrySlug,
    isRegionData
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<AppStackRoutesCityCountryRegionProps["navigation"]>();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const initialRegion = useMemo(
    () => ({
      latitude: location?.lat,
      longitude: location?.lon,
      latitudeDelta: location?.latDelta ?? 0.005,
      longitudeDelta: location?.lonDelta ?? 0.005
    }),
    [location?.lat, location?.lon, location?.latDelta, location?.lonDelta]
  );

  const markers = useMemo(
    () => [
      {
        identifier: "Marker1",
        latitude: location?.lat,
        longitude: location?.lon
      }
    ],
    [location?.lat, location?.lon]
  );

  const handleCityRegionPressed = async () => {
    if (!!cityOrRegionSlug && !!cityOrRegionName) {
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        source: "get_directions_component",
        title: cityOrRegionName,
        slug: cityOrRegionSlug,
        type: isRegionData ? DestinationsType.REGION : DestinationsType.CITY
      });

      navigation.navigate({
        name: "CityCountryRegion",
        key: `${moment().unix()}`,
        params: {
          title: cityOrRegionName,
          slug: cityOrRegionSlug,
          type: isRegionData ? DestinationsType.REGION : DestinationsType.CITY
        }
      });
    }
  };

  const handleCountryPressed = async () => {
    if (!!countrySlug && !!countryName) {
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        source: "get_directions_component",
        title: countryName,
        slug: countrySlug,
        type: DestinationsType.COUNTRY
      });

      navigation.navigate({
        name: "CityCountryRegion",
        key: `${moment().unix()}`,
        params: {
          title: countryName,
          slug: countrySlug,
          type: DestinationsType.COUNTRY
        }
      });
    }
  };

  const handleCopyAddress = async () => {
    try {
      !!address && Clipboard.setString(address);
      dispatch(showSnackbar({ text: t("text_copied"), duration: 3000 }));
    } catch (error) {
      logError(
        `Error: handleCopyAddress --GetDirections.tsx--  address=${address} ${error}`
      );
    }
  };

  const onGetDirectionsPress = async () => {
    await requestLocationPermission();
    const userLocation = await getLocation();

    if (!location || !userLocation) return;

    navigation.navigate("MapDirections", {
      destination: { latitude: location.lat, longitude: location.lon },
      origin: userLocation
    });
  };

  const onMapPreviewPress = useCallback(() => {
    const { lat = 0, lon = 0, latDelta = 0.005, lonDelta = 0.005 } = location || {};
    navigation.navigate("MapView", {
      initialRegion: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: latDelta ?? 0.005,
        longitudeDelta: lonDelta ?? 0.005
      },
      markers: [
        {
          identifier: "Marker1",
          latitude: lat,
          longitude: lon,
          latitudeDelta: latDelta ?? 0.005,
          longitudeDelta: lonDelta ?? 0.005
        }
      ]
    });
  }, [location?.lat, location?.latDelta, location?.lon, location?.lonDelta, navigation]);

  const {
    mapWrapperStyle,
    addressRowWrapperStyle,
    rowWrapperStyle,
    iconWrapperStyle,
    dividerStyle,
    getDirectionWrapperStyle,
    getDirectionIconStyleAr,
    getDirectionIconStyle,
    mapContainerStyle
  } = useMemo(() => styles(theme), [theme]);

  return (
    <View>
      {!!location && Object.keys(location).length > 0 && (
        <>
          <View style={mapWrapperStyle}>
            <MapPreview
              initialRegion={initialRegion}
              markers={markers}
              containerStyle={mapContainerStyle}
              scrollEnabled={false}
              pitchEnabled={false}
              zoomEnabled={false}
              zoomTapEnabled={false}
              rotateEnabled={false}
              zoomControlEnabled={false}
              minZoomLevel={5}
              animateToFitMarkers={false}
              toolbarEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
              showsCompass={false}
              showsIndoorLevelPicker={false}
              showsIndoors={false}
              showsMyLocationButton={false}
              showsScale={false}
              showsTraffic={false}
              customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
              userInterfaceStyle={isThemeDark ? "dark" : "light"}
              onPress={onMapPreviewPress}
            />
          </View>

          <TouchableOpacity
            style={getDirectionWrapperStyle}
            onPress={onGetDirectionsPress}
          >
            <Icon
              type={IconTypes.FONTAWESOME5}
              name="directions"
              disabled
              color={theme.colors.background}
              size={scale(23)}
              style={isRTL ? getDirectionIconStyleAr : getDirectionIconStyle}
            />
            <CText color={"background"} fontSize={13}>
              {t("get_directions")}
            </CText>
          </TouchableOpacity>
          {/* <Divider style={dividerStyle} /> */}
        </>
      )}
      {(!!countryName || !!cityOrRegionName) && (
        <View style={rowWrapperStyle}>
          <View style={iconWrapperStyle}>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name="pin"
              color="#888888"
              disabled
              width={scale(20)}
              height={scale(20)}
            />
          </View>
          <View style={rowWrapperStyle}>
            <CText
              fontSize={13}
              color="primary"
              onPress={handleCityRegionPressed}
            >{`${cityOrRegionName}`}</CText>
            <CText fontSize={13} color="primary">{` - `}</CText>
            <CText
              fontSize={13}
              color="primary"
              onPress={handleCountryPressed}
            >{`${countryName}`}</CText>
          </View>
        </View>
      )}
      {!!address && (
        <TouchableOpacity onPress={handleCopyAddress} style={addressRowWrapperStyle}>
          <CText
            fontSize={13}
            textAlign={"left"}
            lineHeight={18}
            fontFamily={"light"}
            color="gray"
          >
            {splitAddress(address)}
          </CText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default GetDirections;
