import React from "react";
import { ScrollView, View } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./BestMonths.styles";
import { BestMonthTypes } from "./BestMonths.types";

import { RootState } from "~/redux/store";

import { CText } from "~/components/common";

const BestMonths = (props: BestMonthTypes): JSX.Element => {
  const {
    months = [],
    bestTimeToVisit = [],
    handleBestTimeToVisitInfo = () => {}
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const language = useSelector((state: RootState) => state.settings.language || "ar");

  //   const monthToTextMap = {
  //     0: "شهر جيد جدا للزيارة",
  //     1: "شهر جيد للزيارة",
  //     2: "شهرمحايد للزيارة",
  //     3: "شهر سيء للزيارة",
  //     4: "شهر سيء للغاية للزيارة"
  //   };

  const monthToTextMap = {
    0: t("Good"),
    1: t("Bad")
  };

  const {
    containerStyle,
    monthWrapperStyle,
    monthWrapperActiveStyle,
    monthInfoWrapperStyle,
    monthInfoInnerWrapperStyle,
    monthInfoItemStyle,
    monthInfoActiveItemStyle,
    bestTimeWrapperStyle,
    contentContainerStyle
  } = styles(theme);

  return (
    <View style={containerStyle}>
      <View style={bestTimeWrapperStyle}>
        <CText fontSize={16} lineHeight={21} textAlign="left">
          {t("best_time_to_visit")}
        </CText>
        <View style={monthInfoWrapperStyle}>
          {Object.keys(monthToTextMap).map((item, index) => {
            return (
              <View style={monthInfoInnerWrapperStyle} key={`${item}-${index}`}>
                <View style={index < 1 ? monthInfoActiveItemStyle : monthInfoItemStyle} />
                <CText fontSize={11} lineHeight={16}>
                  {monthToTextMap[index]}
                </CText>
              </View>
            );
          })}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {months?.map((month: number, index: number) => {
          const isActive = month <= 3;
          return (
            <View
              key={`${index}`}
              style={isActive ? monthWrapperActiveStyle : monthWrapperStyle}
            >
              <CText
                fontSize={12}
                textAlign="center"
                color={isActive ? "white" : "homepageItemText"}
                fontFamily={isActive ? "medium" : "regular"}
              >
                {moment().locale(language).month(index).format("MMM")}
              </CText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BestMonths;
