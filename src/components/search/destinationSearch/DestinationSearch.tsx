import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";

import { useTheme } from "react-native-paper";
import { useDebouncedCallback } from "use-debounce";

import destinationSearchStyles from "./DestinationSearch.styles";
import { DestinationSearchProps } from "./DestinationSearch.types";

import { searchService } from "~/apiServices/index";
import { CText, TextInput } from "~/components/";
import { generalErrorHandler } from "~/utils/";

const DestinationSearch = (props: DestinationSearchProps): JSX.Element => {
  const { onDestinationSelected, language } = props;
  const { colors } = useTheme();
  const { contentContainerStyle, hotelStyle } = destinationSearchStyles(colors);

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const [destinations, setDestinations] = useState<any[]>([]);

  const useDebouncedSearch = useDebouncedCallback(value => {
    handleSearch(value);
  }, 300);

  const handleSearch = (term: string) => {
    searchService
      .searchByTerm(term, "destination")
      .then(res => setDestinations(res.items))
      .catch(error =>
        generalErrorHandler(
          `Error: searchByTerm --DestinationSearch.tsx-- term=${term} ${error}`
        )
      );
  };

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={contentContainerStyle}>
      <TextInput onChangeText={useDebouncedSearch} autoFocus />
      {destinations.map(item => (
        <TouchableOpacity
          onPress={() => onDestinationSelected(item)}
          key={item.id}
          style={hotelStyle}
        >
          <CText fontSize={13} lineHeight={18}>
            {item.title[language]}
          </CText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DestinationSearch;
