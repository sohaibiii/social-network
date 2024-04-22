export default {
  SEARCH: "/search",
  VISITED_PROPERTIES: "/search/visited-properties",
  CATEGORY_RECOMMENDATION: (type: string, id: string, thingsToDoId: number): string =>
    `/${type}/${id}/properties/${thingsToDoId}`,
  TAGS: "/search/tags"
};
