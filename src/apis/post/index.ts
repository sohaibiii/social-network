import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./postEndpoint";

import { PostClass } from "~/redux/types/propertySocialAction.types";

const addPost = (
  description?: string,
  tags?: any[],
  images?: { id: string }[],
  place?: string
): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.ADD_POST}`, {
    text: description,
    gallery: images,
    tags: tags,
    place
  });
};

const editPost = (updatedPost: any, pkey: string, ts: number): Promise<AxiosResponse> => {
  return axiosInstance.put(`${APIConstants.ADD_POST}`, updatedPost, {
    params: {
      pkey,
      ts
    }
  });
};

const likePost = async (
  pkey: string,
  ts: number,
  type: PostClass
): Promise<AxiosResponse> => {
  return axiosInstance.post(
    `${APIConstants.LIKE}`,
    {},
    {
      params: {
        pkey,
        ts,
        type
      }
    }
  );
};

const unlikePost = async (pkey: string, ts: number): Promise<AxiosResponse> => {
  return axiosInstance.post(
    `${APIConstants.UNLIKE}`,
    {},
    {
      params: {
        pkey,
        ts
      }
    }
  );
};

const reportPost = async (
  pkey: string,
  ts: number,
  type: string,
  description?: string
) => {
  return axiosInstance.post(`${APIConstants.REPORT}`, {
    type,
    description,
    social: {
      pkey,
      ts
    }
  });
};

const deletePost = async (pkey: string, ts: number) => {
  return axiosInstance.delete(`${APIConstants.DELETE_POST}`, {
    params: {
      pkey,
      ts
    }
  });
};

const getPost = (pkey: string, ts: number) => {
  return axiosInstance.get(`${APIConstants.POST}`, {
    params: {
      pkey,
      ts
    }
  });
};

const getLikesList = (pkey: string, ts: number, page: number, limit: number) => {
  return axiosInstance.get(`${APIConstants.LIKES_LIST}`, {
    params: {
      pkey,
      ts,
      page,
      limit
    }
  });
};

export default {
  likePost,
  unlikePost,
  deletePost,
  reportPost,
  addPost,
  editPost,
  getPost,
  getLikesList
};
