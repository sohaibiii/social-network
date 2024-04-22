import { rateAPI } from "~/apis/";

const rateProperty: (
  _pkey: string,
  _rating: number,
  _type: string,
  _description: string,
  _gallery?: { id: string }[]
) => Promise<true> = async (
  pkey: string,
  rating: number,
  type = "property",
  description: string,
  gallery?: { id: string }[]
) => {
  try {
    const { data } = await rateAPI.rateProperty(
      pkey,
      rating,
      type,
      description,
      gallery.map(item => ({
        id: item
      }))
    );
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  rateProperty
};
