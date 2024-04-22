import { EntityState } from "@reduxjs/toolkit";

import { Property } from "~/apiServices/property/property.types";
import { IFavouriteList } from "~/apiServices/settings/settings.types";

export const SLICE_NAME = "favorite";

export interface FavoriteStateType {
  properties: EntityState<Property>;
  favouriteList: IFavouriteList[];
  favouriteListPageDetails?: {
    count?: number;
    scannedCount?: number;
    isEndReached?: boolean;
    skey?: string;
  };
  showEditNameDialog?: boolean;
  selectListIds: string[];
  modalTextInputValue: string;
  newListMode: boolean;
  selectFavouritePkey: string;
  selectFavouriteSkey: string;
  favouriteListItemsIds: string[];
  showEditFavouriteListNameDialog?: boolean;
  isFavorite: boolean;
  deletedFavouriteItemIds?: string[] | null;
  preSelectedFavouriteItems?: string[] | null;
  favouriteItemsLoading: boolean;
}
