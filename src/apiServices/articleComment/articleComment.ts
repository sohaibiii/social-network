import { Review } from "./articleComment.types";

import { articleCommentAPI } from "~/apis/";
import { generalErrorHandler, logError } from "~/utils/";

const getContentReviews = async (
  pkey: string,
  type?: string,
  limit?: number,
  index?: number
): Promise<Review[] | undefined> => {
  try {
    const { data } = await articleCommentAPI.getContentReviews(pkey, type, limit, index);
    return data;
  } catch (error) {
    logError(`Error: in getContentReviews --articleComments.ts-- ${error}`);
  }
};

const getContentReviewsWithTS = async (
  pkey: string,
  type?: string,
  limit?: number,
  ts?: number
): Promise<Review[] | undefined> => {
  try {
    const { data } = await articleCommentAPI.getContentReviewsWithTS(
      pkey,
      type,
      limit,
      ts
    );
    return data;
  } catch (error) {
    logError(`Error: in getContentReviewsWithTS --articleComments.ts ${error}`);
  }
};

const updateReview: (
  _pkey: string,
  _skey: number,
  _text: string,
  _rate: number,
  _gallery: { id: string }[]
) => Promise<true> = async (
  pkey: string,
  skey: number,
  text: string,
  rate: number,
  gallery: { id: string }[]
) => {
  try {
    const { data } = await articleCommentAPI.updateReview(
      pkey,
      skey,
      text,
      rate,
      gallery
    );
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: updateReview --articleComment.ts-- pkey=${pkey} skey=${skey} ${error}`
    );
  }
};

const reportReview: (
  _pkey: string,
  _skey: number,
  _type: string,
  _description?: string
) => Promise<true> = async (pkey, skey, type, description) => {
  try {
    const { data } = await articleCommentAPI.reportReview(pkey, skey, type, description);
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: reportReview --articleComment.ts-- pkey=${pkey} skey=${skey} ${error}`
    );
  }
};

const deleteReview: (_pkey: string, _skey: number) => Promise<true> = async (
  pkey,
  skey
) => {
  try {
    const { data } = await articleCommentAPI.deleteReview(pkey, skey);
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: deleteReview --articleComment.ts-- pkey=${pkey} skey=${skey} ${error}`
    );
  }
};

export default {
  getContentReviews,
  getContentReviewsWithTS,
  reportReview,
  deleteReview,
  updateReview
};
