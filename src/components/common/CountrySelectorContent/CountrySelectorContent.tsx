import React, { useCallback } from "react";
import { View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { CountrySelectorContentTypes } from "./CountrySelectorContent.types";

import { RootState } from "~/redux/store";

import { TextInput } from "~/components/";
import countrySelectorContentStyle from "~/components/common/CountrySelectorContent/CountrySelectorContent.style";
import { ListSelectorItem } from "~/components/common/ListSelector/ListSelector.types";
import { setCountryTerm } from "~/redux/reducers/countyCityRegion.reducer";
import { translate } from "~/translations/";

const CountrySelectorContent = (props: CountrySelectorContentTypes): JSX.Element => {
  const {
    countries = [],
    keyExtractor: keyExtractorParam,
    handleRenderItem = () => <View />
  } = props;

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { flatListStyle, backgroundStyle, flatListContainer } =
    countrySelectorContentStyle(colors);
  const searchTerm = useSelector(
    (state: RootState) => state.countryCityRegion.searchCountryTerm || ""
  );
  const keyExtractor = (item: ListSelectorItem) => {
    return item?.name.toString();
  };
  const NoItemsFound = useCallback(() => <Text>{translate("no_items_found")}</Text>, []);

  const filteredData = countries.filter(
    item => item.name?.startsWith(searchTerm) || item.key?.startsWith(searchTerm)
  );
  const changeTextCb = useCallback(
    (text: string) => {
      dispatch(
        setCountryTerm({
          searchCountryTerm: text
        })
      );
    },
    [dispatch]
  );

  const SearchBar = (
    <View style={backgroundStyle}>
      <TextInput
        style={backgroundStyle}
        defaultValue={""}
        onChangeText={changeTextCb}
        label={translate("search")}
      />
    </View>
  );

  return (
    <FlatList
      keyboardShouldPersistTaps={"handled"}
      keyExtractor={keyExtractorParam ?? keyExtractor}
      ListEmptyComponent={NoItemsFound}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={flatListStyle}
      contentContainerStyle={flatListContainer}
      data={filteredData}
      renderItem={handleRenderItem}
      ListHeaderComponent={SearchBar}
    />
  );
};
export default CountrySelectorContent;
