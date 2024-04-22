import React, { useState, useCallback } from "react";
import { ListRenderItem, TouchableOpacity, View } from "react-native";

import { useTheme, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { ListSelectorItem, ListSelectorTypes } from "./ListSelector.types";

import { Country } from "~/apiServices/country/country.types";
import {CText, modalizeRef, TextInput} from "~/components/";
import bottomSheetStyle from "~/components/common/BottomSheet/BottomSheet.style";
import listSelectorStyle from "~/components/common/ListSelector/ListSelector.style";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { translate } from "~/translations/";

const ListSelector = (props: ListSelectorTypes): JSX.Element => {
  const { colors } = useTheme();

  const {
    containerStyle = { width: "100%", marginTop: 8 },
    defaultValue = "",
    list = [],
    label = "",
    value,
    renderItem,
    testID = "",
    hasSearch = true,
    renderContainer,
    ...restOfProps
  } = props;

  const [selection, setSelection] = useState(defaultValue);
  const [searchValue, setSearchValue] = useState("");
  const [filteredList, setFilteredList] = useState<Country[]>(list);

  const dispatch = useDispatch();

  const { flatListContainer, flatListStyle, backgroundStyle } = listSelectorStyle(colors);

  const selectedItem = value || selection;
  const changeTextCb = useCallback(
    (text: string) => {
      setSearchValue(text);
      setFilteredList(list.filter(item => item.name.startsWith(text)));
    },
    [list]
  );

  const SearchBar = useCallback(
    () => (
      <View style={backgroundStyle}>
        <TextInput
          style={backgroundStyle}
          value={searchValue}
          onChangeText={changeTextCb}
          label={translate("search")}
        />
      </View>
    ),
    [backgroundStyle, searchValue, changeTextCb]
  );

  const keyExtractor = (item: ListSelectorItem) => {
    return item?.name.toString();
  };

  const hideSheet = () => {
    modalizeRef.current?.close();
  };

  const handleSelected = useCallback((name: string) => {
    setSelection(name);
    hideSheet();
  }, []);

  const NoItemsFound = useCallback(
    () => <CText>{translate("no_items_found")}</CText>,
    []
  );

  const handleRenderItem: ListRenderItem<ListSelectorItem> = useCallback(
    ({ item }) => renderItem(item, item.name === selectedItem, handleSelected),
    [handleSelected, renderItem, selectedItem]
  );

  const showSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        props: {
          modalHeight: APP_SCREEN_HEIGHT * 0.8,
          flatListProps: {
            style: flatListStyle,
            contentContainerStyle: flatListContainer,
            data: filteredList,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            ListEmptyComponent: NoItemsFound,
            keyExtractor: keyExtractor,
            renderItem: handleRenderItem,
            keyboardShouldPersistTaps: "handled",
            ListHeaderComponent: hasSearch && SearchBar
          }
          // ,
          // HeaderComponent: hasSearch && SearchBar
        }
      })
    );
  }, [
    NoItemsFound,
    SearchBar,
    dispatch,
    filteredList,
    flatListContainer,
    flatListStyle,
    handleRenderItem,
    hasSearch
  ]);

  return (
    <View testID={testID} style={containerStyle} {...restOfProps}>
      <TouchableOpacity onPress={showSheet}>
        <View pointerEvents="none">
          {renderContainer ? (
            renderContainer(selectedItem)
          ) : (
            <TextInput value={selectedItem} label={label} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default ListSelector;
