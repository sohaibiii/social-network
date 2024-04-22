import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./rateEndpoint";

const rateProperty = (
  pkey: string,
  rate: number,
  type = "property",
  text?: string,
  gallery?: { id: string }[]
): Promise<AxiosResponse> => {
  return axiosInstance.post(
    `${APIConstants.RATE}`,
    {
      text,
      rate,
      gallery
    },
    {
      params: {
        pkey,
        type
      }
    }
  );
};

export default {
  rateProperty
};
