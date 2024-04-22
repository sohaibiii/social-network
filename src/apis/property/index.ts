import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./propertyEndpoint";

import { FormattedPropertyType } from "~/apiServices/property/property.types";

const getPropertyTypes = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.TYPES}`);
};

const suggestProperty = (
  title: string,
  address: string,
  type: FormattedPropertyType[],
  verification_token: string,
  gallery: { id: string }[],
  description?: string
): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.SUGGEST}`, {
    title,
    address,
    type,
    verification_token,
    gallery,
    description
  });
};

const getPropertyBySlug = async (slug: string) => {
  return axiosInstance.get(`${APIConstants.PROPERTY}`, {
    params: {
      slug,
      bodyType: "MD"
    }
  });
};

const getPropertyStatusBySlug = async (slug: string) => {
  return axiosInstance.get(`${APIConstants.PROPERTY_STATUS(slug)}`);
};

const getPropertiesByLocation = async (
  location: Location,
  distance: number,
  propertiesTypes?: number[],
  pkey?: string,
  isRegion?: boolean,
  priceFilter?: number,
  ratingFilter?: number,
  isOpen?: boolean,
  filters?: string[]
) => {
  const body: Record<string, any> = {
    location: `${location.lat},${location.lon}`,
    distance: `${distance}km`,
    size: 50
  };
  if (propertiesTypes && propertiesTypes.length > 0)
    body.property_types = propertiesTypes.join(",");
  if (pkey) {
    if (isRegion === undefined) {
      body.country = pkey;
    } else if (isRegion) {
      body.region = pkey;
    } else {
      body.city = pkey;
    }
  }
  if (priceFilter) body.price_range = priceFilter;
  if (ratingFilter) body.star_rating = ratingFilter;
  if (isOpen) body.is_open = true;
  if (filters && filters.length > 0) body.filters = filters.join(",");

  return axiosInstance.get(`${APIConstants.LOCATION}`, {
    params: body
  });
};

export default {
  getPropertyTypes,
  suggestProperty,
  getPropertyBySlug,
  getPropertyStatusBySlug,
  getPropertiesByLocation
};
