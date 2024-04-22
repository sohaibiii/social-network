import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { CompletedData } from "react-native-background-upload";
import { Asset } from "react-native-image-picker";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~/redux/store";

import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";
import { ImagePicker } from "~/components/";
import { PostDetailsInput, SelectCountry, SelectProperty } from "~/components/addPost";
import PagerViewSteps from "~/containers/pagerViewSteps";
import suggestPropertyStyle from "~/containers/suggestProperty/SuggestProperty.style";
import {
  addPostImages,
  removePostImage,
  setPostCountryRegionCitySearch,
  setPostPropertySearch,
  setPostCountryRegionCity,
  removePostCountryRegionCity,
  addPostProperty,
  removePostProperty,
  clearPostData,
  addPostImageId,
  setIsSubmittingPost
} from "~/redux/reducers/propertySocialAction.reducer";
import {
  addPostImageIdThunk,
  addPostThunk
} from "~/redux/thunk/propertySocialAction.thunk";
import {
  ADD_POST_FINISH,
  ADD_POST_EXIT_PAGE,
  ADD_POST_NEXT,
  ADD_POST_PREVIOUS,
  ADD_POST_SEARCH_COUNTRY,
  ADD_POST_SEARCH_COUNTRY_FAILED,
  ADD_POST_SEARCH_COUNTRY_SUCCESS,
  ADD_POST_SEARCH_PROPERTY,
  ADD_POST_SEARCH_PROPERTY_FAILED,
  ADD_POST_SEARCH_PROPERTY_SUCCESS,
  backgroundImageUpload,
  logEvent
} from "~/services/";
import { generalErrorHandler, logError, verticalScale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";

const MAX_IMAGES_LENGTH = 100;

const ANALYTICS_SOURCE = "add_post_page";
const AddPostScreen = (): JSX.Element => {
  const { colors } = useTheme();
  const { viewPagerContainerStyle } = suggestPropertyStyle(colors);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  const postDetails = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.postDetails
  );

  const postCountryRegionCity = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.addPost.postCountryRegionCity
  );

  const postCountryRegionCityArr = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.addPost.postCountryRegionCityArr
  );

  const postProperties = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.postProperties
  );

  const postLocation = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.postLocation
  );

  const postCountryRegionCitySearch = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.addPost.postCountryRegionCitySearch
  );

  const postPropertySearch = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.postPropertySearch
  );

  const postImages = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.postImages
  );

  const isEditPost = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.addPost.isEditPost || false
  );

  const titles = [
    t("add_post.add_location_and_description"),
    t("add_post.select_post_country_or_city"),
    t("add_post.select_properties"),
    t("add_post.add_post_images")
  ];

  const headerExpandedHeights = [
    verticalScale(200),
    verticalScale(220),
    verticalScale(150),
    verticalScale(250)
  ];

  const analyticsProps = {
    source: ANALYTICS_SOURCE,
    city_country_region_title: postCountryRegionCityArr?.map(item => item?.title?.en),
    city_country_region_pkeys: postCountryRegionCityArr?.map(item => item?.pkey),
    city_country_region_slugs: postCountryRegionCityArr?.map(item => item?.slug),
    property_titles: postProperties?.map(item => item?.title?.en),
    property_slugs: postProperties?.map(item => item?.slug),
    property_pkeys: postProperties?.map(item => item?.pkey),
    number_of_images: postImages.length,
    post_address: postLocation?.address
  };

  const handleImagesAdded = (images: Asset[]) => {
    dispatch(addPostImages(images));
  };

  const handleCountryRegionCitySearched = (term: string) => {
    dispatch(setPostCountryRegionCitySearch(term));
    return logEvent(ADD_POST_SEARCH_COUNTRY, {
      ...analyticsProps,
      term
    });
  };

  const handleCountryRegionCitySearchSuccess = (term: string) => {
    return logEvent(ADD_POST_SEARCH_COUNTRY_SUCCESS, {
      ...analyticsProps,
      term
    });
  };

  const handleCountryRegionCitySearchFailed = (term: string) => {
    return logEvent(ADD_POST_SEARCH_COUNTRY_FAILED, {
      ...analyticsProps,
      term
    });
  };

  const handleImageRemove = (image: Asset) => {
    dispatch(removePostImage(image));
  };

  const handlePropertyRemoved = (property: PropertyResponseType) => {
    dispatch(removePostProperty(property?.pkey || ""));
  };
  const handlePropertyAdded = (property: PropertyResponseType) => {
    dispatch(addPostProperty(property));
  };
  const handlePropertySearched = (term: string) => {
    dispatch(setPostPropertySearch(term));
    return logEvent(ADD_POST_SEARCH_PROPERTY, {
      ...analyticsProps,
      term
    });
  };
  const handlePropertySearchSuccess = (term: string) => {
    return logEvent(ADD_POST_SEARCH_PROPERTY_SUCCESS, {
      ...analyticsProps,
      term
    });
  };
  const handlePropertySearchFailed = (term: string) => {
    return logEvent(ADD_POST_SEARCH_PROPERTY_FAILED, {
      ...analyticsProps,
      term
    });
  };
  const handleCountryRegionCitySelected = (item: CountryRegionCityType) => {
    dispatch(setPostCountryRegionCity(item));
  };
  const handleCountryRegionCityRemoved = (item: CountryRegionCityType) => {
    dispatch(removePostCountryRegionCity(item));
  };

  const pages = [
    <PostDetailsInput setIsNextDisabled={setIsNextDisabled} key={1} />,
    <SelectCountry
      countryRegionCityArr={postCountryRegionCityArr}
      onCountryRegionCitySelectedCb={handleCountryRegionCitySelected}
      onCountryRegionCityRemovedCb={handleCountryRegionCityRemoved}
      initialSearch={postCountryRegionCitySearch}
      selectedCountryRegionCity={postCountryRegionCity}
      onSearchCb={handleCountryRegionCitySearched}
      onSearchSuccessCb={handleCountryRegionCitySearchSuccess}
      onSearchFailedCb={handleCountryRegionCitySearchFailed}
      isPost
      key={2}
    />,
    <SelectProperty
      multiSelect
      initialSearch={postPropertySearch}
      onSearchCb={handlePropertySearched}
      onSearchSuccessCb={handlePropertySearchSuccess}
      onSearchFailedCb={handlePropertySearchFailed}
      countryRegionCity={postCountryRegionCity}
      selectedProperties={postProperties}
      onPropertyAddedCb={handlePropertyAdded}
      onPropertyRemovedCb={handlePropertyRemoved}
      key={3}
    />,
    <ImagePicker
      initialImages={postImages}
      onImagesAddedCb={handleImagesAdded}
      onImageRemovedCb={handleImageRemove}
      maxImagesLength={MAX_IMAGES_LENGTH}
      key={4}
      mediaType="mixed"
      title={t("add_post.add_post_image")}
    />
  ];

  const stepCount = 2;
  const pageToSkipTo = 1;

  const handleShouldSkip = (currentPage: number) => {
    const shouldSkip =
      currentPage === pageToSkipTo && postCountryRegionCityArr?.length <= 0;

    return shouldSkip ? stepCount : 1;
  };

  const handleImageUpload = (data: CompletedData) => {
    try {
      const uploadedImageId = String(JSON.parse(data.responseBody)[0].id);
      const uploadedImageName = String(JSON.parse(data.responseBody)[0].name);
      const typeOfUploadedItem = postImages
        .find(postImage => postImage?.fileName === uploadedImageName)
        ?.type?.split("/")[0];

      thunkDispatch(
        addPostImageIdThunk({ uploadedImageId, isEditPost, type: typeOfUploadedItem })
      );
    } catch (error) {
      generalErrorHandler(`Error: handleImageUpload --AddPost.tsx ${error}`);
    }
  };

  const handleOnNextPressed = async (page: number, isSkipping: boolean) => {
    setCurrentPage(page);
    await logEvent(ADD_POST_NEXT, {
      ...analyticsProps,
      page,
      is_skipping: isSkipping
    });
  };

  const handleOnPreviousPressed = async (page: number, isSkipping: boolean) => {
    await logEvent(ADD_POST_PREVIOUS, {
      ...analyticsProps,
      page,
      is_skipping: isSkipping
    });
  };
  const handleOnFinishPressed = async () => {
    dispatch(setIsSubmittingPost());
    await logEvent(ADD_POST_FINISH, analyticsProps);
    let isAllImagesAlreadyUploaded = true;
    if (!isEditPost && postImages?.length === 0) {
      thunkDispatch(addPostThunk(null));
      navigation.goBack();
      return;
    }
    postImages?.forEach((item: Asset) => {
      if (item.alreadyUploaded) {
        const { uuid, ...restOfProps } = item;
        return dispatch(addPostImageId({ ...restOfProps, id: uuid }));
      }
      isAllImagesAlreadyUploaded = false;
      backgroundImageUpload(
        item?.uri || "",
        () => undefined,
        error =>
          logError(
            `Error: backgroundImageUpload --AddPost.tsx uri=${item?.uri} ${error}`
          ),
        handleImageUpload,
        () => undefined
      );
    });
    if (isEditPost && (isAllImagesAlreadyUploaded || postImages?.length === 0)) {
      thunkDispatch(addPostImageIdThunk({ isEditPost }));
    }
    navigation.goBack();
  };

  const handleExitPressed = async (shouldSaveWork: boolean) => {
    await logEvent(ADD_POST_EXIT_PAGE, {
      ...analyticsProps,
      should_save_work: shouldSaveWork
    });
  };

  const handleClearData = () => {
    dispatch(clearPostData());
  };

  const handlePageChangeCb = (page: number) => {
    const isDisabled = postDetails?.length === 0 && postImages?.length === 0;
    if (!isDisabled) {
      return;
    }
    // enable next while finish is only disabled
    setIsNextDisabled(page === 3 ? isDisabled : false);
  };

  useEffect(() => {
    // enable disable next based on if we have images/videos
    if (currentPage === 0) {
      return;
    }
    setIsNextDisabled(postImages?.length === 0 && postDetails?.length === 0);
  }, [postImages, postDetails, currentPage]);

  return (
    <PagerViewSteps
      title={titles}
      stepSize={stepCount}
      getStepCount={handleShouldSkip}
      onFinishPressed={handleOnFinishPressed}
      onNextPressed={handleOnNextPressed}
      onPreviousPressed={handleOnPreviousPressed}
      nextButtonDisabled={isNextDisabled}
      headerExpandedHeight={headerExpandedHeights}
      containerStyle={viewPagerContainerStyle}
      pages={pages}
      onExitCb={handleExitPressed}
      lastButtonLabel={t("publish")}
      clearDataCb={handleClearData}
      keyboardShouldPersistTaps={"handled"}
      pageCallback={handlePageChangeCb}
    />
  );
};

export default AddPostScreen;
