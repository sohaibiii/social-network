import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import { ReviewTypes } from "./review.types";
import APIConstants from "./reviewEndpoint";

const getContentReviews = (
  pkey: string,
  limit?: number,
  index?: number
): Promise<AxiosResponse> => {
  const params: Record<string, string | number> = { pkey };
  if (limit !== undefined) params.limit = limit;
  if (index !== undefined) params.index = index;
  return axiosInstance.get(`${APIConstants.REVIEW}`, { params });
};

const getContentReviewsWithTS = (
  pkey: string,
  limit?: number,
  ts?: number
): Promise<AxiosResponse> => {
  const params: Record<string, string | number> = { pkey };
  if (limit !== undefined) params.limit = limit;
  if (ts !== undefined) params.index = ts;
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
      params: { pkey, type: type || ReviewTypes.PROPERTY }
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
      params: { pkey, skey, type: type || ReviewTypes.PROPERTY }
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
