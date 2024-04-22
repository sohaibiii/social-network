import Geolocation from "react-native-geolocation-service";

import { FavouriteListItemsResponse } from "~/apiServices/settings/settings.types";

export interface IMapCategories {
  id: number;
  title: { ar: string; en: string };
}

export interface IFilters {
  id: number;
  pkey: number;
  title: { ar: string; en: string };
}

export interface MapCategoriesParams {
  location: Geolocation.GeoCoordinates;
  data?: string[];
}

export interface NameSlugPkey {
  name: string;
  slug: string;
  pkey: string;
}

export interface Location {
  lon: number;
  lat: number;
  latDelta?: number;
  lonDelta?: number;
}

export interface SimpleProperty extends NameSlugPkey {
  address: number;
  city: {
    id: number;
    name: string;
    slug: string;
  };
  title: {
    en: string;
    ar: string;
  };
  country: {
    id: number;
    name: string;
    slug: string;
  };
  featured_image: {
    image_uuid: string;
  };
  location: {
    lon: number;
    lat: number;
  };

  rate: {
    rate_calculated: number;
  };

  verified: boolean;
  id: string;
  price_range: number;
  region: { name: string; slug: string };
  is_favorite?: boolean;
  star_rating?: number;
}
