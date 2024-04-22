import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Card, useTheme } from "react-native-paper";

import styles from "./HeaderSearchBar.styles";
import { HeaderSearchBarType } from "./HeaderSearchBar.types";

import { Icon, IconTypes, CText } from "~/components/common";
import { logEvent, SEARCH_PAGE_VISITED } from "~/services/analytics";
import { scale } from "~/utils/responsivityUtil";

const SearchBar = (props: HeaderSearchBarType): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    language = "ar",
    isHashtag = false,
    placeholder = t("homepage_search_placeholder")
  } = props;
  const {
    searchBarWrapperStyle,
    containerStyle,
    searchBarStyle,
    textStyle,
    iconSearchStyle
  } = styles(theme);

  const handleSearchPressed = async () => {
    await logEvent(SEARCH_PAGE_VISITED, { source: "home_page", isHashtag });
    navigation.navigate("Search", {
      isHashtag
    });
  };

  return (
    <View style={containerStyle}>
      <Card style={searchBarWrapperStyle} onPress={handleSearchPressed}>
        <View style={searchBarStyle}>
          <Icon
            name="search"
            type={IconTypes.FONTISTO}
            size={scale(18)}
            color={theme.colors.homepageItemText}
            style={iconSearchStyle}
          />
          <CText
            fontSize={14}
            color="homepageItemText"
            adjustsFontSizeToFit
            numberOfLines={1}
            style={textStyle}
          >
            {placeholder}
          </CText>
        </View>
      </Card>
    </View>
  );
};

export default memo(SearchBar);
