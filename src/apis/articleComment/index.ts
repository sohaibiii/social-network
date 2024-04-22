import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import { ArticleCommentTypes } from "./articleComment.types";
import APIConstants from "./articleCommentEndpoint";

const getContentReviews = (
  pkey: string,
  type?: string,
  limit?: number,
  index?: number
): Promise<AxiosResponse> => {
  const params: Record<string, string | number> = { pkey };
  if (type) {
    params.type = type;
  }
  if (limit) {
    params.limit = limit;
  }
  if (index) {
    params.index = index;
  }
  return axiosInstance.get(`${APIConstants.REVIEW}`, { params });
};

const getContentReviewsWithTS = (
  pkey: string,
  type?: string,
  limit?: number,
  ts?: number
): Promise<AxiosResponse> => {
  const params: Record<string, string | number> = { pkey };
  if (type) {
    params.type = type;
  }
  if (limit) {
    params.limit = limit;
  }
  if (ts) {
    params.index = ts;
  }
  return axiosInstance.get(`${APIConstants.REVIEW}`, { params });
};

const addReview = ({
  pkey,
  text,
  type,
  rate,
  gallery
}: {
  pkey: string;
  text: string;
  type?: string;
  rate: string;
  gallery?: { id: string }[];
}) => {
  return axiosInstance.post(
    `${APIConstants.REVIEW}`,
    { text, rate, gallery },
    {
      params: { pkey, type: type || ArticleCommentTypes.PROPERTY }
    }
  );
};

const updateReview = (
  pkey: string,
  skey: number,
  text: string,
  rate: number,
  gallery?: { id: string }[],
  type?: string
) => {
  return axiosInstance.put(
    `${APIConstants.REVIEW}`,
    { text, rate, gallery },
    {
      params: { pkey, skey, type: type || ArticleCommentTypes.PROPERTY }
    }
  );
};

const likeReview = async (pkey: string, index: number): Promise<AxiosResponse> => {
  return axiosInstance.post(
    `${APIConstants.LIKE}`,
    {},
    {
      params: {
        pkey,
        index
      }
    }
  );
};

const unlikeReview = async (pkey: string, index: number): Promise<AxiosResponse> => {
  return axiosInstance.post(
    `${APIConstants.UNLIKE}`,
    {},
    {
      params: {
        pkey,
        index
      }
    }
  );
};

const deleteReview = async (pkey: string, skey: number) => {
  return axiosInstance.delete(`${APIConstants.REVIEW}`, {
    params: {
      pkey,
      skey,
      type: "property"
    }
  });
};

const reportReview = async (
  pkey: string,
  skey: number,
  type: string,
  description?: string
) => {
  return axiosInstance.post(`${APIConstants.REPORT}`, {
    type,
    description,
    social: {
      pkey,
      skey
    }
  });
};

export default {
  getContentReviews,
  getContentReviewsWithTS,
  deleteReview,
  updateReview,
  reportReview,
  addReview,
  likeReview,
  unlikeReview
};
