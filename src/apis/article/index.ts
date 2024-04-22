import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./articleEndpoint";

const getArticles = (
  from = 0,
  size = 10,
  categories: number[] = [],
  countryId?: string,
  regionId?: string,
  cityId?: string
) => {
  const body: Record<string, any> = {
    from,
    size,
    categories
  };
  if (countryId) {
    body.countryId = countryId;
  }
  if (regionId) {
    body.regionId = regionId;
  }
  if (cityId) {
    body.cityId = cityId;
  }

  return axiosInstance.post(`${APIConstants.SEARCH}`, body);
};

const getArticleBySlug = (slug: string) => {
  return axiosInstance.get(`${APIConstants.ARTICLE}?slug=${slug}&bodyType=MD`);
};
const getCategories = () => {
  return axiosInstance.get(`${APIConstants.CATEGORIES}`);
};

export default {
  getArticles,
  getArticleBySlug,
  getCategories
};
