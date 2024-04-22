import { GenericObject } from "~/types/common";

export interface MoreMobileItem {
  deviceToken: boolean;
  name: string;
  internal: boolean;
  url: string;
}

export interface MoreMobile {
  white: MoreMobileItem[];
  blue: MoreMobileItem[];
}

export interface VerificationTerms {
  title: string;
  aboutVerification: string;
  condition: string;
  terms: string;
}

export interface RahhalTerms {
  title: string;
  aboutRahhal: string;
  condition: string;
  terms: string[];
}

export interface IFavouriteList {
  items_count: number;
  pkey: string;
  name: string;
  skey: string;
}

export interface FavouriteListResponse {
  items: IFavouriteList[];
  count: number;
  scannedCount: number;
  reset?: boolean;
}

export interface FavouriteListItemsResponse {
  location: {
    lon: number;
    lat: number;
  };
  rate: {
    rate_calculated: string;
    google_rate: string;
    rate_distribution: GenericObject;
    contributes: number;
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
  pkey: string;
  title: {
    ar: string;
    en: string;
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
