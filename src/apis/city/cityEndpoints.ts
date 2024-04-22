export default {
  CITY: "/city/",
  PROPERTIES: (pkey: string): string => `/city/${pkey}/properties`,
  PROPERTIES_BY_CATEGORY: (pkey: string, category: number): string =>
    `/city/${pkey}/properties/${category}`,
  WEATHER: `/services/weather`
};
