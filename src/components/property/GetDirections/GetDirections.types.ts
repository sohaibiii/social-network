import { Location } from "~/components/home/PropertyCard/PropertyCard.type";

export interface GetDirectionsTypes {
  location?: Location;
  cityOrRegionName?: string;
  countryName?: string;
  address?: string;
  cityOrRegionSlug?: string;
  countrySlug?: string;
  isRegionData?: boolean;
}
