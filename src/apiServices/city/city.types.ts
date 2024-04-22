import { Code, Title } from "../destinations/destinations.types";

import { Currency } from "~/apiServices/property/property.types";
import { GalleryImage } from "~/types/common";

interface BestTimeToVisit {
  title: string;
  description: string;
}

interface Location {
  lon: number;
  lat: number;
  latDelta?: number;
  lonDelta?: number;
}

interface Country {
  code: Code;
  id: string;
  name: string;
  slug: string;
}

interface Region {
  id: string;
  name: string;
  slug: string;
}
export interface CommonGeoPlace {
  currency: Currency;
  months: number[];
  description: string;
  gallery: GalleryImage[];
  languages: string[];
  code: string;
  location: Location;
  bestTimeToVisit: BestTimeToVisit[];
  isTourestCity: boolean;
  livingCost: string;
  name: string;
  pkey: string;
  region: Region;
  slug: string;
  sportEventId: string;
  title: Title;
  viewsCount: number;
  country: Country;
  featuredImageUUID: string;
  originalDescription?: string;
  translationSource?: string;
}

export interface Weather {
  weatherCode: string;
  weatherIconType: string;
  localtime: string;
  current: number;
  max: number;
  min: number;
}
