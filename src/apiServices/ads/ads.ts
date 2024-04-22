import { adsAPI } from "~/apis/";
import { logError } from "~/utils/";

const getAd: (
  _id: string,
  _countryName: string,
  _language: string
) => Promise<any[]> = async (id, countryName, language) => {
  try {
    const { data } = await adsAPI.getAd(id, countryName, language);
    return data;
  } catch (error) {
    logError(`Error: getAd --ad.ts-- id=${id} ${error}`);
    throw error;
  }
};

const callAdEligibleUrl: (_url: string) => void = async url => {
  try {
    await adsAPI.callAdEligibleUrl(url);
  } catch (error) {
    logError(`Error: callAdEligibleUrl --ad.ts-- url=${url} ${error}`);
    throw error;
  }
};

const callAdViewableUrl: (_url: string) => void = async url => {
  try {
    await adsAPI.callAdViewableUrl(url);
  } catch (error) {
    logError(`Error: callAdViewableUrl --ad.ts-- url=${url} ${error}`);
    throw error;
  }
};

export default {
  getAd,
  callAdEligibleUrl,
  callAdViewableUrl
};
