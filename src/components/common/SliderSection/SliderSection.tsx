import React, { useMemo, memo, useCallback } from "react";
import { View } from "react-native";

import isEqual from "react-fast-compare";
import { useTheme } from "react-native-paper";

import styles from "./SliderSection.styles";
import { SliderSectionProps } from "./SliderSection.type";

import { CText } from "~/components/common";

const SliderSection = (props: SliderSectionProps): JSX.Element => {
  const theme = useTheme();
  const {
    children,
    title,
    subTitle,
    moreText,
    onLayout = () => {},
    moreCallback = (properties: any) => {},
    moreCallbackProperties,
    noFooter = false,
    semiFooter = false
  } = props;

  const {
    sliderItemWrapperStyle,
    sliderItemTextWrapperStyle,
    sliderItemWrapperNoFooterStyle,
    sliderItemWrapperSemiFooterStyle,
    sliderItemTextWrapperNoFooterStyle,
    sliderItemTextWrapperSemiFooterStyle,
    row,
    subTitleTextStyle
  } = useMemo(() => styles(theme), [theme]);

  const handleCallbackPressed = useCallback(() => {
    moreCallback(moreCallbackProperties);
  }, [moreCallback, moreCallbackProperties]);

  return (
    <View
      style={
        noFooter
          ? sliderItemWrapperNoFooterStyle
          : semiFooter
          ? sliderItemWrapperSemiFooterStyle
          : sliderItemWrapperStyle
      }
      onLayout={onLayout}
    >
      <View
        style={
          noFooter
            ? sliderItemTextWrapperNoFooterStyle
            : semiFooter
            ? sliderItemTextWrapperSemiFooterStyle
            : sliderItemTextWrapperStyle
        }
      >
        <View style={row}>
          <CText color="black" fontSize={14}>
            {title}
          </CText>
          <CText color="gray" fontSize={11} style={subTitleTextStyle}>
            {subTitle}
          </CText>
        </View>
        {!!moreText && moreText !== "" && (
          <CText color="primary" fontSize={12} onPress={handleCallbackPressed}>
            {moreText}
          </CText>
        )}
      </View>

      {children}
    </View>
  );
};

export default memo(SliderSection, isEqual);
