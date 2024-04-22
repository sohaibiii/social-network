import { createAsyncThunk } from "@reduxjs/toolkit";

import settingsService from "../../apiServices/settings/settings";

import { settingsAPI } from "~/apis/";
import { FavouriteItemHeaderDialogProps } from "~/components/favoriteList/favoriteItems/favouriteItems.types";

const getFavouriteListItemsThunk = createAsyncThunk(
  "settings/getFavouriteListItems",
  async ({ skey, page, limit }: { skey: string; page: number; limit: number }) => {
    const response = await settingsService.getFavouriteListItems(skey, page, limit);
    return { data: response?.items, page, metadata: response?.metadata };
  }
);

const getFavouriteListThunk = createAsyncThunk(
  "favorite/getFavouriteList",
  async ({
    reset,
    skey,
    pageSize
  }: {
    reset?: boolean;
    skey?: string;
    pageSize?: number;
  }) => {
    const response = await settingsService.getFavouriteList(skey, pageSize);
    return { ...response, reset };
  }
);

const updateFavouriteListNameThunk = createAsyncThunk(
  "favorite/updateListName",
  async (data: FavouriteItemHeaderDialogProps) => {
    const response = await settingsService.updateListName(data);
    return response;
  }
);

const deleteListByIdThunk = createAsyncThunk(
  "favorite/deleteListById",
  async (skey: string) => {
    const response = await settingsService.deleteListById(skey);
    return response;
  }
);

const deleteListItemThunk = createAsyncThunk(
  "favorite/deleteListItem",
  async (data: { skeys: string[]; pkey: string }) => {
    const response = await settingsService.deleteListItem(data.skeys, data.pkey);

    return response;
  }
);

const favoriteItemThunk = createAsyncThunk(
  "favorite/favoriteItem",
  async (data: { skeys: string[]; pkey: string }) => {
    const response = await settingsService.favoriteItem(data.skeys, data.pkey);

    return response;
  }
);

const createFavouriteListThunk = createAsyncThunk(
  "favorite/createFavouriteList",
  async (name: string) => {
    const response = await settingsService.createFavouriteList(name);
    return response;
  }
);

const checkIsFavouriteThunk = createAsyncThunk(
  "favorite/checkIsFavourite",
  async (pkey: string) => {
    const response = await settingsAPI.checkIsFavourite(pkey);
    return response.data;
  }
);

export {
  getFavouriteListThunk,
  deleteListByIdThunk,
  createFavouriteListThunk,
  getFavouriteListItemsThunk,
  deleteListItemThunk,
  favoriteItemThunk,
  updateFavouriteListNameThunk,
  checkIsFavouriteThunk
};
