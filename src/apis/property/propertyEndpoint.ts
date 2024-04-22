export default {
  TYPES: "/property/types",
  SUGGEST: "/property/suggest",
  PROPERTY: "/property",
  PROPERTY_STATUS: (slug: string): string => `/property/status/${slug}`,
  LOCATION: "/property/location"
};
