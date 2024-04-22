import { createDraftSafeSelector } from "@reduxjs/toolkit";

import { RootState } from "~/redux/store";

import { IFavouriteList } from "~/apiServices/settings/settings.types";
import { propertiesAdapter } from "~/redux/reducers/favorite.slice";

const favouriteList = (state: RootState) => state.favorite.favouriteList;

export const getFavoriteListById = (id: string) => {
  return createDraftSafeSelector(favouriteList, (favouriteList: IFavouriteList[]) =>
    favouriteList.find(item => item.skey === id)
  );
};

export const getPropertyById = (id: string) => {
  return createDraftSafeSelector(
    propertiesSelectors.selectEntities,
    properties => properties[id]
  );
};

export const propertiesSelectors = propertiesAdapter.getSelectors(
  (state: RootState) => state.favorite.properties
);

export const propertiesSelector = (ids?: string[]) => {
  return createDraftSafeSelector(propertiesSelectors.selectEntities, properties => {
    const data = ids && ids.map(id => properties[id]);

    return data || [];
  });
};
