import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import { GetPropertyByLocationProps } from "./surroundingLandMarks.types";
import APIConstants from "./surroundingLandMarksEndpoints";

import { GenericObject } from "~/types/common";

const getCategories = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.PROPERTY_TYPES}`);
};

const getPropertyByLocation = (
  data: GetPropertyByLocationProps
): Promise<AxiosResponse> => {
  const {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
    filter,
    filterValues,
    isHotel
  } = data;

  const distance = 50 * Math.max(Math.abs(latitudeDelta), Math.abs(longitudeDelta));

  const { isOpen, priceRange, starRating, selectedFilters } = filterValues;
  const filters = selectedFilters?.length && selectedFilters.join(",");

  const params: GenericObject = {
    location: `${latitude},${longitude}`,
    distance: `${distance}km`,
    size: "100",
    source: "app"
  };

  filter && (params.property_types = filter);
  if (isHotel) {
    starRating && (params.star_rating = starRating);
  } else {
    isOpen && (params.is_open = isOpen);
    priceRange && (params.price_range = priceRange);
    filters && (params.filters = filters);
  }

  return axiosInstance.get(`${APIConstants.PROPERTY_LOCATION}`, { params });
};

const getTypeFilters = (id: number): Promise<AxiosResponse> => {
  return axiosInstance.get(APIConstants.PROPERTY_FILTER(id), {
    params: { source: "app" }
  });
};

export default {
  getCategories,
  getPropertyByLocation,
  getTypeFilters
};
