import React from "react";
import { SafeAreaView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import propertySocialActionIntoStyle from "./PropertySocialActionIntro.styles";

import { RootState } from "~/redux/store";

import IMAGES from "~/assets/images";
import { PropertySocialActionIntroCard } from "~/components/propertySocialActionIntro";
import {
  logEvent,
  PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_ADD_POST,
  PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_RATE_PROPERTY,
  PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_SUGGEST_PROPERTY
} from "~/services/";

const PropertySocialActionIntro = (): JSX.Element => {
  const navigation = useNavigation();
  const { containerStyle } = propertySocialActionIntoStyle;

  const isSubmittingSuggest = useSelector(
    (state: RootState) => state.propertySocialAction.suggestProperty.isSubmitting
  );
  const isSubmittingPost = useSelector(
    (state: RootState) => state.propertySocialAction.addPost.isSubmitting
  );
  const isSubmittingRate = useSelector(
    (state: RootState) => state.propertySocialAction.rateProperty.isSubmitting
  );

  const { t } = useTranslation();

  const handleSuggestProperty = async () => {
    await logEvent(PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_SUGGEST_PROPERTY, {
      source: "property_social_action"
    });
    navigation.navigate("SuggestProperty");
  };

  const handleAddPost = async () => {
    await logEvent(PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_ADD_POST, {
      source: "property_social_action"
    });
    navigation.navigate("AddPost");
  };

  const handleRateProperty = async () => {
    await logEvent(PROPERTY_SOCIAL_ACTION_NAVIGATE_TO_RATE_PROPERTY, {
      source: "property_social_action"
    });
    navigation.navigate("RateProperty");
  };

  return (
    <SafeAreaView style={containerStyle}>
      <PropertySocialActionIntroCard
        title={t("add_post.title")}
        onPress={handleAddPost}
        backgroundImage={IMAGES.new_post}
        loading={isSubmittingPost}
      />
      <PropertySocialActionIntroCard
        title={t("rate_property.title")}
        onPress={handleRateProperty}
        backgroundImage={IMAGES.add_review}
        loading={isSubmittingRate}
      />
      <PropertySocialActionIntroCard
        title={t("suggest_property.title")}
        onPress={handleSuggestProperty}
        backgroundImage={IMAGES.suggest_place}
        loading={isSubmittingSuggest}
      />
    </SafeAreaView>
  );
};

export default PropertySocialActionIntro;
