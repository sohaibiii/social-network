import {
  MoreMobileItem,
  MoreMobile,
  VerificationTerms,
  RahhalTerms,
  FavouriteListResponse,
  FavouriteListItemsResponse,
  IFavouriteList
} from "./settings.types";

import { settingsAPI } from "~/apis/";
import { FavouriteItemHeaderDialogProps } from "~/components/favoriteList/favoriteItems/favouriteItems.types";
import { translate } from "~/translations/";
import { SimpleUser } from "~/types/user";
import { errorLogFormatter, logError } from "~/utils/";

const getSettingsDynamicMenu: () => Promise<MoreMobile | undefined> = async () => {
  try {
    const { data }: any = await settingsAPI.getSettingsDynamicMenu();

    const blue: MoreMobileItem[] = [];
    const white: MoreMobileItem[] = [];
    data.blue.forEach((item: any) => {
      if (item.url === "contact-us") {
        return white.push({
          name: item.name,
          internal: true,
          url: "ContactUs",
          deviceToken: item.deviceToken ?? false
        });
      }
      blue.push({
        name: item.name,
        internal: item.internal ?? false,
        url: item.url,
        deviceToken: item.deviceToken ?? false
      });
    });
    data.white.forEach((item: any) => {
      white.push({
        name: item.name,
        internal: item.internal ?? false,
        url: item.url,
        deviceToken: item.deviceToken ?? false
      });
    });

    return {
      blue,
      white: white.reverse()
    };
  } catch (error) {
    logError(`Error: getSettingsDynamicMenu --settings.ts-- ${error}`);
  }
};

const getVerificationTerms: () => Promise<VerificationTerms | undefined> = async () => {
  try {
    const { data } = await settingsAPI.getVerificationTerms();
    const { ProcessInfo, ...restOfProps } = data;
    const aboutTerms = restOfProps.aboutVerification.split(".");
    const terms = restOfProps.VerificationTerms.split(".");
    const verificationTerms = {
      title: aboutTerms[0],
      aboutVerification: aboutTerms[1],
      condition: terms[0],
      terms: terms[1]
    };

    return verificationTerms;
  } catch (error) {
    logError(`Error: getVerificationTerms --settings.ts-- ${error}`);
  }
};

const getRahhalTerms: () => Promise<RahhalTerms | undefined> = async () => {
  try {
    const { data } = await settingsAPI.getRahhalTerms();
    const { ProcessInfo, ...restOfProps } = data;

    const terms = restOfProps.rahhalTerms.split(":");
    const rahhalTerms = {
      title: translate("verify_rahhal_now"),
      aboutRahhal: restOfProps.aboutRahhal,
      condition: `${terms[0]} :`,
      terms: terms[1].split(".")
    };

    return rahhalTerms;
  } catch (error) {
    logError(`Error: getRahhalTerms --settings.ts-- ${error}`);
  }
};

const requestRahhalBadge = async (): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.requestRahhalBadge();
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(`Error: requestRahhalBadge --settings.ts-- ${error}`);
  }
};

const requestVerificationBadge = async (): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.requestVerificationBadge();
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(`Error: requestVerificationBadge --settings.ts-- ${error}`);
  }
};

const purgeAccountRequest = async (): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.purgeAccountRequest();
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(`Error: purgeAccountRequest --settings.ts-- ${error}`);
  }
};

const deactivateAccountRequest = async (): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.deactivateAccountRequest();
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(`Error: deactivateAccountRequest --settings.ts-- ${error}`);
  }
};

const getBlockList = async (): Promise<SimpleUser[] | undefined> => {
  try {
    const { data } = await settingsAPI.getBlockList();
    const { ProcessInfo, blocked } = data;
    return blocked;
  } catch (error) {
    logError(`Error: getBlockList --settings.ts-- ${error}`);
    throw error;
  }
};

const getFavouriteList = async (
  skey?: string,
  pageSize?: number
): Promise<FavouriteListResponse | undefined> => {
  try {
    const { data } = await settingsAPI.getFavouriteList(skey, pageSize);
    const { ProcessInfo, ...restOfProps } = data;

    return {
      items: restOfProps.Items,
      count: restOfProps.Count,
      scannedCount: restOfProps.ScannedCount
    };
  } catch (error) {
    logError(
      `Error: getFavouriteList --settings.ts-- skey=${skey} pageSize=${pageSize} ${error}`
    );
    throw error;
  }
};

const createFavouriteList = async (name: string): Promise<IFavouriteList | undefined> => {
  try {
    const { data } = await settingsAPI.createFavouriteList(name);
    const { ProcessInfo, ...restOfProps } = data;

    return {
      items_count: restOfProps.items_count,
      skey: restOfProps.skey,
      pkey: restOfProps.pkey,
      name
    };
  } catch (error) {
    logError(`Error: createFavouriteList --settings.ts-- name=${name} ${error}`);
    throw error;
  }
};

const blockUserRequest = async (blocked_uuid: string): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.blockUserRequest(blocked_uuid);
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(
      `Error: blockUserRequest --settings.ts-- blocked_uuid=${blocked_uuid} ${error}`
    );
    throw error;
  }
};

const updateListName = async (
  payload: FavouriteItemHeaderDialogProps
): Promise<FavouriteItemHeaderDialogProps | undefined> => {
  try {
    const { data } = await settingsAPI.updateListName(payload);
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(`Error: updateListName --settings.ts-- ${error}`);
    throw error;
  }
};

const unblockUserRequest = async (blocked_uuid: string): Promise<any | undefined> => {
  try {
    const { data } = await settingsAPI.unblockUserRequest(blocked_uuid);
    const { ProcessInfo, ...restOfProps } = data;

    return restOfProps;
  } catch (error) {
    logError(
      `Error: unblockUserRequest --settings.ts-- blocked_uuid=${blocked_uuid} ${error}`
    );
    throw error;
  }
};

const deleteListById = async (skey: string): Promise<any> => {
  try {
    const res = await settingsAPI.deleteListById(skey);

    return { data: res.data, skey };
  } catch (error) {
    logError(`Error: deleteListById --settings.ts-- skey=${skey} ${error}`);
  }
};

const getFavouriteListItems = async (
  skey?: string,
  page?: number,
  limit?: number
): Promise<
  { items: FavouriteListItemsResponse[]; metadata: { hasNext: boolean } } | undefined
> => {
  try {
    const { data } = await settingsAPI.getFavouriteListItems(skey, page, limit);
    const { items, metadata } = data;

    return { items, metadata };
  } catch (error) {
    logError(
      `Error: getFavouriteListItems --settings.ts-- skey=${skey} page=${page} limit=${limit} ${error}`
    );
  }
};

const favoriteItem = async (
  skeys: string[],
  pkey: string
): Promise<{ skeys: string[]; pkey: string } | undefined> => {
  try {
    await settingsAPI.favoriteItem(pkey, skeys);
    return { pkey, skeys };
  } catch (error) {
    logError(
      `Error: favoriteItem --settings.ts-- skeys=${errorLogFormatter(
        skeys
      )} pkey=${pkey} ${error}`
    );
    throw error;
  }
};

const deleteListItem = async (
  skeys: string[],
  pkey: string
): Promise<{ skeys: string[]; pkey: string } | undefined> => {
  try {
    const { data } = await settingsAPI.deleteListItem(pkey, skeys);

    return { pkey, skeys, is_favorite: data.is_favorite };
  } catch (error) {
    logError(
      `Error: deleteListItem --settings.ts-- skeys=${errorLogFormatter(
        skeys
      )} pkey=${pkey} ${error}`
    );
    throw error;
  }
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
  favoriteItem
};
