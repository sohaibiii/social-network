import React from "react";
import { View } from "react-native";

import { NativeStackHeaderProps } from "@react-navigation/native-stack/src/types";
import { Appbar, useTheme } from "react-native-paper";

import styles from "./CustomHeader.styles";

import { textEllipsis } from "~/utils/stringUtil";

const CustomHeader = (props: NativeStackHeaderProps): JSX.Element => {
  const { colors } = useTheme();
  const { navigation, back, options } = props;
  const {
    headerRight,
    title = "",
    isTitleLeft = false,
    headerTitle = "",
    headerTitleStyle
  } = options;

  const {
    containerStyle,
    titleContainerStyle,
    titleStyle,
    dividerStyle,
    elevationWrapperStyle,
    headerWrapperStyle,
    titleLeftStyle
  } = styles;

  const titleElipsized = textEllipsis(`${title || headerTitle}`, 40);

  return (
    <View style={headerWrapperStyle}>
      <View style={dividerStyle(colors)} />
      <Appbar.Header style={containerStyle(colors)}>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content
          style={titleContainerStyle}
          titleStyle={headerTitleStyle || (isTitleLeft ? titleLeftStyle : titleStyle)}
          title={titleElipsized}
        />
        {headerRight ? headerRight() : null}
      </Appbar.Header>
      <View style={elevationWrapperStyle(colors)} />
    </View>
  );
};

export default CustomHeader;
