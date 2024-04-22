import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./settingsEndpoint";

import { FavouriteItemHeaderDialogProps } from "~/components/favoriteList/favoriteItems/favouriteItems.types";

const getSettingsDynamicMenu = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.MORE_MOBILE}`);
};

const getVerificationTerms = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.VERIFIED}?bodyType=PURE`);
};

const getRahhalTerms = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.RAHHAL}?bodyType=PURE`);
};

const requestRahhalBadge = (): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.REQUEST_RAHHAL}`);
};

const requestVerificationBadge = (): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.REQUEST_ACCOUNT_VERIFICATION}`);
};

const purgeAccountRequest = async (): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.REQUEST_PURGE}`);
};

const deactivateAccountRequest = async (): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.DEACTIVATE_ACCOUNT}`);
};

const getBlockList = async (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.BLOCK_LIST}`);
};

const blockUserRequest = async (blocked_uuid: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.BLOCK_LIST}`, {
    blocked_uuid
  });
};
const unblockUserRequest = async (blocked_uuid: string): Promise<AxiosResponse> => {
  return axiosInstance.delete(`${APIConstants.BLOCK_LIST}?blocked_uuid=${blocked_uuid}`);
};

const createFavouriteList = async (name: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.FAVOURITE_LIST}`, { name });
};

const getFavouriteList = async (skey?: string, pageSize = 20): Promise<AxiosResponse> => {
  return axiosInstance.get(
    `${APIConstants.FAVOURITE_LIST}?limit=${pageSize}${skey ? `&skey=${skey}` : ""}`
  );
};

const checkIsFavourite = async (pkey: string): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.FAVOURITE}/?pkey=${pkey}`);
};

const updateListName = async (
  data: FavouriteItemHeaderDialogProps
): Promise<AxiosResponse> => {
  return axiosInstance.put(`${APIConstants.FAVOURITE_LIST}`, data);
};

const deleteListById = async (skey: string): Promise<AxiosResponse> => {
  return axiosInstance.delete(`${APIConstants.FAVOURITE_LIST}/${skey}`);
};

const getFavouriteListItems = async (
  skey?: string,
  page?: number,
  limit = 10
): Promise<AxiosResponse> => {
  return axiosInstance.get(
    `${APIConstants.FAVOURITE_LIST_ITEMS}?skey=${skey}&page=${page}&limit=${limit}`
  );
};

const favoriteItem = async (pkey: string, skeys: string[]): Promise<AxiosResponse> => {
  return axiosInstance.post(APIConstants.FAVOURITE_ITEMS, {
    skeys,
    pkey
  });
};

const deleteListItem = async (pkey: string, skeys: string[]): Promise<AxiosResponse> => {
  return axiosInstance.patch(`${APIConstants.FAVOURITE_ITEMS}/${pkey}`, {
    skeys
  });
};

export default {
  getSettingsDynamicMenu,
  getVerificationTerms,
  getRahhalTerms,
  requestRahhalBadge,
  requestVerificationBadge,
  deactivateAccountRequest,
  purgeAccountRequest,
  getBlockList,
  blockUserRequest,
  unblockUserRequest,
  getFavouriteList,
  getFavouriteListItems,
  updateListName,
  deleteListById,
  deleteListItem,
  createFavouriteList,
  favoriteItem,
  checkIsFavourite
};
