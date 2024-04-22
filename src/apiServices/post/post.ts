import { postAPI } from "~/apis/";
import { GalleryShape, PostClass } from "~/redux/types/propertySocialAction.types";
import { generalErrorHandler, logError } from "~/utils/";

const addPost: (
  _description?: string,
  _tags?: any[],
  _images?: GalleryShape[],
  _place?: string
) => Promise<true> = async (
  description?: string,
  tags?: any[],
  images: GalleryShape[] = [],
  place = ""
) => {
  try {
    const { data } = await postAPI.addPost(
      description,
      tags?.map(item => ({
        ...item,
        name: item.title.ar,
        type: item._index
      })),
      images,
      place
    );
    return data;
  } catch (error) {
    generalErrorHandler(`Error: addPost --post.ts-- place=${place} ${error}`);
  }
};

const editPost: (
  _pkey: string,
  _ts: number,
  _description?: string,
  _tags?: any[],
  _images?: GalleryShape[],
  _place?: string
) => Promise<true> = async (
  pkey: string,
  ts: number,
  description?: string,
  tags?: any[],
  images: GalleryShape[] = [],
  place = ""
) => {
  try {
    const tagsFormatted =
      !!tags && tags.length > 0
        ? tags?.map(item => ({
            ...item,
            name: item.title.ar,
            type: item._index ?? item.type
          }))
        : null;
    const updatedPost = {
      text: description,
      tags: tagsFormatted,
      gallery: images,
      place
    };
    const { data } = await postAPI.editPost(updatedPost, pkey, ts);

    return data;
  } catch (error) {
    logError(`Error: editPost --post.tsx-- pkey=${pkey} ts=${ts} ${error}`);
    throw error;
  }
};

const likePost: (
  _pkey?: string,
  _ts?: number,
  isSponsorship?: boolean
) => Promise<true> = async (pkey = "", ts = 0, isSponsorship) => {
  try {
    const { data } = await postAPI.likePost(
      pkey,
      ts,
      isSponsorship ? PostClass.SPONSORED : PostClass.POST
    );
    return data;
  } catch (error) {
    generalErrorHandler(`Error: likePost --post.ts-- pkey=${pkey} ts=${ts} ${error}`);
  }
};

const unlikePost: (_pkey?: string, _ts?: number) => Promise<true> = async (
  pkey = "",
  ts = 0
) => {
  try {
    const { data } = await postAPI.unlikePost(pkey, ts);
    return data;
  } catch (error) {
    generalErrorHandler(`Error: unlikePost --post.ts-- pkey=${pkey} ts=${ts} ${error}`);
  }
};

const reportPost: (
  _pkey: string,
  _ts: number,
  _type: string,
  _description?: string
) => Promise<true> = async (pkey, ts, type, description) => {
  try {
    const { data } = await postAPI.reportPost(pkey, ts, type, description);
    return data;
  } catch (error) {
    generalErrorHandler(`Error: reportPost --post.ts-- pkey=${pkey} ts=${ts} ${error}`);
  }
};

const deletePost: (_pkey: string, _ts: number) => Promise<true> = async (pkey, ts) => {
  try {
    const { data } = await postAPI.deletePost(pkey, ts);
    return data;
  } catch (error) {
    generalErrorHandler(`Error: deletePost --post.ts-- pkey=${pkey} ts=${ts} ${error}`);
  }
};

const getPost: (_pkey: string, _ts: number) => Promise<true> = async (pkey, ts) => {
  try {
    const { data } = await postAPI.getPost(pkey, ts);
    return data;
  } catch (error) {
    generalErrorHandler(`Error: getPost --post.ts-- pkey=${pkey} ts=${ts} ${error}`);
  }
};

const getLikesList: (
  _pkey: string,
  _ts: number,
  _page: number,
  _limit: number
) => Promise<true> = async (pkey, ts, page, limit) => {
  try {
    const { data } = await postAPI.getLikesList(pkey, ts, page, limit);
    const { ProcessInfo, ...restOfProps } = data || {};
    return restOfProps;
  } catch (error) {
    generalErrorHandler(
      `Error: getLikesList --post.ts-- pkey=${pkey} ts=${ts} page=${page} limit=${limit} ${error}`
    );
  }
};

export default {
  addPost,
  likePost,
  unlikePost,
  deletePost,
  reportPost,
  editPost,
  getPost,
  getLikesList
};
