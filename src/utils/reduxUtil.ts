import { unwrapResult } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import store from "~/redux/store";

export const thunkDispatch = <T>(thunkAPI: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    store
      .dispatch(thunkAPI)
      .then(unwrapResult)
      .then((result: T) => {
        return resolve(result);
      })
      .catch((error: AxiosError) => {
        return reject(error);
      });
  });
};

export const normalizeByKey = (key: string) => {
  return (data: any, item: any) => {
    data[item[key]] = item;
    return data;
  };
};
