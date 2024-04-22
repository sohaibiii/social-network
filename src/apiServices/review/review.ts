import { Review } from "./review.types";

import { reviewAPI } from "~/apis/";
import { generalErrorHandler, logError } from "~/utils/";

const getContentReviews = async (
  pkey: string,
  limit?: number,
  index?: number
): Promise<Review[] | undefined> => {
  try {
    const { data } = await reviewAPI.getContentReviews(pkey, limit, index);
    return data;
  } catch (error) {
    logError(`Error: GetContentReviews --reviews.ts-- pkey=${pkey} ${error}`);
    throw error;
  }
};

const getContentReviewsWithTS = async (
  pkey: string,
  limit?: number,
  ts?: number
): Promise<Review[] | undefined> => {
  try {
    const { data } = await reviewAPI.getContentReviewsWithTS(pkey, limit, ts);
    return data;
  } catch (error) {
    logError(`Error: GetContentReviewsWithTS --reviews.ts-- pkey=${pkey} ${error}`);
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
    const { data } = await reviewAPI.updateReview(pkey, skey, text, rate, gallery);
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: UpdateReview --reviews.ts-- pkey=${pkey} skey=${skey} ${error}`
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
    const { data } = await reviewAPI.reportReview(pkey, skey, type, description);
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: ReportReview --reviews.ts-- pkey=${pkey} skey=${skey} type=${type} ${error}`
    );
  }
};

const deleteReview: (_pkey: string, _skey: number) => Promise<true> = async (
  pkey,
  skey
) => {
  try {
    const { data } = await reviewAPI.deleteReview(pkey, skey);
    return data;
  } catch (error) {
    generalErrorHandler(
      `Error: DeleteReview --reviews.ts-- pkey=${pkey} skey=${skey} ${error}`
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
