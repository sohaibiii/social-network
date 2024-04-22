import AsyncStorage from "@react-native-async-storage/async-storage";

import { logError } from "~/utils/errorHandler";

export const storeItem = async (
  key: string,
  item: string | JSON | boolean
): Promise<void> => {
  try {
    if (typeof item !== "string") {
      item = JSON.stringify(item);
    }
    await AsyncStorage.setItem(key, item);
  } catch (error) {
    logError(
      `Error: storeItem --asyncStorage.ts-- key=${key} item=${JSON.stringify(
        item
      )} ${error}`
    );
  }
  return;
};

export const retrieveItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    logError(`Error: AsyncStorage retrieveItem key=${key} ${error}`);
  }
  return null;
};
export const deleteItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logError(`Error: deleteItem --asyncStorage.ts-- key=${key} ${error}`);
  }
  return;
};

export const getAllKeys = async (): Promise<string[] | undefined> => {
  let keys: string[] = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    logError(`Error: getAllKeys --asyncStorage.ts-- ${error}`);
  }
  return;
};

export const getMultiple = async (
  keys: string[]
): Promise<[string, string | null][] | undefined> => {
  let values;
  try {
    values = await AsyncStorage.multiGet(keys);
    return values;
  } catch (error) {
    logError(
      `Error: getMultiple --asyncStorage.ts-- keys=${JSON.stringify(keys)} ${error}`
    );
  }
  return;
};

//   const firstPair = ["@MyApp_user", "value_1"]
//   const secondPair = ["@MyApp_key", "value_2"]
export const multiSet = async (
  keyValuePairs: Array<Array<string>>
): Promise<void | undefined> => {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    logError(
      `Error: multiSet --asyncStorage.ts-- keyValuePairs=${JSON.stringify(
        keyValuePairs
      )} ${error}`
    );
  }
  return;
};

export const removeFew = async (keys: string[]): Promise<void | undefined> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    logError(
      `Error: removeFew --asyncStorage.ts-- keys=${JSON.stringify(keys)} ${error}`
    );
  }

  return;
};

export const clearAll = async (): Promise<void | undefined> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logError(`Error: clearAll --asyncStorage.ts-- ${error}`);
  }

  return;
};
