import APIConstants from "~/apis/search/searchEndpoint";
import axiosInstance from "~/apiServices/axiosService";

const searchByTerm = async (term: string, scope: string, from: number, size: number) => {
  return axiosInstance.get(`${APIConstants.SEARCH}`, {
    params: { term, scope, from, size }
  });
};

const getCategoryRecommendation = async (
  from: number,
  limit: number,
  type: string,
  id: string,
  thingsToDoId: number
) => {
  return axiosInstance.get(
    `${APIConstants.CATEGORY_RECOMMENDATION(type, id, thingsToDoId)}`,
    {
      params: { from, size: limit, top: true }
    }
  );
};

const searchByTags = async (
  term: string,
  countries: string,
  regions: string,
  cities: string,
  from: number,
  size: number
) => {
  return axiosInstance.get(`${APIConstants.TAGS}`, {
    params: { term, countries, regions, cities, from, size }
  });
};
export default {
  getCategoryRecommendation,
  searchByTerm,
  searchByTags
};
