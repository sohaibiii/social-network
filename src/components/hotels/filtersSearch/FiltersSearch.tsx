import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";

import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import filtersSearchStyles from "./FiltersSearch.styles";
import { FiltersSearchProps } from "./FiltersSearch.types";

import { hotelsService } from "~/apiServices/index";
import { CText, TextInput } from "~/components/";
import { setPostDetails } from "~/redux/reducers/propertySocialAction.reducer";
import { logError } from "~/utils/";

const FiltersSearch = (props: FiltersSearchProps): JSX.Element => {
  const { t } = useTranslation();
  const { onBackPressedCb, onHotelPressedCb, latitude, longitude } = props;
  const { colors } = useTheme();
  const { row, contentContainerStyle, hotelStyle } = filtersSearchStyles(colors);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const useDebouncedSearch = useDebouncedCallback(value => {
    handleSearch(value);
  }, 300);

  const handleSearch = (term: string) => {
    hotelsService
      .autoComplete(`${term}&location=${latitude},${longitude}&distance=7500`)
      .then(res => setSearchResults(res.items))
      .catch(error =>
        logError(
          `Error: autoComplete --FiltersSearch.tsx-- term=${term} lat=${latitude} lon=${longitude} ${error}`
        )
      );
  };

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={contentContainerStyle}>
      <TouchableOpacity onPress={onBackPressedCb} style={row}>
        <Appbar.BackAction color={colors.primary} size={20} />
        <CText color={"primary"} fontSize={14} lineHeight={19}>
          {t("goBack")}
        </CText>
      </TouchableOpacity>
      <TextInput onChangeText={useDebouncedSearch} />
      {searchResults.map(item => (
        <TouchableOpacity
          onPress={() => onHotelPressedCb(item)}
          key={item.id}
          style={hotelStyle}
        >
          <CText fontSize={13} lineHeight={18}>
            {item.name}
          </CText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FiltersSearch;
