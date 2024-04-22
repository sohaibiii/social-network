import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Property } from "~/apiServices/property/property.types";
import {
  checkIsFavouriteThunk,
  createFavouriteListThunk,
  deleteListByIdThunk,
  deleteListItemThunk,
  favoriteItemThunk,
  getFavouriteListItemsThunk,
  getFavouriteListThunk,
  updateFavouriteListNameThunk
} from "~/redux/thunk/favorite.thunk";
import { FavoriteStateType, SLICE_NAME } from "~/redux/types/favorite.types";

export const propertiesAdapter = createEntityAdapter<Property>({
  selectId: property => property?.pkey
});

const INITIAL_FAVORITE_STATE: FavoriteStateType = {
  properties: propertiesAdapter.getInitialState(),
  favouriteList: [],
  favouriteListPageDetails: {},
  showEditNameDialog: false,
  selectListIds: [],
  modalTextInputValue: "",
  newListMode: false,
  selectFavouritePkey: "",
  selectFavouriteSkey: "",
  favouriteListItemsIds: [],
  showEditFavouriteListNameDialog: false,
  isFavorite: false,
  deletedFavouriteItemIds: null,
  preSelectedFavouriteItems: null,
  favouriteItemsLoading: false
};

export const favoriteSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_FAVORITE_STATE,
  reducers: {
    upsertProperties(state, { payload }) {
      propertiesAdapter.upsertMany(state.properties, payload);
    },
    clearFavouriteList(state) {
      state.favouriteList = [];
      state.favouriteListPageDetails = {};
    },
    clearFavouriteListPageDetails(state) {
      state.favouriteListPageDetails = {};
    },
    clearFavouriteListData(state) {
      state.selectListIds = [];
      state.modalTextInputValue = "";
      state.isFavorite = false;
      state.deletedFavouriteItemIds = null;
      state.preSelectedFavouriteItems = null;
    },
    setSelectListId(state, { payload }) {
      const isItemExist =
        state.preSelectedFavouriteItems &&
        state.preSelectedFavouriteItems.includes(payload);

      if (isItemExist) {
        if (state.deletedFavouriteItemIds) {
          if (state.deletedFavouriteItemIds.includes(payload)) {
            state.deletedFavouriteItemIds = state?.deletedFavouriteItemIds?.filter(
              id => id !== payload
            );
          } else {
            state.deletedFavouriteItemIds = [...state.deletedFavouriteItemIds, payload];
          }
        } else {
          state.deletedFavouriteItemIds = [payload];
        }
      } else if (!isItemExist) {
        state.deletedFavouriteItemIds = state?.deletedFavouriteItemIds?.filter(
          id => id !== payload
        );
      }

      if (state.selectListIds?.includes(payload)) {
        state.selectListIds = state.selectListIds.filter(id => id !== payload);
      } else {
        state.selectListIds.push(payload);
      }
    },

    setShowEditFavouriteListNameDialog(
      state,
      action: PayloadAction<FavoriteStateType["showEditFavouriteListNameDialog"]>
    ) {
      state.showEditFavouriteListNameDialog = action.payload;
    },

    setFavouriteListModalTextInputValue(state, { payload }) {
      state.modalTextInputValue = payload;
    },

    setNewFavouriteListMode(state, { payload }) {
      state.newListMode = payload;
    },

    setSelectFavouritemPkey(state, { payload }) {
      state.selectFavouritePkey = payload;
    },

    setSelectFavouritemSkey(state, { payload }) {
      state.selectFavouriteSkey = payload;
    },

    decrementFavouriteListItemCount(state, { payload }: PayloadAction<{ skey: string }>) {
      const { skey } = payload;

      const itemIndex = state.favouriteList.findIndex(item => item.skey === skey);
      if (itemIndex !== -1) {
        state.favouriteList[itemIndex].items_count -= 1;
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addCase(getFavouriteListThunk.fulfilled, (state, { payload }) => {
      const { items, reset, ...rest } = payload || {};

      if (reset) {
        state.favouriteList = items || [];
      } else {
        state.favouriteList = items ? [...state.favouriteList, ...items] : [];
      }

      state.favouriteListPageDetails = {
        ...rest,
        isEndReached: items && items?.length < 10,
        skey: items && items[items?.length - 1]?.skey
      };
    });

    addCase(getFavouriteListItemsThunk.fulfilled, (state, { payload }) => {
      const data = payload?.data?.map(item => item.pkey) || [];
      if (payload.page === 1) {
        state.favouriteListItemsIds = data;
      } else {
        state.favouriteListItemsIds = [...state.favouriteListItemsIds, ...data];
      }
      propertiesAdapter.upsertMany(state.properties, payload?.data);
    });

    addCase(createFavouriteListThunk.fulfilled, (state, { payload }) => {
      if (payload) state.favouriteList.unshift(payload);
    });

    addCase(checkIsFavouriteThunk.pending, state => {
      state.favouriteItemsLoading = true;
    });

    addCase(checkIsFavouriteThunk.fulfilled, (state, { payload }) => {
      state.isFavorite = payload.is_favorite;
      state.selectListIds = [...payload.skeys];
      state.preSelectedFavouriteItems = payload.skeys;
      state.favouriteItemsLoading = false;
    });

    addCase(checkIsFavouriteThunk.rejected, state => {
      state.favouriteItemsLoading = false;
    });

    addCase(updateFavouriteListNameThunk.fulfilled, (state, { payload }) => {
      const { name, skey } = payload || {};
      const listItem = state.favouriteList.findIndex(item => item.skey === skey);
      if (listItem !== -1) state.favouriteList[listItem].name = name || "";
    });

    addCase(deleteListByIdThunk.fulfilled, (state, { payload }) => {
      const listItem = state.favouriteList.findIndex(item => item.skey === payload.skey);
      if (listItem !== -1) state.favouriteList.splice(listItem, 1);

      const deletedItems = payload?.data?.is_favorite;
      const deletedItemsKeys = !!deletedItems && Object.keys(deletedItems);
      if (!deletedItems || deletedItemsKeys.length === 0) return;

      deletedItemsKeys.map(pkey => {
        propertiesAdapter.updateOne(state.properties, {
          id: pkey,
          changes: { is_favorite: deletedItems[pkey] }
        });
      });
    });

    addCase(favoriteItemThunk.fulfilled, (state, { payload }) => {
      const { skeys, pkey } = payload || {};

      propertiesAdapter.updateOne(state.properties, {
        id: pkey!,
        changes: { is_favorite: !!state.selectListIds?.length }
      });

      state.favouriteList = state.favouriteList.map(item => ({
        ...item,
        items_count: skeys?.includes(item.skey) ? item.items_count + 1 : item.items_count
      }));
    });

    addCase(deleteListItemThunk.fulfilled, (state, { payload }) => {
      const { pkey, skeys, is_favorite } = payload || {};

      propertiesAdapter.updateOne(state.properties, {
        id: pkey!,
        changes: { is_favorite: is_favorite } // must be from backend
      });

      state.favouriteListItemsIds = state.favouriteListItemsIds.filter(
        item => item !== pkey
      );

      state.favouriteList = state.favouriteList.map(item => ({
        ...item,
        items_count: skeys?.includes(item.skey) ? item.items_count - 1 : item.items_count
      }));
      state.deletedFavouriteItemIds = null;
      state.selectFavouriteSkey = "";
      state.selectFavouritePkey = "";
    });
  }
});

export const {
  upsertProperties,
  clearFavouriteList,
  clearFavouriteListPageDetails,
  setSelectListId,
  setFavouriteListModalTextInputValue,
  setNewFavouriteListMode,
  setSelectFavouritemPkey,
  setSelectFavouritemSkey,
  setShowEditFavouriteListNameDialog,
  decrementFavouriteListItemCount,
  clearFavouriteListData
} = favoriteSlice.actions;

export default favoriteSlice.reducer;
