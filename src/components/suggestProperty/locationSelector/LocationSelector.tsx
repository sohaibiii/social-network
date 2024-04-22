import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";

import { GeoCoordinates } from "react-native-geolocation-service";
import MapView, { LatLng, MapEvent, Marker } from "react-native-maps";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { locationSelectorStyle } from "./LocationSelector.style";
import {
  darkGoogleMap,
  lightGoogleMap,
  LocationSelectorProps
} from "./LocationSelector.types";

import { RootState } from "~/redux/store";

import { Icon, IconTypes, modalizeRef } from "~/components/";
import {
  GooglePlaceData,
  GooglePlaceDetail
} from "~/components/common/GooglePlaces/GooglePlaces.types";
import { GooglePlacesAutocomplete } from "~/components/common/GooglePlacesAutocomplete";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  setPropertyAddress,
  setPropertyMarker
} from "~/redux/reducers/propertySocialAction.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  getLocation,
  logEvent,
  requestLocationPermission,
  SUGGEST_PROPERTY_GET_CURRENT_LOCATION,
  SUGGEST_PROPERTY_GET_CURRENT_LOCATION_FAILED,
  SUGGEST_PROPERTY_GET_CURRENT_LOCATION_SUCCESS
} from "~/services/";
import { getAddressFromCoordinates } from "~/services/geolocation";
import { translate } from "~/translations/";
import { logError, Palestinianize } from "~/utils/";

const ANALYTICS_SOURCE = "suggest_property_page";

const LocationSelector = (props: LocationSelectorProps): JSX.Element => {
  const {
    containerStyle,
    isThemeDark,
    setNextDisabled = () => undefined,
    analyticsSource = ""
  } = props;
  const dispatch = useDispatch();
  const { colors, zIndex } = useTheme();
  const mapRef = useRef<MapView>(null);
  const {
    searchBarStyle,
    addressTitleStyle,
    contentContainerStyle,
    autoCompleteContainerStyle
  } = locationSelectorStyle(zIndex);

  const propertyAddress = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.address
  );

  const propertyMarker = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.marker
  );

  const [marker, setMarker] = useState<LatLng | null>(propertyMarker);
  const [title, setTitle] = useState(propertyAddress);

  useEffect(() => {
    if (propertyMarker?.longitude !== 0 && propertyMarker?.latitude !== 0) {
      return;
    }

    let position: GeoCoordinates;

    requestLocationPermission()
      .then(() => {
        return getLocation();
      })
      .then(res => {
        if (!res) {
          throw new Error(`Cannot get location`);
        }
        const { latitude, longitude } = res;
        position = res;
        return getAddressFromCoordinates(latitude, longitude);
      })
      .then(address => {
        const { latitude, longitude } = position;

        setTitle(Palestinianize(address));
        dispatch(setPropertyAddress(address));
        dispatch(
          setPropertyMarker({
            longitude,
            latitude
          })
        );
        setMarker({
          longitude,
          latitude
        });
        mapRef?.current?.animateToRegion({
          longitude,
          latitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        });
        setNextDisabled(false);
      })
      .catch(error =>
        logError(
          `${error} in getAddressFromCoordinates in LocationSelector lat=${position?.latitude} lon=${position?.longitude}`
        )
      );
  }, [dispatch, propertyMarker?.latitude, propertyMarker?.longitude, setNextDisabled]);

  const handleGooglePlaceClicked = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => {
    modalizeRef.current?.close();

    Keyboard.dismiss();

    setNextDisabled(false);
    setTitle(Palestinianize(details?.formatted_address || ""));
    dispatch(setPropertyAddress(details?.formatted_address || ""));
    const longitude = details?.geometry?.location?.lng || 0;
    const latitude = details?.geometry?.location?.lat || 0;
    setMarker({
      longitude,
      latitude
    });
    dispatch(setPropertyMarker({ latitude, longitude }));
    mapRef?.current?.animateToRegion({
      longitude,
      latitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    });
  };

  useEffect(() => {
    if (propertyMarker?.longitude && propertyMarker?.latitude) {
      mapRef?.current?.animateToRegion({
        longitude: propertyMarker.longitude,
        latitude: propertyMarker.latitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      });
    }
    setNextDisabled(!propertyMarker?.longitude);
  }, [propertyMarker, setNextDisabled]);

  const handleOnMapClicked = ({ nativeEvent: { coordinate } }: MapEvent) => {
    const { latitude, longitude } = coordinate;
    setMarker(coordinate);
    dispatch(setPropertyMarker(coordinate));
    setNextDisabled(false);
    getAddressFromCoordinates(latitude, longitude).then(address => {
      setTitle(Palestinianize(address));
      dispatch(setPropertyAddress(address));
    });
  };
  const handleGetCurrentLocation = async () => {
    Keyboard.dismiss();
    await logEvent(SUGGEST_PROPERTY_GET_CURRENT_LOCATION, {
      source: ANALYTICS_SOURCE
    });
    getLocation()
      .then(async res => {
        if (!res) {
          return;
        }
        const { latitude = 0, longitude = 0 } = res;
        setMarker({
          longitude,
          latitude
        });
        await logEvent(SUGGEST_PROPERTY_GET_CURRENT_LOCATION_SUCCESS, {
          source: ANALYTICS_SOURCE,
          latitude,
          longitude
        });
        dispatch(setPropertyMarker({ latitude, longitude }));
        getAddressFromCoordinates(latitude, longitude).then(address => {
          setTitle(Palestinianize(address));
          dispatch(setPropertyAddress(address));
        });
        mapRef?.current?.animateToRegion({
          longitude,
          latitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        });
        modalizeRef.current?.close();
      })
      .catch(async () => {
        await logEvent(SUGGEST_PROPERTY_GET_CURRENT_LOCATION_FAILED, {
          source: ANALYTICS_SOURCE
        });
        dispatch(
          showSnackbar({
            text: translate("location_error_message"),
            type: SnackbarVariations.SNACKBAR,
            duration: 3000,
            backgroundColor: "red"
          })
        );
      });
    return;
  };

  const renderContent = () => (
    <View style={autoCompleteContainerStyle}>
      <GooglePlacesAutocomplete
        hasCurrentLocation
        getCurrentLocationCb={handleGetCurrentLocation}
        googlePlaceClickedCb={handleGooglePlaceClicked}
        analyticsSource={analyticsSource}
      />
    </View>
  );
  const showSheet = () => {
    dispatch(
      showBottomSheet({
        Content: renderContent,
        props: {
          disableKeyboardOffset: true,
          scrollViewProps: {
            horizontal: true,
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false,
            contentContainerStyle: contentContainerStyle,
            scrollEnabled: false
          }
        }
      })
    );
  };

  return (
    <View style={containerStyle}>
      <MapView
        ref={mapRef}
        moveOnMarkerPress={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsCompass={false}
        showsPointsOfInterest={false}
        style={StyleSheet.absoluteFill}
        onPress={handleOnMapClicked}
        showsTraffic={false}
        customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
        showsIndoors={false}
        userInterfaceStyle={isThemeDark ? "dark" : "light"}
        toolbarEnabled={false}
      >
        <Marker tracksViewChanges={false} coordinate={marker} />
      </MapView>
      <TouchableOpacity activeOpacity={0.8} onPress={showSheet} style={searchBarStyle}>
        <Icon
          type={IconTypes.MATERIAL_COMMUNITY_ICONS}
          name={"map-marker"}
          size={20}
          color={colors.primary}
        />
        <Text style={addressTitleStyle}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LocationSelector;
