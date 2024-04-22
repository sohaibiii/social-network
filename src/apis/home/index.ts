import { AxiosResponse } from "axios";

import axiosInstance from "../../apiServices/axiosService";

import APIConstants from "./homeEndpoints";

const getInfluencers = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.INFLUENCERS}`);
};

const userFollowRequest = (uuid: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.USER_FOLLOW}`, {
    followedUser: uuid
  });
};

const userUnfollowRequest = (uuid: string): Promise<AxiosResponse> => {
  return axiosInstance.post(`${APIConstants.USER_UNFOLLOW}`, {
    unfollowedUser: uuid
  });
};

const getSpecialDestinations = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.SPECIAL_DESTINATIONS}`);
};

const getPuzzle = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.PUZZLE}`);
};

const puzzleResultRequest = async (
  pkey: string,
  correctAnswer: number
): Promise<AxiosResponse> => {
  return axiosInstance.post(APIConstants.PUZZLE_RESULT, {
    pkey,
    correct_answers: correctAnswer
  });
};

const getDynamicTimeline = (): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.TIMELINE}?source=app`);
};

const getReviews = (
  pkey: string,
  index?: number,
  limit: string
): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.REVIEW}`, {
    params: {
      pkey,
      index,
      limit
    }
  });
};

const getHashtag = (hashtag: string, nextSocialIndex: number): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.LIST}`, {
    params: {
      hashtag,
      nextSocialIndex
    }
  });
};

const getMyPosts = (nextSocialIndex: number): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.MY_POSTS}`, {
    params: {
      nextSocialIndex
    }
  });
};

const getUserPosts = (user: string, nextSocialIndex: number): Promise<AxiosResponse> => {
  return axiosInstance.get(`${APIConstants.LIST}`, {
    params: {
      user,
      nextSocialIndex
    }
  });
};

export default {
  getInfluencers,
  userFollowRequest,
  userUnfollowRequest,
  getSpecialDestinations,
  getPuzzle,
  puzzleResultRequest,
  getDynamicTimeline,
  getReviews,
  getHashtag,
  getMyPosts,
  getUserPosts
};
