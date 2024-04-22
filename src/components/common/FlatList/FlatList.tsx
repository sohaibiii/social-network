import React, { Fragment } from "react";
import { FlatList, FlatListProps, View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import style from "./FlatList.style";
import { CustomFlatListProps } from "./FlatList.types";

import { CircularLoader } from "~/components/";
import { translate } from "~/translations/swTranslator";

const CustomFlatList = <T,>(props: CustomFlatListProps<T>): JSX.Element => {
  const {
    initialLoader,
    flatListRef,
    footerLoader,
    emptyText,
    initialNumToRender = 2,
    showsVerticalScrollIndicator = false,
    showsHorizontalScrollIndicator = false,
    onEndReached,
    ListEmptyComponent,
    ListFooterComponent,
    refreshing,
    backgroundColor,
    initialSkeleton,
    ...rest
  } = props;

  const theme = useTheme();
  const {
    root,
    listEmptyComponentContainer,
    listEmptyComponentText,
    flatListContainerStyle,
    listFooterComponentStyle
  } = style(theme, backgroundColor);

  const initialSkeletons = Array(10).fill(null);
  const bottomSkeletons = Array(2).fill(null);
  // TODO we will setup it later
  // const hasNextPage = false;

  const DefaultListEmpty = () => {
    return (
      <View style={listEmptyComponentContainer}>
        <MaterialIcons name="error-outline" size={30} color={theme.colors.text} />
        <Text style={listEmptyComponentText}>
          {emptyText || translate("no_items_found")}
        </Text>
      </View>
    );
  };

  const DefaultListFooter = () => {
    if (!footerLoader) return null;
    return (
      <View style={listFooterComponentStyle}>
        {initialSkeleton ? (
          bottomSkeletons.map((_, index) => (
            <Fragment key={index}>{initialSkeleton}</Fragment>
          ))
        ) : (
          <CircularLoader />
        )}
      </View>
    );
  };

  const handleListEnd: FlatListProps<T>["onEndReached"] = e => {
    if (!initialLoader && !footerLoader && !refreshing && onEndReached) onEndReached(e);
  };

  return (
    <View style={root}>
      {initialLoader ? (
        initialSkeleton ? (
          initialSkeletons.map((_, index) => (
            <Fragment key={index}>{initialSkeleton}</Fragment>
          ))
        ) : (
          <CircularLoader />
        )
      ) : (
        <FlatList
          contentContainerStyle={flatListContainerStyle}
          ref={flatListRef}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          ListEmptyComponent={ListEmptyComponent || DefaultListEmpty}
          initialNumToRender={initialNumToRender}
          ListFooterComponent={ListFooterComponent || DefaultListFooter}
          onEndReached={handleListEnd}
          refreshing={refreshing}
          {...rest}
        />
      )}
    </View>
  );
};

export { CustomFlatList };
