import React, { FC, memo } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { CText } from "../";
import { RatingBar } from "../RatingBar";
import { RatingComponentTypes } from "../RatingBar/RatingComponent/RatingComponent.types";

import reviewSummaryStyle from "./reviewSummary.styles";
import { ReviewSummaryProps } from "./reviewSummary.types";

const ReviewSummary: FC<ReviewSummaryProps> = props => {
  const { rate } = props;
  const { contributes = 0, rate_calculated = 5, rate_distribution = {} } = rate || {};

  const { t } = useTranslation();
  const { colors } = useTheme();

  const {
    root,
    ratingContainer,
    ratingStyle,
    totalRatingStyle,
    ratingRowContainer,
    ratingBarContainer,
    activeRatingBar
  } = reviewSummaryStyle(colors);

  return (
    <View style={root}>
      <CText fontSize={16}>{t("user_reviews")}</CText>
      <View style={ratingContainer}>
        <RatingBar
          ratingCount={5}
          defaultValue={rate_calculated}
          type={RatingComponentTypes.STAR}
          size={30}
          disabled
          containerStyle={ratingStyle}
        />
        {!!rate_calculated && (
          <CText fontSize={13} fontFamily="light">
            {parseFloat(rate_calculated).toFixed(2)} {t("out_of")} 5
          </CText>
        )}
      </View>
      <CText fontSize={13} fontFamily="light" style={totalRatingStyle}>
        {t("user_rating.humanized", { count: Number(contributes ?? 0) })}
      </CText>
      {Object.keys(rate_distribution)
        ?.reverse()
        ?.map(id => {
          const percentageValue =
            Math.round((rate_distribution[id] / contributes) * 100) + "%";
          const activeRatingBarStyle = [activeRatingBar, { width: percentageValue }];

          return (
            <View key={id} style={ratingRowContainer}>
              <CText fontSize={13} color="primary">
                {t("star", { count: Number(id) })}
              </CText>
              <View style={ratingBarContainer}>
                <View style={activeRatingBarStyle} />
              </View>
              <CText fontSize={13}>{percentageValue}</CText>
            </View>
          );
        })}
    </View>
  );
};

export default memo(ReviewSummary);
