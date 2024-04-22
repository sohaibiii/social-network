import { ViewStyle } from "react-native";

import Geolocation from "react-native-geolocation-service";

import { FeaturedImage, Title } from "~/apiServices/destinations/destinations.types";

export interface CountryCity {
  ar: string;
  en?: string;
  name?: string;
}
export interface Rate {
  rating: number;
}
export interface Location {
  lon: number;
  lat: number;
}
interface PropertyCardInterface {
  cardWidth?: number;
  pkey: string;
  category: number;
  slug: string;
  containerStyle: ViewStyle;
  title: Title;
  location: Location;
  rate: Rate;
  featured_image: FeaturedImage;
  city: string;
  country: string;
  language: string;
  shouldRenderProgressive?: boolean;
  referenceLocation?: Location | Geolocation.GeoCoordinates | false;
  key?: string;
  analyticsSource?: string;
}

export type PropertyCardProps = PropertyCardInterface;
