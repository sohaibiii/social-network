import {
  HotelGetAccessTokenResponse,
  HotelProgressResponse,
  HotelResultsResponse,
  HotelSearchPayload,
  HotelSearchResponse
} from "./hotels.types";

import { hotelAPI } from "~/apis/";
import { HotelsPayload } from "~/redux/types/hotels.types";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const getAccessToken: () => Promise<HotelGetAccessTokenResponse> = async () => {
  try {
    const { data } = await hotelAPI.getAccessToken();
    return data;
  } catch (error) {
    logError(`Error: getAccessToken --hotels.ts-- ${error}`);
  }
};

const searchHotels: (
  _payload: HotelSearchPayload
) => Promise<HotelSearchResponse> = async payload => {
  try {
    const { data } = await hotelAPI.searchHotels(payload);
    return data;
  } catch (error) {
    logError(`Error: searchHotels --hotels.tsx-- ${error}`);
    throw error;
  }
};

const getHotelOffers: (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string
) => Promise<any> = async (srk, hotelIndex, btravel_results_token) => {
  try {
    const { data } = await hotelAPI.getHotelOffers(
      srk,
      hotelIndex,
      btravel_results_token
    );
    return data;
  } catch (error) {
    logError(`Error: getHotelOffers --hotels.tsx-- ${error}`);
    throw error;
  }
};

const getRooms: (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string,
  offerId: string
) => Promise<any> = async (srk, hotelIndex, btravel_results_token, offerId) => {
  try {
    const { data } = await hotelAPI.getRooms(
      srk,
      hotelIndex,
      btravel_results_token,
      offerId
    );

    const roomsWithOfferId = [];
    for (let index = 0; index < data.rooms.length; index++) {
      const room = data.rooms[index];
      roomsWithOfferId.push({ ...room, offerId });
    }
    return roomsWithOfferId;
  } catch (error) {
    logError(`Error: getRooms --hotels.tsx-- ${error}`);
    throw error;
  }
};

const getHotel: (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string,
  accessToken?: string
) => Promise<any> = async (srk, hotelIndex, btravel_results_token, accessToken) => {
  try {
    const { data } = await hotelAPI.getHotel(
      srk,
      hotelIndex,
      btravel_results_token,
      accessToken
    );
    return data;
  } catch (error) {
    logError(`Error: getHotel --hotels.tsx-- ${error}`);
    throw error;
  }
};

const getHotelSession: (
  _id: string,
  _payload: HotelSearchPayload
) => Promise<any> = async (id, payload) => {
  try {
    const { data } = await hotelAPI.getHotelSession({
      ...payload,
      id,
      type: "hotel"
    });
    return data;
  } catch (error) {
    logError(`Error: getHotelSession --hotels.tsx-- ${error}`);
    throw error;
  }
};

const progressHotelsSearch: (
  _token: string
) => Promise<HotelProgressResponse> = async token => {
  try {
    const { data } = await hotelAPI.progressHotelsSearch(token);
    return data;
  } catch (error) {
    logError(`Error: progressHotelsSearch --hotels.tsx-- ${error}`);
    throw error;
  }
};

const resultsHotelsSearch: (
  _srk: string,
  _payload: HotelsPayload,
  _hotelFilters: string[],
  _page: number,
  _limit: number
) => Promise<HotelResultsResponse> = async (srk, payload, hotelFilters, page, limit) => {
  try {
    const { data } = await hotelAPI.resultsHotelsSearch(
      srk,
      payload,
      hotelFilters,
      page,
      limit
    );

    return data;
  } catch (error) {
    logError(`Error: progressHotelsSearch --hotels.tsx-- ${error}`);
    throw error;
  }
};

const preBook: (
  srk: string,
  hotelIndex: string,
  offerId: string,
  btravel_results_token: string,
  packageToken: string,
  roomTokens: string[]
) => Promise<any> = async (
  srk,
  hotelIndex,
  offerId,
  btravel_results_token,
  packageToken,
  roomTokens
) => {
  try {
    const { data } = await hotelAPI.preBook(
      srk,
      hotelIndex,
      offerId,
      btravel_results_token,
      packageToken,
      roomTokens
    );

    return data;
  } catch (error) {
    logError(`Error: preBook --hotels.tsx-- ${error}`);
    throw error;
  }
};

const book: (
  srk: string,
  hotelIndex: string,
  offerId: string,
  btravel_results_token: string,
  payload: GenericObject
) => Promise<any> = async (srk, hotelIndex, offerId, btravel_results_token, payload) => {
  try {
    const { data } = await hotelAPI.Book(
      srk,
      hotelIndex,
      offerId,
      btravel_results_token,
      payload
    );

    return data;
  } catch (error) {
    logError(`Error: Book --hotels.tsx-- ${error}`);
    throw error;
  }
};

export default {
  getAccessToken,
  searchHotels,
  getHotelSession,
  getRooms,
  getHotelOffers,
  progressHotelsSearch,
  resultsHotelsSearch,
  getHotel,
  preBook,
  book
};
