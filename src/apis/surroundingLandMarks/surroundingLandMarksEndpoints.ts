export default {
  PROPERTY_TYPES: "/property/types?source=app",
  PROPERTY_LOCATION: "/property/location",
  PROPERTY_FILTER: (id: number): string => `/property/filter/${id}`
};
