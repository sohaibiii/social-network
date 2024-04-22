import React, { forwardRef } from "react";
import { View } from "react-native";

import PagerView from "react-native-pager-view";
import { useTheme } from "react-native-paper";

import styles from "./pointsBank.styles";

import { PointsBankPagerViewTypes } from "~/containers/pointsBank/pointsBank.types";

const PointsBankPagerView: React.ForwardRefRenderFunction<
  PagerView,
  PointsBankPagerViewTypes
> = (props: PointsBankPagerViewTypes, forwardedRef): JSX.Element => {
  const { handlePagerPageSelected = () => undefined, routes = [] } = props;

  const theme = useTheme();
  const { flex } = styles(theme);
  return (
    <PagerView
      ref={forwardedRef}
      scrollEnabled
      style={flex}
      orientation="horizontal"
      onPageSelected={handlePagerPageSelected}
      initialPage={0}
    >
      {routes?.map(item => {
        const Screen = item.screen;
        return (
          <View key={item.key}>
            <Screen />
          </View>
        );
      })}
    </PagerView>
  );
};

export default forwardRef(PointsBankPagerView);
