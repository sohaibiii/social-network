import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import { Callout, Marker, default as MapView } from "react-native-maps";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import hotelsMapViewStyles from "./HotelsMapView.styles";

import { RootState } from "~/redux/store";

import { Icon, IconTypes, LottieActivityIndicator } from "~/components/";
import { HotelMapCard } from "~/components/hotelsList";
import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";
import { Hotel } from "~/containers/hotelsList/HotelsList.types";
import { AppStackRoutesHotelsMapProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { logEvent, MAP_ITEM_PRESSED } from "~/services/analytics";
import { moderateScale, scale } from "~/utils/";

const ANALYTICS_SOURCE = "hotels_map_view";
const MARKER_SIZE = moderateScale(36);

const HotelsMapView = (props: AppStackRoutesHotelsMapProps) => {
  const { route, navigation } = props;
  const {
    hotels: hotelsParam = [],
    filters = [],
    position,
    updateListViewHotels
  } = route?.params;

  const [hotels, setHotels] = useState(hotelsParam);
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);

  const [isLoading, setIsLoading] = useState(true);

  const insets = useSafeAreaInsets();

  const { flex, headerStyle, mapViewStyle, lottieContainerStyle, lottieLoader } = useMemo(
    () => hotelsMapViewStyles(colors, insets.top),
    [colors, insets.top]
  );

  const updateHotelsCb = useCallback(
    (hotelsParam: Hotel[]) => {
      updateListViewHotels(hotelsParam);
      setHotels(hotelsParam);
    },
    [updateListViewHotels]
  );

  const handleOnMapReady = useCallback(() => {
    const locations = hotels.map(item => item.details.geolocation);
    if (locations.length > 0) {
      mapRef?.current?.fitToCoordinates(
        locations.map(item => ({
          longitude: parseFloat(item?.longitude),
          latitude: parseFloat(item?.latitude)
        })),
        {
          edgePadding: { bottom: 40, left: 40, right: 40, top: 40 }
        }
      );
    }
    setIsLoading(false);
  }, [hotels]);
  const handleHotelSelected = useCallback(
    async hotel => {
      logEvent(MAP_ITEM_PRESSED, {
        source: ANALYTICS_SOURCE,
        ...hotel
      });
      navigation.navigate("HotelDetails", {
        hotelIndex: hotel?.id,
        updateHotelsCb,
        filters
      });
    },
    [filters, navigation, updateHotelsCb]
  );

  const renderHotels = useCallback(
    (hotel: Hotel, index: number) => {
      if (!hotel) {
        return <View key={index} />;
      }
      const { latitude = 0, longitude = 0 } = hotel?.details?.geolocation || {};
      // const isSelected = selectedHotel?.index === hotel?.index;
      // const markerSize = isSelected ? moderateScale(40) : moderateScale(36);
      // const onMarkerPress = () => {
      //   if (isSelected) {
      //     setSelectedHotel(null);
      //   } else {
      //     mapRef?.current?.animateToRegion(
      //       {
      //         latitude,
      //         longitude
      //       },
      //       500
      //     );
      //     setSelectedHotel(hotel);
      //   }

      //   return logEvent(MAP_ITEM_PRESSED, {
      //     source: ANALYTICS_SOURCE,
      //     ...hotel?.details
      //   });
      // };

      const coordinate = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };

      const anchor = { x: 1, y: 1 };

      return (
        <Marker
          anchor={anchor}
          tracksViewChanges={false}
          pointerEvents={"auto"}
          key={`${hotel?.details?.id}`}
          identifier={`${hotel?.details?.id}-${index}`}
          coordinate={coordinate}
        >
          <Icon
            name={"hotel_marker"}
            width={MARKER_SIZE}
            height={MARKER_SIZE}
            color={colors.primary_blue}
            type={IconTypes.SAFARWAY_ICONS}
          />
          <Callout onPress={() => handleHotelSelected(hotel?.details)}>
            <HotelMapCard minPrice={hotel?.minPrice} hotel={hotel?.details} />
          </Callout>
        </Marker>
      );
    },
    [colors.primary_blue, handleHotelSelected]
  );

  const region = useMemo(() => {
    try {
      return {
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
        latitude: parseFloat(hotels[0]?.details?.geolocation?.latitude),
        longitude: parseFloat(hotels[0]?.details?.geolocation?.longitude)
      };
    } catch (e) {
      return {
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
        latitude: position?.lat,
        longitude: position?.lng
      };
    }
  }, [hotels, position?.lat, position?.lng]);

  return (
    <View style={flex}>
      <View style={headerStyle}>
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={colors.primary}
          size={scale(20)}
        />
      </View>
      <MapView
        ref={mapRef}
        moveOnMarkerPress={false}
        onMapReady={handleOnMapReady}
        onMapLoaded={handleOnMapReady}
        showsUserLocation={false}
        showsMyLocationButton={false}
        initialRegion={region}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsTraffic={false}
        showsCompass={false}
        showsIndoors={false}
        toolbarEnabled={false}
        style={mapViewStyle}
        customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
        userInterfaceStyle={isThemeDark ? "dark" : "light"}
      >
        {!isLoading && hotels?.map(renderHotels)}
      </MapView>
      {isLoading && (
        <View style={lottieContainerStyle}>
          <LottieActivityIndicator style={lottieLoader} />
        </View>
      )}
    </View>
  );
};

export default memo(HotelsMapView);
