import React from "react";
import { Pressable, View } from "react-native";

import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import searchBarStyle from "./SearchBar.style";
import { RadioButtonProps } from "./SearchBar.types";

import { Icon, IconTypes } from "~/components/";

const SearchBar = (props: RadioButtonProps): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const {
    label = t("searchPlaceholder"),
    onPress,
    style,
    testID = "",
    ...restOfProps
  } = props;

  const iconSize = 30;
  const { container, labelAndIconContainer, labelContainer, labelStyle, iconStyle } =
    searchBarStyle(colors);
  const labelContainerCentered = [labelContainer, { marginEnd: iconSize }];
  const containerStyle = [container, style];

  return (
    <Pressable onPress={onPress} style={containerStyle} testID={testID} {...restOfProps}>
      <View style={labelAndIconContainer}>
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          name={"search"}
          width={iconSize}
          height={iconSize}
          style={iconStyle}
        />
        <View style={labelContainerCentered}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={labelStyle}>
            {label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SearchBar;
