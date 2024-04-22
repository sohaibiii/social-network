import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "react-native-image-picker";
import { LatLng } from "react-native-maps";

import {
  CountryRegionCityType,
  PropertyResponseType,
  PropertyType
} from "~/apiServices/property/property.types";
import { GoogleLocation } from "~/components/addPost/postDetailsInput/PostDetailsInput.types";
import {
  addPostImageIdThunk,
  addPostThunk,
  addPropertyImageIdThunk,
  addRateImageIdThunk,
  addRateThunk,
  suggestPropertyThunk
} from "~/redux/thunk/propertySocialAction.thunk";
import {
  PropertySocialActionInterface,
  SLICE_NAME
} from "~/redux/types/propertySocialAction.types";

const INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE: PropertySocialActionInterface = {
  suggestProperty: {
    propertyTypes: [],
    marker: { longitude: 0, latitude: 0 },
    address: "",
    propertyTitle: "",
    propertyDescription: "",
    propertyImages: [],
    propertyImagesUploadIds: [],
    recaptchaToken: "",
    isSubmitting: false
  },
  addPost: {
    postLocation: {},
    postDetails: "",
    postImages: [],
    postImagesUploadIds: [],
    postCountryRegionCity: null,
    postCountryRegionCityArr: [],
    postCountryRegionCitySearch: "",
    postPropertySearch: "",
    postProperties: [],
    isEditPost: false,
    postPkey: undefined,
    postTimestamp: undefined,
    isSubmitting: false
  },
  rateProperty: {
    rateCountryRegionCity: null,
    rateCountryRegionCitySearch: "",
    rateProperty: null,
    ratePropertySearch: "",
    rateStars: 0,
    rateReview: "",
    rateImages: [],
    rateImagesUploadIds: [],
    rateCountryRegionCityArr: [],
    isSubmitting: false
  }
};

export const propertySocialActionSlice = createSlice({
  name: SLICE_NAME,
  initialState: INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE,
  reducers: {
    addPropertyType: (state, action: PayloadAction<PropertyType>) => {
      state.suggestProperty.propertyTypes.push(action.payload);
    },
    removePropertyType: (state, action: PayloadAction<PropertyType>) => {
      state.suggestProperty.propertyTypes = state.suggestProperty.propertyTypes.filter(
        item => item.id !== action.payload.id
      );
    },
    setPropertyMarker: (state, action: PayloadAction<LatLng>) => {
      state.suggestProperty.marker = action.payload;
    },
    setPropertyAddress: (state, action: PayloadAction<string>) => {
      state.suggestProperty.address = action.payload;
    },
    setPropertyTitle: (state, action: PayloadAction<string>) => {
      state.suggestProperty.propertyTitle = action.payload;
    },
    setPropertyDescription: (state, action: PayloadAction<string>) => {
      state.suggestProperty.propertyDescription = action.payload;
    },
    addPropertyImages: (state, action: PayloadAction<Asset[]>) => {
      state.suggestProperty.propertyImages = state.suggestProperty.propertyImages.concat(
        action.payload
      );
    },
    removePropertyImage: (state, action: PayloadAction<Asset>) => {
      state.suggestProperty.propertyImages = state.suggestProperty.propertyImages.filter(
        item => item.fileName !== action.payload.fileName
      );
    },
    setSuggestPropertyRecaptchaToken: (state, action: PayloadAction<string>) => {
      state.suggestProperty.recaptchaToken = action.payload;
    },
    clearSuggestPropertyData: state => {
      state.suggestProperty = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.suggestProperty;
    },
    //add post
    addPostImages: (state, action: PayloadAction<Asset[]>) => {
      state.addPost.postImages = state.addPost.postImages.concat(action.payload);
    },
    removePostImage: (state, action: PayloadAction<Asset>) => {
      state.addPost.postImages = state.addPost.postImages.filter(item =>
        item.alreadyUploaded
          ? item.uuid !== action.payload.uuid
          : item.fileName !== action.payload.fileName
      );
    },
    setPostDetails: (state, action: PayloadAction<string>) => {
      state.addPost.postDetails = action.payload;
    },
    setPostCountryRegionCity: (state, action: PayloadAction<CountryRegionCityType>) => {
      state.addPost.postCountryRegionCity = action.payload;
      state.addPost.postCountryRegionCityArr?.push(action.payload);
    },
    removePostCountryRegionCity: (
      state,
      action: PayloadAction<CountryRegionCityType>
    ) => {
      state.addPost.postCountryRegionCity = null;
      state.addPost.postProperties.splice(
        state.addPost.postProperties.findIndex(el => el.slug === action.payload.slug),
        1
      );
      state.addPost.postCountryRegionCityArr.splice(
        state.addPost.postCountryRegionCityArr.findIndex(
          el => el.slug === action.payload.slug
        ),
        1
      );
    },
    setPostCountryRegionCitySearch: (state, action: PayloadAction<string>) => {
      state.addPost.postCountryRegionCitySearch = action.payload;
    },
    setPostPropertySearch: (state, action: PayloadAction<string>) => {
      state.addPost.postPropertySearch = action.payload;
    },
    addPostProperty: (state, action: PayloadAction<PropertyResponseType>) => {
      state.addPost.postProperties = state.addPost.postProperties.concat(action.payload);
    },
    removePostProperty: (state, action: PayloadAction<string>) => {
      state.addPost.postProperties = state.addPost.postProperties.filter(
        item => item.pkey !== action.payload
      );
    },
    setPostLocation: (state, action: PayloadAction<GoogleLocation>) => {
      state.addPost.postLocation = action.payload;
    },
    addPostImageId: (state, action: PayloadAction<string>) => {
      state.addPost.postImagesUploadIds.push(action.payload);
    },
    editPost: (state, action: PayloadAction<any>) => {
      state.addPost = action.payload;
    },
    clearPostData: state => {
      state.addPost = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.addPost;
    },
    //rate property
    setRateCountryRegionCity: (state, action: PayloadAction<CountryRegionCityType>) => {
      state.rateProperty.rateCountryRegionCity = action.payload;
      state.rateProperty.rateCountryRegionCityArr?.push(action.payload);
    },
    removeRateCountryRegionCity: (
      state,
      action: PayloadAction<CountryRegionCityType>
    ) => {
      state.rateProperty.rateCountryRegionCity = null;
      state.rateProperty.rateCountryRegionCityArr.splice(
        state.rateProperty.rateCountryRegionCityArr.findIndex(
          el => el.slug === action.payload.slug
        ),
        1
      );
    },
    setRateCountryRegionCitySearch: (state, action: PayloadAction<string>) => {
      state.rateProperty.rateCountryRegionCitySearch = action.payload;
    },
    setRateProperty: (state, action: PayloadAction<PropertyResponseType>) => {
      state.rateProperty.rateProperty = action.payload;
    },
    removeRateProperty: state => {
      state.rateProperty.rateProperty = null;
    },
    setRatePropertySearch: (state, action: PayloadAction<string>) => {
      state.rateProperty.ratePropertySearch = action.payload;
    },
    setRateStars: (state, action: PayloadAction<number>) => {
      state.rateProperty.rateStars = action.payload;
    },
    setRateReview: (state, action: PayloadAction<string>) => {
      state.rateProperty.rateReview = action.payload;
    },
    addRateImages: (state, action: PayloadAction<Asset[]>) => {
      state.rateProperty.rateImages = state.rateProperty.rateImages.concat(
        action.payload
      );
    },
    removeRateImage: (state, action: PayloadAction<Asset>) => {
      state.rateProperty.rateImages = state.rateProperty.rateImages.filter(
        item => item.fileName !== action.payload.fileName
      );
    },
    clearRatePropertyData: state => {
      state.rateProperty = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.rateProperty;
    },
    setIsSubmittingPost: state => {
      state.addPost.isSubmitting = true;
    },
    setIsSubmittingReview: state => {
      state.rateProperty.isSubmitting = true;
    },
    setIsSubmittingSuggest: state => {
      state.suggestProperty.isSubmitting = true;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(suggestPropertyThunk.fulfilled, state => {
        state.suggestProperty = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.suggestProperty;
      })
      .addCase(addPropertyImageIdThunk.fulfilled, (state, { payload }) => {
        if (state.suggestProperty.propertyImages.length > 0) {
          state.suggestProperty.propertyImagesUploadIds.push(payload);
        }
      });
    builder
      .addCase(addPostThunk.fulfilled, state => {
        state.addPost = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.addPost;
      })
      .addCase(addPostImageIdThunk.fulfilled, (state, action) => {
        if (state.addPost.postImages.length > 0) {
          state.addPost.postImagesUploadIds.push({
            id: action.meta.arg.uploadedImageId,
            type: action.meta.arg.type
          });
        }
      });
    builder
      .addCase(addRateThunk.fulfilled, state => {
        state.rateProperty = INITIAL_PROPERTY_SOCIAL_ACTIONS_STATE.rateProperty;
      })
      .addCase(addRateImageIdThunk.fulfilled, (state, { payload }) => {
        if (state.rateProperty.rateImages.length > 0) {
          state.rateProperty.rateImagesUploadIds.push(payload);
        }
      });
  }
});

export const {
  addPropertyType,
  removePropertyType,
  setPropertyMarker,
  setPropertyAddress,
  setPropertyTitle,
  setPropertyDescription,
  addPropertyImages,
  clearSuggestPropertyData,
  removePropertyImage,
  addPostImages,
  removePostImage,
  setPostDetails,
  setPostLocation,
  setSuggestPropertyRecaptchaToken,
  setPostCountryRegionCity,
  removePostCountryRegionCity,
  setPostCountryRegionCitySearch,
  setPostPropertySearch,
  addPostProperty,
  removePostProperty,
  editPost,
  clearPostData,
  setRateCountryRegionCity,
  removeRateCountryRegionCity,
  setRateCountryRegionCitySearch,
  setRateProperty,
  removeRateProperty,
  setRatePropertySearch,
  setRateStars,
  setRateReview,
  addRateImages,
  removeRateImage,
  clearRatePropertyData,
  addPostImageId,
  setIsSubmittingPost,
  setIsSubmittingReview,
  setIsSubmittingSuggest
} = propertySocialActionSlice.actions;

export default propertySocialActionSlice.reducer;
