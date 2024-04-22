import React, { FC, useEffect } from "react";
import { ListRenderItem, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import favouriteListStyles from "./favoriteList.styles";
import { getFavouriteListProps } from "./favouriteList.types";

import { RootState } from "~/redux/store";

import { IFavouriteList } from "~/apiServices/settings/settings.types";
import { CText, CustomFlatList } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { INITIAL_LOADER, FOOTER_LOADER, REFRESH_LOADER } from "~/constants/toggleState";
import { clearFavouriteList } from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { getFavouriteListThunk } from "~/redux/thunk/favorite.thunk";
import {
  GET_FAVORITES_LIST,
  GET_FAVORITES_LIST_FAILED,
  GET_FAVORITES_LIST_SUCCESS,
  FAVORITES_LIST_PRESSED,
  logEvent
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { logError } from "~/utils/";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

const FavoriteList: FC = () => {
  const { colors } = useTheme();

  const { itemContainer, flatListStyle } = favouriteListStyles(colors);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [getToggleState, setToggleState] = useToggleState([
    INITIAL_LOADER,
    REFRESH_LOADER,
    FOOTER_LOADER
  ]);

  const favouriteList = useSelector((state: RootState) => state.favorite.favouriteList);
  const { isEndReached, skey } =
    useSelector((state: RootState) => state.favorite.favouriteListPageDetails) || {};

  useEffect(() => {
    getFavouriteList({ loader: INITIAL_LOADER, reset: true });
    return () => {
      dispatch(clearFavouriteList());
    };
  }, []);

  const getFavouriteList = async ({ loader, reset, skey }: getFavouriteListProps) => {
    await logEvent(GET_FAVORITES_LIST, {
      source: "favorite_list_page",
      last_loaded_skey: skey,
      reset
    });
    setToggleState(loader, true);
    thunkDispatch(getFavouriteListThunk({ reset, skey }))
      .then(async () => {
        await logEvent(GET_FAVORITES_LIST_SUCCESS, {
          source: "favorite_list_page",
          last_loaded_skey: skey,
          reset
        });
      })
      .catch(async error => {
        logError(`Error in FavoriteList.tsx reset=${reset} with skey ${skey} ${error}`);
        await logEvent(GET_FAVORITES_LIST_FAILED, {
          source: "favorite_list_page",
          last_loaded_skey: skey,
          reset
        });
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setToggleState(loader);
      });
  };

  const onListItemPress = (item: IFavouriteList) => async () => {
    await logEvent(FAVORITES_LIST_PRESSED, {
      source: "favorite_list_page",
      skey: item.skey
    });
    navigation.navigate("FavoriteItems", { skey: item.skey });
  };

  const onRefresh = () => {
    getFavouriteList({ loader: REFRESH_LOADER, reset: true });
  };

  const onEndReached = () => {
    if (isEndReached) return;
    getFavouriteList({ loader: FOOTER_LOADER, skey });
  };

  const renderItem: ListRenderItem<IFavouriteList> = ({ item }) => {
    return (
      <TouchableOpacity style={itemContainer} onPress={onListItemPress(item)}>
        <CText fontSize={13}>{item.name}</CText>
        <CText fontSize={13}>{item.items_count}</CText>
      </TouchableOpacity>
    );
  };

  return (
    <CustomFlatList
      contentContainerStyle={flatListStyle}
      backgroundColor={colors.lightBackground}
      keyExtractor={item => item.skey}
      data={favouriteList}
      renderItem={renderItem}
      initialLoader={getToggleState(INITIAL_LOADER)}
      footerLoader={getToggleState(FOOTER_LOADER)}
      refreshing={getToggleState(REFRESH_LOADER)}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};

export { FavoriteList };
