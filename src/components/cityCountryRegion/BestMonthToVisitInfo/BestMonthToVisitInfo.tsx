import React, { useRef, useState, useCallback, memo, useEffect } from "react";
import { View, TouchableOpacity, TouchableHighlight } from "react-native";

import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import styles from "./BestMonthToVisitInfo.styles";
import { BestMonthToVisitTypes } from "./BestMonthToVisitInfo.types";

import { RootState } from "~/redux/store";

import { CText } from "~/components/common";
import { APP_SCREEN_WIDTH, isRTL, PLATFORM } from "~/constants/variables";
import {
  logEvent,
  BEST_TIME_TO_VISIT_MONTH_PRESSED,
  BEST_TIME_TO_VISIT_MONTH_CLOSED
} from "~/services/";
import { scale } from "~/utils/responsivityUtil";

const BestMonthToVisitInfo = (props: BestMonthToVisitTypes): JSX.Element => {
  const { bestTimeToVisit, slug } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const language = useSelector((state: RootState) => state.settings.language || "ar");
  const [pagerIndex, setPagerIndex] = useState(0);
  const viewPagerRef = useRef<PagerView>(null);
  const tabsScrollViewRef = useRef<ScrollView>(null);

  const TOTAL_MONTHS = bestTimeToVisit.length;
  const TAB_WIDTH = TOTAL_MONTHS > 3 ? scale(110) : APP_SCREEN_WIDTH / TOTAL_MONTHS;

  const months = isRTL
    ? Array(TOTAL_MONTHS).fill().reverse()
    : Array(TOTAL_MONTHS).fill();

  const handleMonthPressed = useCallback(async index => {
    setPagerIndex(index);
    await logEvent(BEST_TIME_TO_VISIT_MONTH_PRESSED, {
      source: "city_country_region_page",
      month_id: index,
      slug
    });
    viewPagerRef?.current?.setPage(index);
  }, []);

  useEffect(() => {
    return () => {
      logEvent(BEST_TIME_TO_VISIT_MONTH_CLOSED, {
        source: "city_country_region_page",
        slug
      });
    };
  }, []);

  const handlePagerPageSelected = useCallback(
    async e => {
      const newIndex = e.nativeEvent.position;
      setPagerIndex(newIndex);
      await logEvent(BEST_TIME_TO_VISIT_MONTH_PRESSED, {
        source: "city_country_region_page",
        month_id: newIndex,
        slug
      });
      tabsScrollViewRef.current?.scrollTo({
        x:
          isRTL && PLATFORM === "android"
            ? (TOTAL_MONTHS - 2 - newIndex) * TAB_WIDTH
            : (newIndex - 1) * TAB_WIDTH,
        y: 0,
        animated: true
      });
    },
    [TAB_WIDTH, TOTAL_MONTHS]
  );

  const {
    flex,
    wrapperStyle,
    titleTextStyle,
    monthWrapperStyle,
    monthActiveWrapperStyle,
    bottomViewWrapperStyle,
    pagerViewStyles,
    descriptionWrapperStyle,
    descriptionStyle,
    noMarginStart,
    noMarginEnd
  } = styles(theme, TAB_WIDTH);

  return (
    <View style={wrapperStyle}>
      <CText fontSize={16} style={titleTextStyle} textAlign="center">
        {t("best_month_more")}
      </CText>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={tabsScrollViewRef}
        >
          {months?.map((item, index) => {
            const monthTabStyle = [
              monthWrapperStyle,
              pagerIndex === index ? monthActiveWrapperStyle : {},
              index === 0 ? noMarginStart : {},
              index === months.length - 1 ? noMarginEnd : {}
            ];

            const month = bestTimeToVisit[index];

            return (
              <TouchableOpacity
                key={`${index}`}
                onPress={() => handleMonthPressed(index)}
                style={monthTabStyle}
              >
                <CText
                  color={pagerIndex === index ? "white" : "text"}
                  fontSize={13}
                  lineHeight={16}
                  style={descriptionWrapperStyle}
                >
                  {month?.title || ""}
                </CText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={flex} contentContainerStyle={flex}>
        <TouchableHighlight containerStyle={bottomViewWrapperStyle} style={flex}>
          <PagerView
            ref={viewPagerRef}
            scrollEnabled
            orientation="horizontal"
            style={pagerViewStyles}
            onPageSelected={handlePagerPageSelected}
            initialPage={0}
          >
            {bestTimeToVisit.map(item => (
              <TouchableHighlight key={item.title} style={descriptionWrapperStyle}>
                <CText fontSize={14} style={descriptionStyle} fontFamily={"light"}>
                  {item.description}
                </CText>
              </TouchableHighlight>
            ))}
          </PagerView>
        </TouchableHighlight>
      </ScrollView>
    </View>
  );
};

export default memo(BestMonthToVisitInfo);
