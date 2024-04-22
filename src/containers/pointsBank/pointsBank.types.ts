import { ReactNode } from "react";

import { PagerViewOnPageSelectedEvent } from "react-native-pager-view";

export interface AwardsListProps {
  id: number;
  name: string;
  description: string;
  image: string;
  points: number;
}

export type TabsHeaderRef = {
  scrollToIndex: (_index: number) => void;
};

export interface PointsBankTabsHeaderTypes {
  setPagerViewPage?: (_index: number) => void;
  routes: RouteType[];
  tabWidth: number;
}

export interface PointsBankPagerViewTypes {
  handlePagerPageSelected: (_event: PagerViewOnPageSelectedEvent) => void;
  routes: RouteType[];
}

export interface RouteType {
  key: string;
  title: string;
  eventName: string;
  screen: ReactNode;
}
export interface AwardsItemProps {
  item: AwardsListProps;
}
