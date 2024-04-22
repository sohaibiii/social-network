import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import addReviewStyle from "./AddReview.style";
import { AddReviewProps } from "./AddReview.types";

import { RootState } from "~/redux/store";

import { AnimatedRatingBar, TextInput } from "~/components/";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import {
  setRateStars,
  setRateReview
} from "~/redux/reducers/propertySocialAction.reducer";
import { scale, verticalScale } from "~/utils/";

const AddReview = (props: AddReviewProps): JSX.Element => {
  const { setIsNextDisabled = () => undefined } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const rateReview = useSelector(
    (state: RootState) => state.propertySocialAction.rateProperty.rateReview
  );

  const rateStars = useSelector(
    (state: RootState) => state.propertySocialAction.rateProperty.rateStars
  );

  const [description, setDescription] = useState(rateReview);

  const { containerStyle, inputContainerStyle, descriptionInputStyle } = addReviewStyle(
    APP_SCREEN_HEIGHT * 0.8
  );

  const debouncedSetDescription = useDebouncedCallback(value => {
    setDescription(value);
    dispatch(setRateReview(value));
  }, 200);

  const handleStarSelected = (stars: number) => {
    dispatch(setRateStars(stars));
  };

  useEffect(() => {
    setIsNextDisabled(rateStars === 0);
  }, [rateStars, setIsNextDisabled]);

  return (
    <View style={containerStyle} collapsable={false}>
      <View style={inputContainerStyle}>
        <AnimatedRatingBar
          onToggleCb={handleStarSelected}
          ratingCount={5}
          defaultValue={rateStars}
          size={scale(30)}
        />
        <TextInput
          multiline
          scrollEnabled
          defaultValue={description}
          onChangeText={debouncedSetDescription}
          placeholderTextColor={"#959595"}
          placeholder={t("rate_property.add_review_placeHolder")}
          numberOfLines={10}
          minHeight={verticalScale(250)}
          maxHeight={verticalScale(250)}
          style={descriptionInputStyle}
        />
      </View>
    </View>
  );
};
export default AddReview;
