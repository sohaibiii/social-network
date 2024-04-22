import React, { FC, memo, useCallback } from "react";

import { Marker } from "react-native-maps";

import { Icon } from "../";
import { IconTypes } from "../common";

import { MarkerProps } from "./marker.types";

import { moderateScale, scale } from "~/utils/responsivityUtil";

const CustomMarker: FC<MarkerProps> = props => {
  const { coordinate, isHotel, myLocation, onPress, selected, slug } = props;

  const onMarkerPress = useCallback(() => {
    if (!!onPress && !!slug) onPress(slug);
  }, [onPress, slug]);

  const getIconName = useCallback(() => {
    if (myLocation) return "my_location_marker";
    if (selected) return "selected_marker";
    if (isHotel) return "hotel_marker";
    return "marker";
  }, [isHotel, myLocation, selected]);

  const markerStyle = {
    zIndex: selected ? 1 : 0,
    elevation: selected ? 1 : 0,
    opacity: selected ? 1 : 0.8
  };

  const { latitude, longitude } = coordinate || {};

  return (
    <Marker
      key={`${latitude}_${longitude}`}
      tracksViewChanges={false}
      onPress={onMarkerPress}
      stopPropagation
      style={markerStyle}
      coordinate={{
        latitude,
        longitude
      }}
    >
      <Icon
        name={getIconName()}
        width={scale(selected || myLocation ? 40 : 30)}
        height={moderateScale(40)}
        type={IconTypes.SAFARWAY_ICONS}
      />
    </Marker>
  );
};

export default memo(CustomMarker);
