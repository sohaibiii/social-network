import React, { useRef, useEffect, memo } from "react";
import { View } from "react-native";

import isEqual from "react-fast-compare";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./MapPreview.styles";
import { MapPreviewTypes } from "./MapPreview.types";

import { RootState } from "~/redux/store";

import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";

const MapPreview = (props: MapPreviewTypes): JSX.Element => {
  const mapRef = useRef();
  const theme = useTheme();
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const {
    containerStyle: containerStyleProp = {},
    initialRegion = {},
    markers = [],
    minZoomLevel = 4,
    animateToFitMarkers = false,
    scrollEnabled = false,
    pitchEnabled = false,
    zoomEnabled = false,
    zoomTapEnabled = false,
    rotateEnabled = false,
    zoomControlEnabled = false,
    onPress
  } = props;

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      if (!animateToFitMarkers || !markers || markers.length === 0) {
        return;
      }

      mapRef.current?.fitToSuppliedMarkers(
        markers.map(marker => marker.identifier),
        true
      );
    }, 500);
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [markers, animateToFitMarkers]);

  const { containerStyle, mapViewStyle } = styles(theme);
  const containerStyles = [containerStyle, containerStyleProp];
  return (
    <View style={containerStyles}>
      {Object.keys(initialRegion).length > 0 && (
        <MapView
          initialRegion={initialRegion}
          style={mapViewStyle}
          ref={mapRef}
          minZoomLevel={minZoomLevel}
          scrollEnabled={scrollEnabled}
          pitchEnabled={pitchEnabled}
          zoomEnabled={zoomEnabled}
          zoomTapEnabled={zoomTapEnabled}
          rotateEnabled={rotateEnabled}
          zoomControlEnabled={zoomControlEnabled}
          onPress={onPress}
          customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
          userInterfaceStyle={isThemeDark ? "dark" : "light"}
          {...props}
        >
          {markers?.map((marker, index) => {
            const { identifier, latitude, longitude } = marker;
            return (
              <Marker
                onPress={onPress}
                key={`${identifier}-${index}`}
                identifier={identifier}
                coordinate={{ latitude, longitude }}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
};

export default memo(MapPreview, isEqual);
