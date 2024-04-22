import React, { useState } from "react";

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
import { SelectCountry, SelectProperty } from "~/components/addPost";
import { AddReview } from "~/components/rateProperty";
import PagerViewSteps from "~/containers/pagerViewSteps";
import suggestPropertyStyle from "~/containers/suggestProperty/SuggestProperty.style";
import {
  addRateImages,
  setRateProperty,
  setRateCountryRegionCitySearch,
  removeRateImage,
  removeRateProperty,
  setRatePropertySearch,
  setRateCountryRegionCity,
  removeRateCountryRegionCity,
  clearRatePropertyData,
  setIsSubmittingReview
} from "~/redux/reducers/propertySocialAction.reducer";
import {
  addRateImageIdThunk,
  addRateThunk
} from "~/redux/thunk/propertySocialAction.thunk";
import {
  RATE_PROPERTY_SEARCH_PROPERTY,
  RATE_PROPERTY_SEARCH_PROPERTY_FAILED,
  RATE_PROPERTY_SEARCH_PROPERTY_SUCCESS,
  backgroundImageUpload,
  logEvent,
  RATE_PROPERTY_NEXT,
  RATE_PROPERTY_PREVIOUS,
  RATE_PROPERTY_SEARCH_COUNTRY_SUCCESS,
  RATE_PROPERTY_SEARCH_COUNTRY_FAILED,
  RATE_PROPERTY_SEARCH_COUNTRY,
  RATE_PROPERTY_EXIT_PAGE,
  RATE_PROPERTY_FINISH
} from "~/services/";
import { generalErrorHandler, logError, verticalScale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";

const MAX_IMAGES_LENGTH = 15;

const ANALYTICS_SOURCE = "rate_property_page";
const AddPostScreen = (): JSX.Element => {
  const { colors } = useTheme();
  const { viewPagerContainerStyle } = suggestPropertyStyle(colors);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const navigation = useNavigation();

  const rateCountryRegionCity = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.rateProperty.rateCountryRegionCity
  );

  const rateProperty = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.rateProperty.rateProperty
  );

  const rateStars = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.rateProperty.rateStars
  );

  const rateImages = useSelector(
    (reduxState: RootState) => reduxState.propertySocialAction.rateProperty.rateImages
  );

  const rateCountryRegionCityArr = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.rateProperty.rateCountryRegionCityArr
  );

  const ratePropertySearch = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.rateProperty.ratePropertySearch
  );

  const rateCountryRegionCitySearch = useSelector(
    (reduxState: RootState) =>
      reduxState.propertySocialAction.rateProperty.rateCountryRegionCitySearch
  );

  const titles = [
    t("rate_property.select_post_country_or_city"),
    t("rate_property.select_property"),
    t("rate_property.rate_and_describe"),
    t("rate_property.add_property_images")
  ];

  const headerExpandedHeights = [
    verticalScale(160),
    verticalScale(220),
    verticalScale(150),
    verticalScale(250)
  ];

  const handleImagesAdded = (images: Asset[]) => {
    dispatch(addRateImages(images));
  };

  const handleImageRemove = (image: Asset) => {
    dispatch(removeRateImage(image));
  };

  const handlePropertyRemoved = () => {
    dispatch(removeRateProperty());
  };
  const handlePropertyAdded = (property: PropertyResponseType) => {
    dispatch(setRateProperty(property));
  };

  const analyticsProps = {
    source: ANALYTICS_SOURCE,
    property_pkey: rateProperty?.pkey,
    property_slug: rateProperty?.slug,
    rating: rateStars,
    property_title: rateProperty?.title?.en
  };

  const handleCountryRegionCitySearched = (term: string) => {
    dispatch(setRateCountryRegionCitySearch(term));
    return logEvent(RATE_PROPERTY_SEARCH_COUNTRY, {
      ...analyticsProps,
      term
    });
  };

  const handleCountryRegionCitySearchSuccess = (term: string) => {
    return logEvent(RATE_PROPERTY_SEARCH_COUNTRY_SUCCESS, {
      ...analyticsProps,
      term
    });
  };

  const handleCountryRegionCitySearchFailed = (term: string) => {
    return logEvent(RATE_PROPERTY_SEARCH_COUNTRY_FAILED, {
      ...analyticsProps,
      term
    });
  };

  const handlePropertySearched = (term: string) => {
    dispatch(setRatePropertySearch(term));
    return logEvent(RATE_PROPERTY_SEARCH_PROPERTY, {
      ...analyticsProps,
      term
    });
  };
  const handlePropertySearchSuccess = (term: string) => {
    return logEvent(RATE_PROPERTY_SEARCH_PROPERTY_SUCCESS, {
      ...analyticsProps,
      term
    });
  };
  const handlePropertySearchFailed = (term: string) => {
    return logEvent(RATE_PROPERTY_SEARCH_PROPERTY_FAILED, {
      ...analyticsProps,
      term
    });
  };

  const handleCountryRegionCitySelected = (item: CountryRegionCityType) => {
    dispatch(setRateCountryRegionCity(item));
  };
  const handleCountryRegionCityRemoved = (item: CountryRegionCityType) => {
    dispatch(removeRateCountryRegionCity(item));
  };

  const pages = [
    <SelectCountry
      countryRegionCityArr={rateCountryRegionCityArr}
      onCountryRegionCitySelectedCb={handleCountryRegionCitySelected}
      onCountryRegionCityRemovedCb={handleCountryRegionCityRemoved}
      initialSearch={rateCountryRegionCitySearch}
      selectedCountryRegionCity={rateCountryRegionCity}
      onSearchCb={handleCountryRegionCitySearched}
      onSearchSuccessCb={handleCountryRegionCitySearchSuccess}
      onSearchFailedCb={handleCountryRegionCitySearchFailed}
      setIsNextDisabled={setIsNextDisabled}
      key={1}
    />,
    <SelectProperty
      multiSelect={false}
      initialSearch={ratePropertySearch}
      onSearchCb={handlePropertySearched}
      onSearchSuccessCb={handlePropertySearchSuccess}
      onSearchFailedCb={handlePropertySearchFailed}
      countryRegionCity={rateCountryRegionCity}
      selectedProperties={rateProperty ? [rateProperty] : []}
      onPropertyAddedCb={handlePropertyAdded}
      onPropertyRemovedCb={handlePropertyRemoved}
      setIsNextDisabled={setIsNextDisabled}
      key={2}
      isRateProperty
    />,
    <AddReview setIsNextDisabled={setIsNextDisabled} key={3} />,
    <ImagePicker
      mediaType={"photo"}
      initialImages={rateImages}
      onImagesAddedCb={handleImagesAdded}
      onImageRemovedCb={handleImageRemove}
      maxImagesLength={MAX_IMAGES_LENGTH}
      key={4}
    />
  ];

  const stepCount = 2;
  const pageToSkipTo = 0;

  const handleShouldSkip = (currentPage: number) => {
    return currentPage === pageToSkipTo && !rateCountryRegionCity ? stepCount : 1;
  };

  const handleImageUpload = (data: CompletedData) => {
    try {
      const uploadedImageId = String(JSON.parse(data.responseBody)[0].id);
      thunkDispatch(addRateImageIdThunk(uploadedImageId));
    } catch (error) {
      generalErrorHandler(`Error: handleImageUpload --RateProperty.tsx-- ${error}`);
    }
  };

  const handleOnNextPressed = async (page: number, isSkipping: boolean) => {
    await logEvent(RATE_PROPERTY_NEXT, {
      ...analyticsProps,
      page,
      is_skipping: isSkipping
    });
  };

  const handleOnPreviousPressed = async (page: number, isSkipping: boolean) => {
    await logEvent(RATE_PROPERTY_PREVIOUS, {
      ...analyticsProps,
      page,
      is_skipping: isSkipping
    });
  };
  const handleOnFinishPressed = async () => {
    dispatch(setIsSubmittingReview());
    await logEvent(RATE_PROPERTY_FINISH, analyticsProps);
    if (rateImages?.length <= 0) {
      thunkDispatch(addRateThunk(null));
      navigation.goBack();
      return;
    }
    rateImages.forEach((item: Asset) => {
      backgroundImageUpload(
        item?.uri || "",
        () => undefined,
        error =>
          logError(
            `Error: backgroundImageUpload --RateProperty.tsx uri=${item?.uri} ${error}`
          ),
        handleImageUpload,
        () => undefined
      );
    });
    navigation.goBack();
  };

  const handleExitPressed = async (shouldSaveWork: boolean) => {
    await logEvent(RATE_PROPERTY_EXIT_PAGE, {
      ...analyticsProps,
      should_save_work: shouldSaveWork
    });
  };

  const handleClearData = () => {
    dispatch(clearRatePropertyData());
  };

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
      clearDataCb={handleClearData}
      keyboardShouldPersistTaps={"handled"}
    />
  );
};

export default AddPostScreen;
