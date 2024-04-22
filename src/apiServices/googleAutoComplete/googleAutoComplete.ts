import queryString from "query-string";

import {
  GoogleAutoCompleteResponse,
  GoogleGetDetailsResponse
} from "./googleAutoComplete.types";

import { googleAutoCompleteAPI } from "~/apis/";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const getDetails: (
  _query: GenericObject,
  _place_id: string
) => Promise<GoogleGetDetailsResponse> = async (query, place_id) => {
  try {
    const stringifiedQuery = queryString.stringify({
      key: query.key,
      placeid: place_id,
      language: query.language,
      fields: "geometry,address_component,formatted_address"
    });

    const { data } = await googleAutoCompleteAPI.getDetails(stringifiedQuery);
    return data;
  } catch (error) {
    logError(
      `Error: getDetails --googleAutoComplete.ts-- query=${query} place_id=${place_id} ${error}`
    );
    throw error;
  }
};
const getAutoComplete: (
  _query: GenericObject,
  _text: string
) => Promise<GoogleAutoCompleteResponse> = async (query, text) => {
  try {
    const { data } = await googleAutoCompleteAPI.getAutoComplete(
      encodeURIComponent(text),
      queryString.stringify(query)
    );
    return data;
  } catch (error) {
    logError(
      `Error: getDetails --googleAutoComplete.ts-- query=${query} text=${text} ${error}`
    );
    throw error;
  }
};

export default {
  getDetails,
  getAutoComplete
};
