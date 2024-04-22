import { GeoCoordinates } from "react-native-geolocation-service";

import { SimpleProperty } from "~/containers/surroundingLandmarks/surroundingLandmarks.types";

export interface CarouselMapItemProps {
  item: SimpleProperty;
  location: GeoCoordinates;
  isHotel?: boolean;
}
