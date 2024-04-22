import APIConstants from "./countryEndpoints";

import axiosInstance from "~/apiServices/axiosService";

const getCountriesCodes = async () => {
  return axiosInstance.get(`${APIConstants.COUNTRY_LIST}`);
};
const getCountryBySlug = async (slug: string) => {
  return axiosInstance.get(`${APIConstants.COUNTRY}`, {
    params: { slug, bodyType: "MD" }
  });
};

const getCountryPropertiesByPkey = async (
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

const getCountryRegionsAndCitiesByPkey = async (pkey: string) => {
  return axiosInstance.get(`${APIConstants.REGIONS_CITIES(pkey)}`);
};

export default {
  getCountriesCodes,
  getCountryBySlug,
  getCountryPropertiesByPkey,
  getCountryRegionsAndCitiesByPkey
};
