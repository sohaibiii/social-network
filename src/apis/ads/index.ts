import axios from "axios";
import Config from "react-native-config";

import APIConstants from "./adsEndpoint";

const getAd = (id: string, countryName: string, language: string) => {
  return axios.get(
    `${Config.ADS_HOST}${APIConstants.GET_AD(
      Config.AD_BUTLER_ID,
      id,
      countryName,
      language
    )}`,
    {
      headers: { "content-type": "application/json", "accept-language": "en" },
      timeout: 15000
    }
  );
};

const callAdEligibleUrl = (url: string) => {
  return axios.get(url);
};

const callAdViewableUrl = (url: string) => {
  return axios.get(url);
};

export default {
  getAd,
  callAdEligibleUrl,
  callAdViewableUrl
};
