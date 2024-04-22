import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./destinationsEndpoints";

const getDestinationsPerContinent = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.DESTINATIONS_PER_CONTINENT}`);
};

export default {
  getDestinationsPerContinent
};
