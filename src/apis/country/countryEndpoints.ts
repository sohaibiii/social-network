export default {
  COUNTRY_LIST: "/country/list",
  COUNTRY: "/country/",
  PROPERTIES: (pkey: string): string => `/country/${pkey}/properties`,
  PROPERTIES_BY_CATEGORY: (pkey: string, category: number): string =>
    `/country/${pkey}/properties/${category}`,
  REGIONS_CITIES: (pkey: string): string => `/country/${pkey}/regions-cities`
};
