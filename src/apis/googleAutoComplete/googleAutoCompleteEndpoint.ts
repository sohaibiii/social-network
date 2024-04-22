export default {
  GET_DETAILS: (queryParam: string): string => `/place/details/json?${queryParam}`,
  AUTO_COMPLETE: (encodedText: string, queryString: string): string =>
    `/place/autocomplete/json?input=${encodedText}&${queryString}`
};
