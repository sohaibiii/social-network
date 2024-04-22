import { searchAPI } from "~/apis/";
import {
  PropertyResponseType,
  SearchByTermResponse,
  GetThingsToDoResponse
} from "~/apiServices/property/property.types";
import { SearchScopes } from "~/containers/search/SearchScopes";

const searchByTags: (
  _term: string,
  _countries?: string,
  _regions?: string,
  _cities?: string,
  _from?: number,
  _size?: number
) => Promise<PropertyResponseType[]> = async (
  term: string,
  countries = "",
  regions = "",
  cities = "",
  from = 0,
  size = 10
) => {
  const response = await searchAPI.searchByTags(
    term,
    countries,
    regions,
    cities,
    from,
    size
  );
  const { data = [] } = response;
  return data;
};

const searchPropertiesByTags: (
  _term: string,
  _countries?: string,
  _regions?: string,
  _cities?: string,
  _from?: number,
  _size?: number
) => Promise<PropertyResponseType[]> = async (
  term: string,
  countries = "",
  regions = "",
  cities = "",
  from = 0,
  size = 10
) => {
  const response = await searchAPI.searchByTags(
    term,
    countries,
    regions,
    cities,
    from,
    size
  );
  const { data = [] } = response;
  data.items = data.items.filter(item => item._index === "property");
  return data;
};

const searchByTerm: (
  _term: string,
  _scope?: string,
  _from?: number,
  _size?: number
) => Promise<SearchByTermResponse> = async (
  term: string,
  scope = "general",
  from = 0,
  size = 10
) => {
  const response = await searchAPI.searchByTerm(term, scope, from, size);
  const { data = [] } = response;
  if (scope === SearchScopes.DESTINATION) {
    data.items = data?.items?.filter(item => !!item.pkey);
  }
  return data;
};

const getCategoryRecommendation: (
  _from?: number,
  _limit?: number,
  _type?: string,
  _id?: string,
  _thingsToDoId?: number
) => Promise<GetThingsToDoResponse[]> = async (
  from = 0,
  limit = 10,
  type = "",
  id = "",
  thingsToDoId = 16
) => {
  const response = await searchAPI.getCategoryRecommendation(
    from,
    limit,
    type,
    id,
    thingsToDoId
  );
  const { data = [] } = response;
  return data;
};

export default {
  searchByTerm,
  searchPropertiesByTags,
  getCategoryRecommendation,
  searchByTags
};
