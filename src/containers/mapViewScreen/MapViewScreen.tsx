import React, { FC } from "react";

import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";

import { mapViewScreen } from "./mapViewScreen.styles";

import { RootState } from "~/redux/store";

import {
  darkGoogleMap,
  lightGoogleMap
} from "~/components/suggestProperty/locationSelector/LocationSelector.types";

const MapViewScreen: FC = () => {
  const { params } = useRoute();
  const { initialRegion = {}, markers = [] } = params || {};
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const { root } = mapViewScreen;

  return (
    <>
      {Object.keys(initialRegion).length > 0 && (
        <MapView
          initialRegion={initialRegion}
          style={root}
          moveOnMarkerPress={false}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsBuildings={false}
          showsPointsOfInterest={false}
          showsTraffic={false}
          showsCompass={false}
          showsIndoors={false}
          toolbarEnabled={false}
          customMapStyle={isThemeDark ? darkGoogleMap : lightGoogleMap}
          userInterfaceStyle={isThemeDark ? "dark" : "light"}
        >
          {markers?.map((marker, index) => {
            const { identifier, latitude, longitude } = marker;
            return (
              <Marker
                key={`${identifier}-${index}`}
                identifier={identifier}
                coordinate={{ latitude, longitude }}
              />
            );
          })}
        </MapView>
      )}
    </>
  );
};

export default MapViewScreen;
