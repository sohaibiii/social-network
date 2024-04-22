import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ListRenderItem, TouchableOpacity, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/core";
import moment from "moment/moment";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { FavoriteItemsRow } from "../";

import favouriteItemsStyles from "./favoriteItems.styles";
import FavouriteItemHeaderDialog from "./FavouriteItemHeaderDialog";
import FavouriteItemsHeaderMenu from "./FavouriteItemsHeaderMenu";

import { RootState } from "~/redux/store";

import { CustomFlatList, Icon, IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { APP_SCREEN_WIDTH, PLATFORM } from "~/constants/";
import { FOOTER_LOADER, INITIAL_LOADER, REFRESH_LOADER } from "~/constants/toggleState";
import { FavoriteItemModal } from "~/containers/favoriteList";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { setSurroundingLandmarkData } from "~/redux/reducers/surroundingLandmarks.reducer";
import { getFavoriteListById } from "~/redux/selectors/favorite";
import {
  deleteListItemThunk,
  getFavouriteListItemsThunk
} from "~/redux/thunk/favorite.thunk";
import {
  logEvent,
  FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS,
  FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS_SUCCESS,
  FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS_FAILED,
  FAVORITE_ITEMS_NAVIGATE_TO_MAP,
  FAVORITE_ITEMS_REMOVE_PROPERTY_FROM_LIST
} from "~/services/";
import { requestLocationPermission, getLocation } from "~/services/location/location";
import { translate } from "~/translations/swTranslator";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

const LIMIT = 10;
const FavoriteItems: FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { colors } = useTheme();

  const { flatListStyle, headerRightContainer, headerRightIconContainer } =
    favouriteItemsStyles(colors);

  const { skey } = params as { skey: string };

  const favoriteListById = useMemo(() => getFavoriteListById(skey), [skey]);
  const { name } = useSelector(favoriteListById) || {};

  const [isVisible, setIsVisible] = useState(false);
  const page = useRef(1);
  const hasNext = useRef(true);
  const [getToggleState, setToggleState] = useToggleState([
    INITIAL_LOADER,
    REFRESH_LOADER,
    FOOTER_LOADER
  ]);

  const favouriteListItemsIds = useSelector(
    (state: RootState) => state.favorite.favouriteListItemsIds
  );

  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerTitleStyle: {
        maxWidth: APP_SCREEN_WIDTH - (PLATFORM === "android" ? 160 : 200),
        marginStart: PLATFORM === "android" ? 40 : 0
      },
      headerRight: () => (
        <View style={headerRightContainer}>
          {favouriteListItemsIds?.length ? (
            <TouchableOpacity onPress={onMapPress} style={headerRightIconContainer}>
              <Icon
                disabled
                type={IconTypes.SAFARWAY_ICONS}
                name="map"
                height={28}
                width={28}
                color={colors.gray}
              />
            </TouchableOpacity>
          ) : null}
          <FavouriteItemsHeaderMenu skey={skey} />
        </View>
      )
    });
  }, [navigation, name, skey, favouriteListItemsIds]);

  useEffect(() => {
    getFavouriteListItems({ loader: INITIAL_LOADER, page: 1, limit: LIMIT });
  }, []);

  const onMapPress = async () => {
    await requestLocationPermission();
    const location = await getLocation();
    if (!location) return;
    dispatch(
      setSurroundingLandmarkData({
        data: favouriteListItemsIds.length ? favouriteListItemsIds : undefined,
        location
      })
    );
    await logEvent(FAVORITE_ITEMS_NAVIGATE_TO_MAP, {
      source: "favorite_items_list"
    });
    navigation.navigate({
      name: "SurroundingLandmarks",
      key: `${moment().unix()}`,
      params: { showMyLocation: false }
    });
  };

  const getFavouriteListItems = async ({
    loader,
    page,
    limit
  }: {
    loader: string;
    page: number;
    limit: number;
  }) => {
    setToggleState(loader, true);
    await logEvent(FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS, {
      source: "favorite_items_list",
      skey,
      page,
      limit
    });

    thunkDispatch(getFavouriteListItemsThunk({ skey, page, limit }))
      .then(async res => {
        hasNext.current = res?.metadata?.hasNext;
        await logEvent(FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS_SUCCESS, {
          source: "favorite_items_list",
          skey,
          page,
          limit
        });
      })
      .catch(async error => {
        await logEvent(FAVORITE_ITEMS_GET_FAVORITE_LIST_ITEMS_FAILED, {
          source: "favorite_items_list",
          skey,
          page,
          limit
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

  const onRefresh = () => {
    getFavouriteListItems({ loader: REFRESH_LOADER, page: 1, limit: LIMIT });
  };

  const renderItem: ListRenderItem<string> = useCallback(({ item }) => {
    return (
      <FavoriteItemsRow id={item} key={item} skey={skey} setIsVisible={setIsVisible} />
    );
  }, []);

  const keyExtractor = useCallback(item => item, []);

  const handleFavouritePressed = useCallback(async (_, pkey) => {
    await logEvent(FAVORITE_ITEMS_REMOVE_PROPERTY_FROM_LIST, {
      source: "favorite_items_list",
      pkey,
      skey
    });
    thunkDispatch(deleteListItemThunk({ skeys: [skey], pkey }));
  }, []);

  const onEndReached = useCallback(() => {
    if (hasNext.current) {
      page.current = page.current + 1;
      getFavouriteListItems({ loader: FOOTER_LOADER, page: page.current, limit: LIMIT });
    }
  }, [getFavouriteListItems]);

  return (
    <>
      <FavoriteItemModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        isMoveToAnother
        handleFavouritePressed={handleFavouritePressed}
      />
      <FavouriteItemHeaderDialog name={name} skey={skey} />
      <CustomFlatList
        contentContainerStyle={flatListStyle}
        keyExtractor={keyExtractor}
        data={favouriteListItemsIds}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        initialLoader={getToggleState(INITIAL_LOADER)}
        footerLoader={getToggleState(FOOTER_LOADER)}
        refreshing={getToggleState(REFRESH_LOADER)}
        onRefresh={onRefresh}
      />
    </>
  );
};

export { FavoriteItems };
