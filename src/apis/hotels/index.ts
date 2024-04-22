import { AxiosResponse } from "axios";

import axiosInstance, { axiosHotelsInstance } from "../../apiServices/axiosService";

import APIConstants from "./hotelsEndpoints";

import { HotelSearchPayload } from "~/apiServices/hotels/hotels.types";
import { HotelsPayload } from "~/redux/types/hotels.types";
import { GenericObject } from "~/types/common";

const getRooms = (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string,
  offerId: string
): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(
    `${APIConstants.ROOMS(srk, hotelIndex, btravel_results_token, offerId)}`
  );
};

const getHotelOffers = (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string
): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(
    `${APIConstants.OFFERS(srk, hotelIndex, btravel_results_token)}`
  );
};

const getHotel = (
  srk: string,
  hotelIndex: string,
  btravel_results_token: string
): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(
    `${APIConstants.HOTEL(srk, hotelIndex, btravel_results_token)}`
  );
};
const getAccessToken = (): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(`${APIConstants.GET_ACCESS_TOKEN}`);
};

const searchHotels = (payload: HotelSearchPayload): Promise<AxiosResponse> => {
  return axiosHotelsInstance.post(`${APIConstants.SEARCH}`, payload);
};

const progressHotelsSearch = (token: string): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(`${APIConstants.PROGRESS}`, {
    params: {
      token
    }
  });
};

const resultsHotelsSearch = (
  srk: string,
  payload: HotelsPayload,
  hotelFilters: string[],
  page: number,
  limit: number
): Promise<AxiosResponse> => {
  return axiosHotelsInstance.get(`${APIConstants.RESULTS(srk)}`, {
    params: {
      includeHotelDetails: 1,
      perPage: limit,
      page,
      ...hotelFilters,
      token: payload
    }
  });
};

const preBook = (
  srk: string,
  hotelIndex: string,
  offerId: string,
  token: string,
  packageToken: string,
  roomTokens: string[]
): Promise<AxiosResponse> => {
  return axiosHotelsInstance.post(
    `${APIConstants.PRE_BOOK(srk, hotelIndex, offerId)}`,
    { packageToken, roomTokens },
    {
      params: {
        token
      }
    }
  );
};

const Book = (
  srk: string,
  hotelIndex: string,
  offerId: string,
  token: string,
  payload: GenericObject
): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.BOOK(srk, hotelIndex, offerId)}`, {
    ...payload
  });
};

export default {
  getHotel,
  getRooms,
  getHotelOffers,
  getAccessToken,
  searchHotels,
  progressHotelsSearch,
  resultsHotelsSearch,
  preBook,
  Book
};
