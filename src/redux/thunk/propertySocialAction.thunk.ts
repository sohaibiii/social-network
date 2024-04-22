import { createAsyncThunk } from "@reduxjs/toolkit";
import i18next from "i18next";

import { showSnackbar } from "../reducers/snackbar.reducer";

import { postService, propertyService, rateService } from "~/apiServices/index";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  addPostToTimelineHead,
  postAdded,
  postUpserted
} from "~/redux/reducers/home.reducer";
import { SLICE_NAME, GalleryShape } from "~/redux/types/propertySocialAction.types";
import {
  ADD_POST_FINISH_FAILED,
  ADD_POST_FINISH_SUCCESS,
  logEvent,
  RATE_PROPERTY_FINISH_FAILED,
  RATE_PROPERTY_FINISH_SUCCESS,
  SUGGEST_PROPERTY_FINISH_FAILED,
  SUGGEST_PROPERTY_FINISH_SUCCESS
} from "~/services/";

const SUGGEST_PROPERTY_SOURCE = "suggest_property_page";
const ADD_POST_SOURCE = "add_post_page";
const RATE_PROPERTY_SOURCE = "rate_property_source";
export const suggestPropertyThunk = createAsyncThunk(
  `${SLICE_NAME}/suggest`,
  async (lastImageId: GalleryShape | null, { dispatch, getState }) => {
    const {
      propertyImagesUploadIds,
      address,
      recaptchaToken,
      propertyDescription,
      propertyTitle,
      propertyTypes
    } = getState().propertySocialAction.suggestProperty;

    return await propertyService
      .suggestProperty(
        propertyTitle,
        address,
        propertyTypes,
        recaptchaToken,
        !lastImageId ? [] : propertyImagesUploadIds.concat([lastImageId]),
        propertyDescription
      )
      .then(async () => {
        await logEvent(SUGGEST_PROPERTY_FINISH_SUCCESS, {
          source: SUGGEST_PROPERTY_SOURCE,
          property_types_ids: propertyTypes.map(item => item.id),
          property_types_names: propertyTypes.map(item => item.title?.en),
          property_description: propertyDescription,
          property_title: propertyTitle,
          address
        });
        dispatch(
          showSnackbar({
            text: i18next.t("suggest_property_success"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      })
      .catch(async () => {
        await logEvent(SUGGEST_PROPERTY_FINISH_FAILED, {
          source: SUGGEST_PROPERTY_SOURCE,
          property_types_ids: propertyTypes.map(item => item.id),
          property_types_names: propertyTypes.map(item => item.title?.en),
          property_description: propertyDescription,
          property_title: propertyTitle,
          address
        });
        dispatch(
          showSnackbar({
            text: i18next.t("error_occurred"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      });
  }
);

export const addPostThunk = createAsyncThunk(
  `${SLICE_NAME}/post`,
  async (lastImageId: GalleryShape, { dispatch, getState }) => {
    const {
      postImagesUploadIds,
      postDetails,
      postProperties,
      postCountryRegionCityArr,
      postLocation
    } = getState().propertySocialAction.addPost;

    const newImages = !lastImageId ? [] : postImagesUploadIds.concat([lastImageId]);

    const analyticsParams = {
      source: ADD_POST_SOURCE,
      number_of_images: newImages.length,
      address: postLocation?.location?.address,
      city_country_region_title: postCountryRegionCityArr?.map(item => item?.title?.en),
      city_country_region_pkeys: postCountryRegionCityArr?.map(item => item?.pkey),
      city_country_region_slugs: postCountryRegionCityArr?.map(item => item?.slug),
      property_titles: postProperties?.map(item => item?.title?.en),
      property_slugs: postProperties?.map(item => item?.slug),
      property_pkeys: postProperties?.map(item => item?.pkey)
    };

    return await postService
      .addPost(postDetails, postProperties, newImages, postLocation)
      .then(async data => {
        const { ProcessInfo, ...restOfProps } = data;
        const newPost = {
          ...restOfProps,
          created_by: restOfProps?.created_by?.id,
          is_my_post: true,
          is_new_post: true
        };
        await logEvent(ADD_POST_FINISH_SUCCESS, {
          created_by: restOfProps?.created_by?.id,
          timestamp: restOfProps?.timestamp,
          pkey: restOfProps?.pkey,
          ...analyticsParams
        });

        dispatch(postAdded(newPost));
        dispatch(addPostToTimelineHead(newPost));
        dispatch(
          showSnackbar({
            text: i18next.t("add_post_success"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      })
      .catch(async () => {
        await logEvent(ADD_POST_FINISH_FAILED, analyticsParams);
        showSnackbar({
          text: i18next.t("error_occurred"),
          type: SnackbarVariations.SNACKBAR,
          duration: 2000,
          backgroundColor: "red"
        });
      });
  }
);

export const editPostThunk = createAsyncThunk(
  `${SLICE_NAME}/post`,
  async (lastImageId: GalleryShape, { dispatch, getState }) => {
    const {
      postImagesUploadIds,
      postDetails,
      postProperties,
      postLocation,
      postPkey,
      postTimestamp
    } = getState().propertySocialAction.addPost;

    if (!postPkey || !postTimestamp) {
      return;
    }

    const newImages =
      lastImageId && lastImageId.id
        ? postImagesUploadIds.concat([lastImageId])
        : postImagesUploadIds;
    return await postService
      .editPost(
        postPkey,
        postTimestamp,
        postDetails,
        postProperties,
        newImages.length === 0 ? null : newImages,
        postLocation
      )
      .then(res => {
        const { ProcessInfo, created_by, ...restOfPost } = res;
        dispatch(
          postUpserted({
            gallery: [],
            tags: [],
            ...restOfPost,
            created_by: created_by.id
          })
        );
        dispatch(
          showSnackbar({
            text: i18next.t("edit_post_success"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      })
      .catch(() => {
        showSnackbar({
          text: i18next.t("error_occurred"),
          type: SnackbarVariations.SNACKBAR,
          duration: 2000,
          backgroundColor: "red"
        });
      });
  }
);

export const addRateThunk = createAsyncThunk(
  `${SLICE_NAME}/rate`,
  async (lastImageId: string, { dispatch, getState }) => {
    const { rateProperty, rateReview, rateStars, rateImagesUploadIds } =
      getState().propertySocialAction.rateProperty;

    return await rateService
      .rateProperty(
        rateProperty?.pkey || "",
        rateStars,
        "property",
        rateReview,
        lastImageId ? rateImagesUploadIds.concat([lastImageId]) : rateImagesUploadIds
      )
      .then(async () => {
        await logEvent(RATE_PROPERTY_FINISH_SUCCESS, {
          source: RATE_PROPERTY_SOURCE,
          property_pkey: rateProperty?.pkey,
          rating: rateStars
        });

        dispatch(
          showSnackbar({
            text: i18next.t("rate_property_success"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      })
      .catch(async error => {
        await logEvent(RATE_PROPERTY_FINISH_FAILED, {
          source: RATE_PROPERTY_SOURCE,
          property_pkey: rateProperty?.pkey,
          rating: rateStars
        });

        dispatch(
          showSnackbar({
            text: i18next.t(
              error?.response?.data?.message === "This element already rated"
                ? "rate_property.already_reviewed"
                : "error_occurred"
            ),
            type: SnackbarVariations.SNACKBAR,
            duration: 2500,
            backgroundColor: "red"
          })
        );
      });
  }
);

export const addPropertyImageIdThunk = createAsyncThunk(
  `${SLICE_NAME}/addPropertyImageId`,
  async (propertyImageId: string, { dispatch, getState }) => {
    const { propertyImages, propertyImagesUploadIds } =
      getState().propertySocialAction.suggestProperty;
    if (propertyImages.length - 1 === propertyImagesUploadIds.length) {
      await dispatch(suggestPropertyThunk(propertyImageId));
    }
    return propertyImageId;
  }
);

export const addPostImageIdThunk = createAsyncThunk(
  `${SLICE_NAME}/addPostImageId`,
  async (payload: any, { dispatch, getState }) => {
    const { postImages, postImagesUploadIds } = getState().propertySocialAction.addPost;
    const { uploadedImageId, isEditPost = false, type } = payload || {};

    if (postImages.length - 1 === postImagesUploadIds.length) {
      if (isEditPost) {
        return await dispatch(editPostThunk({ id: uploadedImageId, type }));
      }
      await dispatch(addPostThunk({ id: uploadedImageId, type }));
    } else if (isEditPost && postImages.length === postImagesUploadIds.length) {
      return await dispatch(editPostThunk({ id: uploadedImageId, type }));
    }
    return { id: uploadedImageId, type };
  }
);

export const addRateImageIdThunk = createAsyncThunk(
  `${SLICE_NAME}/addRateImageId`,
  async (rateImageId: string, { dispatch, getState }) => {
    const { rateImages, rateImagesUploadIds } =
      getState().propertySocialAction.rateProperty;

    if (rateImages.length - 1 === rateImagesUploadIds.length) {
      await dispatch(addRateThunk(rateImageId));
    }
    return rateImageId;
  }
);
