import { Country } from "~/apiServices/country/country.types";
import { Title } from "~/apiServices/destinations/destinations.types";
import { Location } from "~/components/home/PropertyCard/PropertyCard.type";
import { GenericObject, FeaturedImage, CountryAndRegion, NameID } from "~/types/common";

export interface PropertyType {
  id: number;
  title: {
    ar: string;
    en: string;
    fr: string;
  };
}

export interface PropertyTypeResponse {
  id: number;
  title: string;
}

export interface PropertyResponseType {
  pkey?: string;
  id?: number;
  title?: Title;
  country?: Country;
  city?: SimpleCity;
  region?: SimpleRegion;
  price_range?: number;
  filters?: PropertyFilters[];
  features?: PropertyFeatures[];
  phone?: number;
  workingHours?: WorkingHours;
  property_type?: PropertyTypeResponse[];
  location?: Location;
  slug?: string;
  rate?: PropertyRateType;
  featured_image?: FeaturedImage;
}

export interface SimpleRegion {
  name: string;
  slug: string;
  id: string;
}

export interface SimpleCity {
  name: string;
  slug: string;
  id: string;
}

export interface SearchByTermResponse {
  items: PropertyResponseType[];
  total: {
    value: number;
  };
}

export interface GetThingsToDoResponse {
  items: PropertyResponseType[];
  total: number;
  title: string;
}

export interface CountryResponseType {
  _index: "country";
  code?: Code;
  continent: NameID;
  currency: Currency;
  featured_image: FeaturedImage;
  id?: string;
  is_favorite: false;
  languages?: string[];
  location?: Location;
  months?: number[];
  pkey?: string;
  slug?: string;
  title: CountryAndRegion;
}

export interface CityResponseType {
  _index: "city";
  code?: Code;
  country: Country;
  currency: Currency;
  featured_image: FeaturedImage;
  id?: string;
  is_favorite: boolean;
  languages?: string[];
  location?: Location;
  months?: number[];
  pkey?: string;
  slug?: string;
  title: CountryAndRegion;
}

export interface RegionResponseType {
  _index: "region";
  country: Country;
  featured_image: FeaturedImage;
  id?: string;
  is_favorite: boolean;
  location?: Location;
  pkey?: string;
  slug?: string;
  title: CountryAndRegion;
}

export type CountryRegionCityType =
  | CountryResponseType
  | RegionResponseType
  | CityResponseType;

export interface Currency {
  code?: string;
  id?: number | string;
  name?: string;
}

export interface PropertyRateType {
  rate: number;
  rate_calculated: string;
  google_rate: string;
  rate_distribution: GenericObject;
  contributes: number;
}

export interface PropertyFilters {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  aliases?: string[];
}

export interface WorkingHours {
  saturday?: WorkingHourType[];
  sunday?: WorkingHourType[];
  monday?: WorkingHourType[];
  tuesday?: WorkingHourType[];
  wednesday?: WorkingHourType[];
  thursday?: WorkingHourType[];
  friday?: WorkingHourType[];
}

export interface WorkingHourType {
  from: string;
  to: string;
}

export interface Code {
  alpha_3?: string;
  alpha_2?: string;
}
export interface PropertyFeatures {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  aliases?: string[];
}

export interface FormattedPropertyType {
  id: number;
  title: string;
}
export interface WorkingDay {
  timezone: string;
  from: string;
  to: string;
}

export interface GalleryImage {
  owner: string;
  source: string;
  uuid: string;
}

export interface NameSlugPkey {
  name: string;
  slug: string;
  pkey: string;
}

export interface SimpleProperty extends NameSlugPkey {
  priceRange: number;
  countryName: string;
  cityOrRegionName: string;
  rating: number;
  ratingContributes: number;
  featuredImageUUID: string;
  location: Location;
  isFavorite: boolean;
  verified: boolean;
  skey?: string;
}

interface Label {
  ar: string;
  en: string;
}
interface Ticket {
  link: string;
  label: Label;
}
interface CreatedBy {
  id: string;
  name: string;
  profile: string;
  verified?: boolean;
}
export interface Property extends SimpleProperty {
  index: number;
  text: string;
  created_by: CreatedBy;
  website: string;
  address: string;
  email: string;
  features: string[];
  title: Title;
  pkey: string;
  workingHours: Record<string, WorkingDay[]>;
  gallery: GalleryImage[];
  phone: string;
  description: string;
  originalDescription?: string;
  translationSource?: string;
  originalName: string;
  is_permanently_closed: boolean;
  filters: string[];
  isOpen: boolean;
  ratingDistribution: number[];
  propertyTypes: number[];
  cityPkey: string;
  cityOrRegionSlug: string;
  countrySlug: string;
  isRegionData: boolean;
  isReviewed: boolean;
  rate: PropertyRateType;
  specialContent: GenericObject[];
  logo?: string;
  isClaimed?: boolean;
  isPremium?: boolean;
  ticket?: Ticket;
  min_visit_duration?: number;
  max_visit_duration?: number;
  location: {
    lon: number;
    lat: number;
  };
  featured_image: {
    owner: string;
    description: string;
    source: string;
    image_uuid: string;
  };
  slug: string;
  country: {
    name: string;
    id: string;
    code: {
      alpha_3: string;
      alpha_2: string;
    };
    slug: string;
  };
  city: {
    name: string;
    slug: string;
    id: string;
  };
  views_count: number;
  name: string;
  is_favorite: boolean;
  region?: {
    name: string;
    slug: string;
    id: string;
  };
}

export interface SimpleCountry extends NameSlugPkey {
  featuredImageUUID: string;
}

export type SimpleGeoPlace = SimpleCountry | SimpleRegion | SimpleCity;
