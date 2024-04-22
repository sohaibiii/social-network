import { Asset } from "react-native-image-picker";
import { LatLng } from "react-native-maps";

import {
  CountryRegionCityType,
  PropertyResponseType,
  PropertyType
} from "~/apiServices/property/property.types";
import { GoogleLocation } from "~/components/addPost/postDetailsInput/PostDetailsInput.types";

export const SLICE_NAME = "propertySocialAction";

export interface SuggestPropertyInterface {
  propertyTypes: PropertyType[];
  marker: LatLng;
  address: string;
  propertyTitle: string;
  propertyDescription: string;
  propertyImages: Asset[];
  propertyImagesUploadIds: string[];
  recaptchaToken: string;
  isSubmitting: boolean;
}

export interface AddPostInterface {
  postLocation: GoogleLocation;
  postDetails: string;
  postImages: Asset[];
  postImagesUploadIds: string[];
  postCountryRegionCity: CountryRegionCityType | null;
  postCountryRegionCityArr: CountryRegionCityType[] | null;
  postCountryRegionCitySearch: string;
  postPropertySearch: string;
  postProperties: PropertyResponseType[];
  isEditPost?: boolean;
  postPkey?: string;
  postTimestamp?: number;
  isSubmitting: boolean;
}

export interface RatePropertyInterface {
  rateCountryRegionCity: CountryRegionCityType | null;
  rateCountryRegionCitySearch: string;
  rateProperty: PropertyResponseType | null;
  ratePropertySearch: string;
  rateStars: number;
  rateReview: string;
  rateImages: Asset[];
  rateImagesUploadIds: string[];
  rateCountryRegionCityArr: CountryRegionCityType[] | null;
  isSubmitting: boolean;
}

export interface PropertySocialActionInterface {
  suggestProperty: SuggestPropertyInterface;
  addPost: AddPostInterface;
  rateProperty: RatePropertyInterface;
}

export interface GalleryShape {
  id: string;
  type?: string;
}

export enum PostClass {
  POST = "post",
  ARTICLE = "article",
  SPONSORED = "sponsored"
}
