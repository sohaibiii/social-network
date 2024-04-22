import APIConstants from "./commentsEndpoints";

import axiosInstance from "~/apiServices/axiosService";
import { CommentsType } from "~/apiServices/comments/comments.types";

const getComments = (
  pkey: string,
  ts: number,
  index?: number,
  limit = 10,
  type = CommentsType.POST
) => {
  const body: Record<string, any> = {
    index,
    pkey,
    ts,
    limit,
    type
  };
  if (index) body.index = index;

  return axiosInstance.get(`${APIConstants.COMMENT}`, {
    params: { ...body }
  });
};

const getReplies = (pkey: string, ts: number, index?: number, limit = 10) => {
  const body: Record<string, any> = {
    index,
    pkey: `${pkey}_${ts}`,
    limit
  };
  if (index) body.index = index;

  return axiosInstance.get(`${APIConstants.REPLY}`, {
    params: { ...body }
  });
};

const addComment = (pkey: string, ts?: number, text: string, type?: string) => {
  return axiosInstance.post(
    `${APIConstants.COMMENT}`,
    { text },
    {
      params: { pkey, ts, type: type || CommentsType.POST }
    }
  );
};

const addReply = (pkey: string, index: number, text: string) => {
  return axiosInstance.post(
    `${APIConstants.REPLY}`,
    { text },
    {
      params: { pkey, index }
    }
  );
};

const updateComment = (pkey: string, skey: number, text: string) => {
  return axiosInstance.put(
    `${APIConstants.COMMENT}`,
    { text },
    {
      params: { pkey, skey, type: CommentsType.POST }
    }
  );
};

const updateReply = (pkey: string, ts: number, skey: number, text: string) => {
  return axiosInstance.put(
    `${APIConstants.REPLY}`,
    { text },
    {
      params: { pkey: `${pkey}_${ts}`, skey }
    }
  );
};

const likeComment = (pkey: string, index: number) => {
  return axiosInstance.post(
    `${APIConstants.LIKE}`,
    {},
    {
      params: { pkey, index }
    }
  );
};
const unLikeComment = (pkey: string, index: number) => {
  return axiosInstance.post(
    `${APIConstants.UNLIKE}`,
    {},
    {
      params: { pkey, index }
    }
  );
};

const likeReply = (pkey: string, ts: number, index: number) => {
  return axiosInstance.post(
    `${APIConstants.LIKE_REPLY}`,
    {},
    {
      params: { pkey: `${pkey}_${ts}`, index }
    }
  );
};

const unLikeReply = (pkey: string, ts: number, index: number) => {
  return axiosInstance.post(
    `${APIConstants.UNLIKE_REPLY}`,
    {},
    {
      params: { pkey: `${pkey}_${ts}`, index }
    }
  );
};

const deleteComment = (
  pkey: string,
  ts: number,
  skey: number,
  type?: string = CommentsType.POST
) => {
  return axiosInstance.delete(`${APIConstants.COMMENT}`, {
    params: {
      pkey,
      ts,
      skey,
      type
    }
  });
};

const deleteReply = (pkey: string, ts: number, skey: number, post_ts: number) => {
  return axiosInstance.delete(`${APIConstants.REPLY}`, {
    params: {
      pkey: `${pkey}_${ts}`,
      skey,
      post_ts
    }
  });
};

const getSingleArticleComment = (pkey: string, skey: number) => {
  return axiosInstance.get(`${APIConstants.GET_COMMENT}`, {
    params: { pkey, skey }
  });
};

const reportComment = (
  pkey: string,
  skey: number,
  type: string,
  description?: string
) => {
  const body: Record<string, any> = { type, social: { pkey, skey } };
  if (description !== "") body.description = description;
  return axiosInstance.post(`${APIConstants.REPORT}`, body);
};

const reportReply = (pkey: string, skey: number, type: string, description?: string) => {
  const body: Record<string, any> = { type, social: { pkey, skey } };
  if (description !== "") body.description = description;
  return axiosInstance.post(`${APIConstants.REPORT_REPLY}`, body);
};

export default {
  getComments,
  getReplies,
  addComment,
  addReply,
  updateComment,
  updateReply,
  likeComment,
  unLikeComment,
  likeReply,
  unLikeReply,
  deleteComment,
  deleteReply,
  getSingleArticleComment,
  reportComment,
  reportReply
};
