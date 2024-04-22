import APIConstants from "./cityEndpoints";

import axiosInstance from "~/apiServices/axiosService";

const getCityBySlug = async (slug: string) => {
  return axiosInstance.get(`${APIConstants.CITY}`, {
    params: { slug, bodyType: "MD" }
  });
};

const getCityPropertiesByPkey = async (
  pkey: string,
  categoryPkey = "",
  from = 0,
  filters = null
) => {
  return axiosInstance.post(
    `${APIConstants.PROPERTIES(pkey)}${categoryPkey ? `/${categoryPkey}` : ""}`,
    { filter: filters },
    { params: { from } }
  );
};

const getWeatherByLatLon = async (q: string) => {
  return axiosInstance.get(`${APIConstants.WEATHER}`, { params: { q } });
};

export default {
  getCityBySlug,
  getCityPropertiesByPkey,
  getWeatherByLatLon
};
