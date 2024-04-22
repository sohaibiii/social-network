import { createAsyncThunk } from "@reduxjs/toolkit";

import { upsertProperties } from "../reducers/favorite.slice";
import {
  upsertNewPosts,
  updateLatestReviews,
  updateLatestPosts,
  loadNewUsers,
  upsertSponsorshipPost
} from "../reducers/home.reducer";

import axiosInstance from "~/apiServices/axiosService";
import commentsService from "~/apiServices/comments/comments";
import { CommentsType } from "~/apiServices/comments/comments.types";
import homeService from "~/apiServices/home/home";
import { SLICE_NAME } from "~/redux/types/home.types";
import { logError } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";

export const getSpecialDestinationsThunk = createAsyncThunk(
  `${SLICE_NAME}/getSpecialDestinations`,
  async () => {
    const response = await homeService.getSpecialDestinations();
    return response;
  }
);

export const getDynamicTimelineThunk = createAsyncThunk(
  `${SLICE_NAME}/getDynamicTimeline`,
  async () => {
    const response = await homeService.getDynamicTimeline();

    return response;
  }
);

export const getFreeFeedsTimelineThunk = createAsyncThunk(
  `${SLICE_NAME}/getFreeFeedsTimeline`,
  async ({ url, params }, { dispatch }) => {
    try {
      const { data } = await axiosInstance.get(url, {
        params
      });
      const { feeds } = data;

      const properties = feeds
        .map(item => item.tags && item.tags.filter(item => item?.type === "property"))
        ?.filter(item => item)
        ?.flat();

      if (properties && properties?.length) {
        const optimizedProperties = properties.reduce(normalizeByKey("pkey"), {});

        dispatch(upsertProperties(optimizedProperties));
      }

      return feeds;
    } catch (error) {
      logError(`Error: getFreeFeedsTimelineThunk --home.thunk.ts-- url=${url} ${error}`);
    }
  }
);

export const getPostComments = createAsyncThunk(
  `${SLICE_NAME}/getPostComments`,
  async ({ postPkey, timestamp, nextIndex = undefined, type = CommentsType.POST }) => {
    const response = await commentsService.getComments(
      type,
      postPkey,
      timestamp,
      nextIndex
    );

    return response;
  }
);

export const getCommentReplies = createAsyncThunk(
  `${SLICE_NAME}/getCommentReplies`,
  async ({ postPkey, postIndex, nextIndex = undefined, limit = 10 }) => {
    const response = await commentsService.getReplies(
      postPkey,
      postIndex,
      nextIndex,
      limit
    );

    return response;
  }
);

export const getHomepagePullToRefresh = createAsyncThunk(
  `${SLICE_NAME}/getHomepagePullToRefresh`,
  async (undefined, { dispatch }) => {
    const { data } = await axiosInstance.get(`/feeds/list/social?from=0&to=10`, {});
    const { data: reviewsData } = await axiosInstance.get(
      "/feeds/reviews?nextReviewIndex=0"
    );
    const { feeds } = data;
    dispatch(updateLatestPosts(feeds));
    dispatch(upsertNewPosts(feeds));

    const properties = feeds
      .map(item => item.tags && item.tags.filter(item => item?.type === "property"))
      ?.filter(item => item)
      ?.flat();

    if (properties && properties?.length) {
      const optimizedProperties = properties.reduce(normalizeByKey("pkey"), {});
      dispatch(upsertProperties(optimizedProperties));
    }
    const newUsers = reviewsData?.reviews?.map(review => {
      const { country, profile_image, profile, ...restOfProps } =
        review?.created_by ?? {};
      return {
        ...restOfProps,
        country_code: country?.id,
        country: country,
        id: restOfProps.id,
        profile_image: profile_image,
        profile: profile
      };
    });
    dispatch(loadNewUsers(newUsers));

    const reviewProperties = reviewsData?.reviews
      ?.filter(item => item?.content_type === "property")
      ?.filter(item => item)
      ?.flat()
      .map(review => {
        const {
          index,
          title,
          pkey,
          text,
          is_favorite,
          slug,
          created_by,
          content_rate,
          featured_image
        } = review;
        return {
          index,
          title,
          pkey,
          text,
          is_favorite,
          slug,
          created_by,
          rate: content_rate,
          featured_image
        };
      });

    if (reviewProperties && reviewProperties?.length) {
      const optimizedProperties = reviewProperties.reduce(normalizeByKey("pkey"), {});

      dispatch(upsertProperties(optimizedProperties));
    }

    dispatch(updateLatestReviews(reviewsData?.reviews));
    return feeds;
  }
);

export const getSponsershipPosts = createAsyncThunk(
  `${SLICE_NAME}/getSponsershipPosts`,
  async (undefined, { dispatch }) => {
    const { data } = await axiosInstance.get(`/feeds/sponsored-posts`, {});
    const { feeds } = data || {};

    dispatch(upsertSponsorshipPost(feeds));
    return feeds;
  }
);
