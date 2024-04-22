import React, { createRef, FC, memo, useCallback, useRef } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";

import PointBankHeader from "./PointBankHeader";
import PointsBankTabsHeader from "./PointsBankTabsHeader";

import {
  AwardsList,
  FAQsScreen,
  PointsTerms,
  TopUsersList,
  WheelOfFortune
} from "~/components/";
import { TabsHeaderRef } from "~/containers/pointsBank/pointsBank.types";
import PointsBankPagerView from "~/containers/pointsBank/PointsBankPagerView";
import { AppStackProps } from "~/router/Router.types";
import {
  AWARDS_LIST_VISITED,
  FAQS_SCREEN_VISITED,
  POINTS_TERMS_VISITED,
  TOP_20_VISITED,
  WHEEL_OF_FORTUNE_VISITED
} from "~/services/";
import { moderateScale } from "~/utils/";

const TAB_WIDTH = moderateScale(150);
const PointsBank: FC<AppStackProps> = () => {
  const viewPagerRef = useRef<PagerView>(null);
  const { t } = useTranslation();
  const tabsHeaderRef = createRef<TabsHeaderRef>();

  const handlePagerPageSelected = useCallback(
    async e => {
      tabsHeaderRef?.current?.scrollToIndex(e.nativeEvent.position);
    },
    [tabsHeaderRef]
  );

  const routes = useRef([
    {
      key: "topUsersList",
      title: `${t("top_20")} ${t("last_7_days")}`,
      eventName: TOP_20_VISITED,
      screen: TopUsersList
    },
    {
      key: "wheelOfFortune",
      title: `${t("wheel_of_fortune")}`,
      eventName: WHEEL_OF_FORTUNE_VISITED,
      screen: WheelOfFortune
    },
    {
      key: "awardsList",
      title: t("awards_list"),
      eventName: AWARDS_LIST_VISITED,
      screen: AwardsList
    },
    {
      key: "pointsTerms",
      title: t("how_collect_points"),
      eventName: POINTS_TERMS_VISITED,
      screen: PointsTerms
    },
    {
      key: "faqsScreen",
      title: t("faqs"),
      eventName: FAQS_SCREEN_VISITED,
      screen: FAQsScreen
    }
  ]);

  const handleTabPressed = useCallback(index => {
    viewPagerRef?.current?.setPageWithoutAnimation(index);
  }, []);

  return (
    <>
      <View>
        <PointBankHeader />
        <PointsBankTabsHeader
          ref={tabsHeaderRef}
          routes={routes?.current}
          setPagerViewPage={handleTabPressed}
          tabWidth={TAB_WIDTH}
        />
      </View>
      <PointsBankPagerView
        ref={viewPagerRef}
        routes={routes?.current}
        handlePagerPageSelected={handlePagerPageSelected}
      />
    </>
  );
};

export default memo(PointsBank);
