import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Asset } from "react-native-image-picker";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~/redux/store";

import { propertyService } from "~/apiServices/index";
import { PropertyType } from "~/apiServices/property/property.types";
import { Recaptcha, ImagePicker } from "~/components/";
import {
  PropertyDetailsInput,
  TypesSelector,
  LocationSelector
} from "~/components/suggestProperty";
import PagerViewSteps from "~/containers/pagerViewSteps";
import suggestPropertyStyle from "~/containers/suggestProperty/SuggestProperty.style";
import {
  addPropertyImages,
  removePropertyImage,
  setSuggestPropertyRecaptchaToken,
  clearSuggestPropertyData,
  setIsSubmittingSuggest
} from "~/redux/reducers/propertySocialAction.reducer";
import {
  addPropertyImageIdThunk,
  suggestPropertyThunk
} from "~/redux/thunk/propertySocialAction.thunk";
import {
  backgroundImageUpload,
  logEvent,
  SUGGEST_PROPERTY_EXIT_PAGE,
  SUGGEST_PROPERTY_NEXT,
  SUGGEST_PROPERTY_PREVIOUS,
  SUGGEST_PROPERTY_FINISH
} from "~/services/";
import { generalErrorHandler, logError, verticalScale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";

const MAX_IMAGES_LENGTH = 10;

const ANALYTICS_SOURCE = "suggest_property_page";

const SuggestPropertyScreen = (): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[] | null>(null);

  const propertyImages = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyImages
  );
  const marker = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.marker
  );
  const address = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.address
  );
  const propertyTitle = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyTitle
  );
  const propertyDescription = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyDescription
  );
  const selectedPropertyTypes = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.propertyTypes
  );

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const { t } = useTranslation();
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const navigation = useNavigation();
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    propertyService
      .getPropertyTypes()
      .then(propertyTypesData => setPropertyTypes(propertyTypesData || []))
      .catch(error =>
        generalErrorHandler(`Error: getPropertyTypes --SuggestProperty.tsx-- ${error}`)
      );
  }, []);

  const { viewPagerContainerStyle, recaptchaContainerStyle, mapContainerStyle } =
    suggestPropertyStyle(colors);

  const titles = [
    t("suggest_property.select_property_type"),
    t("suggest_property.select_property_location"),
    t("suggest_property.add_title_and_description"),
    t("suggest_property.add_property_images")
  ];

  const headerExpandedHeights = [
    verticalScale(200),
    verticalScale(170),
    verticalScale(330),
    verticalScale(250)
  ];

  const handleImagesAdded = (images: Asset[]) => {
    dispatch(addPropertyImages(images));
  };

  const handleImageRemove = (image: Asset) => {
    dispatch(removePropertyImage(image));
  };

  const pages = [
    <TypesSelector
      propertyTypes={propertyTypes}
      setNextDisabled={setIsNextDisabled}
      key={1}
    />,
    <LocationSelector
      isThemeDark={isThemeDark}
      containerStyle={mapContainerStyle}
      setNextDisabled={setIsNextDisabled}
      key={2}
      analyticsSource={ANALYTICS_SOURCE}
    />,
    <PropertyDetailsInput setNextDisabled={setIsNextDisabled} key={3} />,
    <ImagePicker
      mediaType={"photo"}
      initialImages={propertyImages}
      onImagesAddedCb={handleImagesAdded}
      onImageRemovedCb={handleImageRemove}
      maxImagesLength={MAX_IMAGES_LENGTH}
      key={4}
    />
  ];

  const analyticsProps = {
    source: ANALYTICS_SOURCE,
    property_types_ids: selectedPropertyTypes.map(item => item.id),
    property_types_names: selectedPropertyTypes.map(item => item.title?.en),
    property_description: propertyDescription,
    property_title: propertyTitle,
    number_of_images: propertyImages?.length,
    marker,
    address
  };

  const handleRecaptchaOnCheck = async (token: string) => {
    navigation.navigate("PropertySocialActionIntro");
    dispatch(setIsSubmittingSuggest());
    dispatch(setSuggestPropertyRecaptchaToken(token));
    await logEvent(SUGGEST_PROPERTY_FINISH, analyticsProps);

    if (propertyImages.length <= 0) {
      thunkDispatch(suggestPropertyThunk(null));
      navigation.goBack();
      return;
    }
    propertyImages.forEach((item: Asset) => {
      backgroundImageUpload(
        item?.uri || "",
        () => undefined,
        error =>
          logError(
            `Error: backgroundImageUpload --SuggestProperty.tsx uri=${item?.uri} ${error}`
          ),
        data => {
          thunkDispatch(
            addPropertyImageIdThunk(String(JSON.parse(data.responseBody)[0].id))
          );
        },
        () => undefined
      );
    });
  };

  const handleOnFinishPressed = async () => {
    setIsNextDisabled(true);
    setHasFinished(true);
  };

  const handleOnNextPressed = async (page: number) => {
    await logEvent(SUGGEST_PROPERTY_NEXT, { ...analyticsProps, page });
  };

  const handleOnPreviousPressed = async (page: number) => {
    await logEvent(SUGGEST_PROPERTY_PREVIOUS, { ...analyticsProps, page });
  };

  const handleExitPressed = async (shouldSaveWork: boolean) => {
    await logEvent(SUGGEST_PROPERTY_EXIT_PAGE, {
      ...analyticsProps,
      should_save_work: shouldSaveWork
    });
  };

  const handleClearData = () => {
    dispatch(clearSuggestPropertyData());
  };

  return (
    <>
      <PagerViewSteps
        title={titles}
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
      {hasFinished && (
        <View style={recaptchaContainerStyle}>
          <Recaptcha onCheck={handleRecaptchaOnCheck} />
        </View>
      )}
    </>
  );
};

export default SuggestPropertyScreen;
