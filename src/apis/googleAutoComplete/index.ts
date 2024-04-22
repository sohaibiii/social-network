import axios, { AxiosResponse } from "axios";

import APIConstants from "./googleAutoCompleteEndpoint";

import { SAFARWAY_MAP_API } from "~/constants/";

const getDetails = (query: string): Promise<AxiosResponse> => {
  return axios.get(`${SAFARWAY_MAP_API}${APIConstants.GET_DETAILS(query)}`);
};

const getAutoComplete = (text: string, query: string): Promise<AxiosResponse> => {
  return axios.get(`${SAFARWAY_MAP_API}${APIConstants.AUTO_COMPLETE(text, query)}`);
};

export default {
  getAutoComplete,
  getDetails
};
