import { translationAPI } from "~/apis/";
import { logError } from "~/utils/";

const translate = async (term: string): Promise<string> => {
  try {
    const { data } = await translationAPI.translate(term);
    const translationArray = data?.data?.translations;
    if (translationArray.length > 0) {
      return translationArray[0]?.translatedText || "";
    }
  } catch (e) {
    logError(`translation failed ${e}`);
  }
  return "";
};

export default {
  translate
};
