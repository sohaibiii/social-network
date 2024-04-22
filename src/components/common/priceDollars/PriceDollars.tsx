import React, { FC, memo, useCallback } from "react";
import { View } from "react-native";

import { useTheme } from "react-native-paper";

import { Icon, IconTypes } from "../";

import priceDollarsStyle from "./priceDollars.styles";
import { PriceDollarsProps } from "./priceDollars.types";

import { scale } from "~/utils/responsivityUtil";

const PriceDollars: FC<PriceDollarsProps> = props => {
  const { maxNumber = 4, priceRange, spacing = 0 } = props;
  const { root } = priceDollarsStyle;
  const array = new Array(maxNumber).fill(null);
  const { colors } = useTheme();

  const renderDollars = useCallback(() => {
    const priceArr = array.map((_, i) => (
      <Icon
        name="dollar_sign"
        type={IconTypes.SAFARWAY_ICONS}
        key={i.toString()}
        color={i < priceRange ? colors.lightBlue : colors.grayBB}
        height={scale(14)}
        width={scale(14 - spacing)}
      />
    ));
    return priceArr;
  }, [priceRange]);

  return <View style={root}>{renderDollars()}</View>;
};

export default memo(PriceDollars);
