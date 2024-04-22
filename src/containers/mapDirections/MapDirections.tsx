import React, { FC, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useRoute } from "@react-navigation/native";
import Config from "react-native-config";
import MapView, { Marker as RNMMarker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import mapDirectionsStyles from "./mapDirections.styles";

import { RootState } from "~/redux/store";

import { Icon, IconTypes, modalizeRef } from "~/components/common";
import { Marker } from "~/components/marker";
import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";
import { PLATFORM } from "~/constants/variables";
import { showLocation } from "~/services/mapDirection";
import { scale, moderateScale } from "~/utils/responsivityUtil";

export enum MapViewDirectionsMode {
  DRIVING = "DRIVING",
  WALKING = "WALKING"
}

const MapDirections: FC = () => {
  const { colors } = useTheme();

  const { params } = useRoute();
  const { origin, destination } = params || {};

  const [selectedType, setSelectedType] = useState(MapViewDirectionsMode.DRIVING);

  const mapRef = useRef<MapView>(null);

  const { root, optionsContainer, optionStyle } = mapDirectionsStyles(colors);
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const onMapReady = () => {
    mapRef.current?.fitToCoordinates([origin, destination], {
      edgePadding: { bottom: 40, left: 40, right: 40, top: 40 }
    });
  };

  const handleGoogleMapsClicked = () => {
    const options = {
      app: PLATFORM === "ios" ? "apple-maps" : "google-maps",
      latitude: destination.latitude,
      longitude: destination.longitude
    };
    showLocation(options);
  };

  const handleOtherMapsClicked = () => {
    const options = {
      appsBlackList: ["apple-maps", "google-maps"],
      latitude: destination.latitude,
      longitude: destination.longitude
    };
    showLocation(options).finally(() => {
      modalizeRef.current?.close();
    });
  };

  const walkingButtonStyle = [
    optionStyle,
    {
      backgroundColor:
        selectedType === MapViewDirectionsMode.WALKING ? colors.primary : colors.white
    }
  ];

  const walkingButtonColor =
    selectedType !== MapViewDirectionsMode.WALKING ? colors.primary : colors.white;

  const carButtonStyle = [
    optionStyle,
    {
      backgroundColor:
        selectedType === MapViewDirectionsMode.DRIVING ? colors.primary : colors.white
    }
  ];

  const drivingButtonColor =
    selectedType !== MapViewDirectionsMode.DRIVING ? colors.primary : colors.white;

  return (
    <>
      <MapView
        onMapReady={onMapReady}
        ref={mapRef}
        style={root}
        initialRegion={{ ...origin, latitudeDelta: 1, longitudeDelta: 1 }}
        showsUserLocation={PLATFORM === "ios"}
        customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
        userInterfaceStyle={isThemeDark ? "dark" : "light"}
      >
        <Marker coordinate={destination} />
        {PLATFORM === "android" && (
          <RNMMarker coordinate={origin}>
            <Icon
              name={"account_marker_outline"}
              type={IconTypes.SAFARWAY_ICONS}
              width={moderateScale(35)}
              height={moderateScale(35)}
            />
          </RNMMarker>
        )}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={Config.GOOGLE_MAPS_API_DIRECTION_KEY}
          directionsServiceBaseUrl={"https://gapi.safarway.com/mobile/directions/json"}
          strokeColor={colors.primary}
          strokeWidth={3}
          mode={selectedType}
        />
      </MapView>
      <View style={optionsContainer}>
        <TouchableOpacity
          style={walkingButtonStyle}
          onPress={() => setSelectedType(MapViewDirectionsMode.WALKING)}
        >
          <Icon
            name="walking"
            color={walkingButtonColor}
            type={IconTypes.FONTAWESOME5}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={carButtonStyle}
          onPress={() => setSelectedType(MapViewDirectionsMode.DRIVING)}
        >
          <Icon
            name="car"
            color={drivingButtonColor}
            type={IconTypes.FONTAWESOME5}
            size={30}
          />
        </TouchableOpacity>
        <View style={optionStyle}>
          <Icon
            onPress={handleGoogleMapsClicked}
            name={PLATFORM === "ios" ? "apple_maps" : "google_maps"}
            width={scale(35)}
            height={scale(35)}
          />
        </View>
        <View style={optionStyle}>
          <Icon
            onPress={handleOtherMapsClicked}
            name="navigate"
            width={scale(35)}
            height={scale(35)}
          />
        </View>
      </View>
    </>
  );
};

export { MapDirections };
