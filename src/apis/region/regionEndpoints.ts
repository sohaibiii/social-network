export default {
  REGION: "/region/",
  PROPERTIES: (pkey: string): string => `/region/${pkey}/properties`,
  PROPERTIES_BY_CATEGORY: (pkey: string, category: number): string =>
    `/region/${pkey}/properties/${category}`
};
