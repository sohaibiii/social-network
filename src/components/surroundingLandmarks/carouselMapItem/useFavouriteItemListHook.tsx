import React, { useEffect } from "react";
import { View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import carouselMapItemStyle from "./carouselMapItem.styles";

import { RootState } from "~/redux/store";

import { CircularLoader } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FavouriteListRow } from "~/components/favoriteList/favouriteListRow";
import { FOOTER_LOADER, INITIAL_LOADER, REFRESH_LOADER } from "~/constants/toggleState";
import { getFavouriteListProps } from "~/containers/favoriteList/favouriteList.types";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { getFavouriteListThunk } from "~/redux/thunk/favorite.thunk";
import { translate } from "~/translations/swTranslator";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

let isFirstRender = true;
export const useFavouriteItemListHook = (isMoveToAnother?: boolean) => {
  const dispatch = useDispatch();
  const { loaderStyle, contentContainerStyle } = carouselMapItemStyle;

  const { isEndReached, skey } =
    useSelector((state: RootState) => state.favorite.favouriteListPageDetails) || {};
  const favouriteList =
    useSelector((state: RootState) => state.favorite.favouriteList) || [];

  const preSelectedFavouriteItems = useSelector(
    (state: RootState) => state.favorite.preSelectedFavouriteItems
  );

  const [getToggleState, setToggleState] = useToggleState([
    INITIAL_LOADER,
    REFRESH_LOADER,
    FOOTER_LOADER
  ]);

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
    } else if (getToggleState(INITIAL_LOADER)) {
      return;
    }

    let isReachedEnd = false;
    dispatch(
      showBottomSheet({
        customProps: {
          flatListProps: {
            data: favouriteList.filter(item =>
              isMoveToAnother
                ? !preSelectedFavouriteItems?.includes(item?.skey) && item?.skey !== skey
                : item?.skey !== skey
            ),
            renderItem: ({ item }) => <FavouriteListRow item={item} />,
            onEndReached: () => {
              if (!isReachedEnd && !isEndReached && !getToggleState(FOOTER_LOADER)) {
                getFavouriteList({ loader: FOOTER_LOADER, skey });
                isReachedEnd = true;
              }
            },
            onRefresh: () => {
              getFavouriteList({ loader: REFRESH_LOADER, reset: true });
            },
            refreshing: !!getToggleState(REFRESH_LOADER),
            contentContainerStyle: contentContainerStyle,
            ListFooterComponent: () => {
              if (!getToggleState(FOOTER_LOADER)) return null;
              return (
                <View style={loaderStyle}>
                  <CircularLoader />
                </View>
              );
            }
          }
        }
      })
    );
  }, [
    isEndReached,
    skey,
    getToggleState(INITIAL_LOADER),
    getToggleState(REFRESH_LOADER),
    getToggleState(FOOTER_LOADER),
    favouriteList,
    preSelectedFavouriteItems
  ]);

  const getFavouriteList = ({ loader, reset, skey }: getFavouriteListProps) => {
    setToggleState(loader, true);
    thunkDispatch(getFavouriteListThunk({ reset, skey }))
      .catch(error => {
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
  return null;
};
