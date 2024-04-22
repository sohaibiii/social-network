import { GeoCoordinates } from "react-native-geolocation-service";

export interface Hotel {
  id: string;
  type: string;
  name: string;
  address: string;
  image: string;
  hotel_id: string;
  description: any[];
  facilities: any[];
  gallery: {
    id: string;
    description: string;
  }[];
  stars: number;
  distance: number;
  geoLocation: GeoCoordinates;
  price: HotelPricing;
  reviews: HotelReview;
  last: number;
}

export interface HotelReview {
  rating: number;
  count: number;
}

export interface HotelMeta {
  last: number;
  total_results: number;
  total_filtered_results: number;
}

export interface HotelPricing {
  lowest: number;
  highest: number;
}
