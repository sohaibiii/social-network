export type GenericObject = { [key: string]: any };

export interface NameUUID {
  name: string;
  uuid: string;
}

export interface NameID {
  name: string;
  uuid: string;
}

export interface CountryAndRegion {
  ar?: string;
  en?: string;
  fr?: string;
  name?: string;
  pkey?: string;
  slug?: string;
}

export interface TitleLanguageObject {
  ar: string;
  en: string;
}

export interface GalleryImage {
  owner: string;
  source: string;
  uuid: string;
}

export interface MoreMobileItem {
  deviceToken: boolean;
  name: string;
  internal: boolean;
  url: string;
}

export interface FeaturedImage {
  owner: string;
  description: string;
  source: string;
  image_uuid: string;
}
export interface MoreMobile {
  white: MoreMobileItem[];
  blue: MoreMobileItem[];
}

export enum NumbersCount {
  NONE = 1,
  HUNDRED = 100,
  THOUSAND = 1000,
  MILLION = 1000000
}

export enum EnvironmentTypes {
  STAGE = "Staging",
  PRODUCTION = "Production",
  DEVELOPMENT = "Development"
}

export declare type NumbersCountType = keyof typeof NumbersCount;
