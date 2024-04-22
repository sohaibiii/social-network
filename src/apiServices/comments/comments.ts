import { commentsAPI } from "~/apis/";
import { CommentsType } from "~/apiServices/comments/comments.types";
import { logError } from "~/utils/";

const getComments: (
  _type: CommentsType,
  _pkey: string,
  _ts: number,
  _index?: number,
  _limit?: number
) => Promise<any[]> = async (type = CommentsType.POST, pkey, ts, index, limit = 10) => {
  try {
    const { data } = await commentsAPI.getComments(pkey, ts, index, limit, type);

    return data;
  } catch (error) {
    logError(`Error: getComments --comments.ts-- ${error}`);
    throw error;
  }
};

const getReplies: (
  _pkey: string,
  _ts: number,
  _index?: number,
  _limit?: number
) => Promise<any[]> = async (pkey, ts, index, limit = 10) => {
  try {
    const { data } = await commentsAPI.getReplies(pkey, ts, index, limit);

    return data;
  } catch (error) {
    logError(`Error: getReplies --comments.ts-- ${error}`);
    throw error;
  }
};

const addComment: (
  _pkey: string,
  _ts: number,
  _text: string,
  type?: string
) => Promise<any[]> = async (pkey, ts, text, type) => {
  try {
    const { data } = await commentsAPI.addComment(pkey, ts, text, type);
    return data;
  } catch (error) {
    logError(`Error: addComment --comments.ts-- ${error}`);
    throw error;
  }
};

const LikeComment: (_pkey: string, _ts: number) => Promise<any[]> = async (pkey, ts) => {
  try {
    const { data } = await commentsAPI.likeComment(pkey, ts);
    return data;
  } catch (error) {
    logError(`Error: LikeComment --comments.ts-- ${error}`);
    throw error;
  }
};

const likeReply: (_pkey: string, _ts: number, _index: number) => Promise<any[]> = async (
  pkey,
  ts,
  index
) => {
  try {
    const { data } = await commentsAPI.likeReply(pkey, ts, index);
    return data;
  } catch (error) {
    logError(`Error: likeReply --comments.ts-- ${error}`);
    throw error;
  }
};

const unlikeComment: (_pkey: string, _ts: number) => Promise<any[]> = async (
  pkey,
  ts
) => {
  try {
    const { data } = await commentsAPI.unLikeComment(pkey, ts);
    return data;
  } catch (error) {
    logError(`Error: unlikeComment --comments.ts-- ${error}`);
    throw error;
  }
};

const unlikeReply: (
  _pkey: string,
  _ts: number,
  _index: number
) => Promise<any[]> = async (pkey, ts, index) => {
  try {
    const { data } = await commentsAPI.unLikeReply(pkey, ts, index);
    return data;
  } catch (error) {
    logError(`Error: unlikeReply --comments.ts-- ${error}`);
    throw error;
  }
};

const reportComment: (
  _pkey: string,
  _skey: number,
  _type: string,
  _description?: string
) => Promise<any[]> = async (pkey, skey, type, description) => {
  try {
    const { data } = await commentsAPI.reportComment(pkey, skey, type, description);
    return data;
  } catch (error) {
    logError(`Error: reportComment --comments.ts-- ${error}`);
    throw error;
  }
};

const reportReply: (
  _pkey: string,
  _skey: number,
  _type: string,
  _description?: string
) => Promise<any[]> = async (pkey, skey, type, description) => {
  try {
    const { data } = await commentsAPI.reportReply(pkey, skey, type, description);
    return data;
  } catch (error) {
    logError(`Error: reportReply --comments.ts-- ${error}`);
    throw error;
  }
};

const deleteComment: (
  _pkey: string,
  _ts: number,
  _skey: number,
  type?: string
) => Promise<any[]> = async (pkey, ts, skey, type) => {
  try {
    const { data } = await commentsAPI.deleteComment(pkey, ts, skey, type);
    return data;
  } catch (error) {
    logError(`Error: deleteComment --comments.ts-- ${error}`);
    throw error;
  }
};

const deleteReply: (
  _pkey: string,
  _ts: number,
  _skey: number,
  _post_ts: number
) => Promise<any[]> = async (pkey, ts, skey, post_ts) => {
  try {
    const { data } = await commentsAPI.deleteReply(pkey, ts, skey, post_ts);
    return data;
  } catch (error) {
    logError(`Error: deleteReply --comments.ts-- ${error}`);
    throw error;
  }
};

const updateComment: (
  _pkey: string,
  _skey: number,
  _text: string
) => Promise<any[]> = async (pkey, skey, text) => {
  try {
    const { data } = await commentsAPI.updateComment(pkey, skey, text);
    return data;
  } catch (error) {
    logError(`Error: updateComment --comments.ts-- ${error}`);
    throw error;
  }
};
const updateReply: (
  _pkey: string,
  _ts: number,
  _skey: number,
  _text: string
) => Promise<any[]> = async (pkey, ts, skey, text) => {
  try {
    const { data } = await commentsAPI.updateReply(pkey, ts, skey, text);
    return data;
  } catch (error) {
    logError(`Error: updateReply --comments.ts-- ${error}`);
    throw error;
  }
};

const addReply: (_pkey: string, _ts: number, _text: string) => Promise<any[]> = async (
  pkey,
  ts,
  text
) => {
  try {
    const { data } = await commentsAPI.addReply(pkey, ts, text);
    return data;
  } catch (error) {
    logError(`Error: addReply --comments.ts-- ${error}`);
    throw error;
  }
};

export default {
  getComments,
  addComment,
  LikeComment,
  unlikeComment,
  reportComment,
  reportReply,
  deleteComment,
  updateComment,
  addReply,
  getReplies,
  likeReply,
  unlikeReply,
  deleteReply,
  updateReply
};
