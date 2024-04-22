import React, { FC, useState } from "react";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { batch, useDispatch, useSelector } from "react-redux";

import FavouriteListRowStyles from "./favouriteListRow.styles";
import { MoveToAnotherListFooterProps } from "./favouriteListRow.types";

import { RootState } from "~/redux/store";

import { Button } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  setFavouriteListModalTextInputValue,
  setNewFavouriteListMode
} from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  createFavouriteListThunk,
  deleteListItemThunk,
  favoriteItemThunk
} from "~/redux/thunk/favorite.thunk";
import {
  FAVORITE_ITEMS_MODAL_GET_FAVORITES,
  logEvent,
  FAVORITE_ITEMS_MODAL_CREATE_LIST,
  FAVORITE_ITEMS_MODAL_ADD_TO_LIST_SUCCESS,
  FAVORITE_ITEMS_MODAL_ADD_TO_LIST_FAILED,
  FAVORITE_ITEMS_MODAL_ADD_TO_LIST
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { thunkDispatch } from "~/utils/reduxUtil";

const MoveToAnotherListFooter: FC<MoveToAnotherListFooterProps> = props => {
  const { setIsVisible } = props;

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { footerRoot, footerButtonLabelStyle } = FavouriteListRowStyles(colors);

  const [isLoading, setIsLoading] = useState(false);

  const selectListIds = useSelector((state: RootState) => state.favorite.selectListIds);
  const preSelectedFavouriteItems = useSelector(
    (state: RootState) => state.favorite.preSelectedFavouriteItems
  );

  const selectFavouritePkey = useSelector(
    (state: RootState) => state.favorite.selectFavouritePkey
  );
  const selectFavouriteSkey = useSelector(
    (state: RootState) => state.favorite.selectFavouriteSkey
  );
  const modalTextInputValue = useSelector(
    (state: RootState) => state.favorite.modalTextInputValue
  );
  const deletedFavouriteItemIds = useSelector(
    (state: RootState) => state.favorite.deletedFavouriteItemIds
  );
  const isFavorite = useSelector((state: RootState) => state.favorite.isFavorite);

  const isDefaultValues =
    preSelectedFavouriteItems?.length && selectListIds.length
      ? selectListIds.find(id => !preSelectedFavouriteItems?.includes(id))
      : !!selectListIds.length;

  const buttonStyle = {
    backgroundColor:
      isDefaultValues || modalTextInputValue || deletedFavouriteItemIds?.length
        ? colors.primary
        : colors.gray,
    borderRadius: 25
  };

  const buttonTitle =
    isDefaultValues || modalTextInputValue || deletedFavouriteItemIds?.length
      ? translate("done")
      : translate("cancel");

  const onButtonPress = async () => {
    await logEvent(FAVORITE_ITEMS_MODAL_ADD_TO_LIST, {
      source: "favorite_list_footer",
      name: modalTextInputValue
    });

    if (modalTextInputValue) {
      await logEvent(FAVORITE_ITEMS_MODAL_CREATE_LIST, {
        source: "favorite_list_footer",
        name: modalTextInputValue
      });

      batch(() => {
        thunkDispatch(createFavouriteListThunk(modalTextInputValue)).catch(error => {
          dispatch(
            showSnackbar({
              text: t("list_name_already_exist"),
              type: SnackbarVariations.TOAST,
              duration: 2000,
              backgroundColor: "red"
            })
          );
        });
        dispatch(setFavouriteListModalTextInputValue(""));
        dispatch(setNewFavouriteListMode(false));
      });
    } else if (isDefaultValues || deletedFavouriteItemIds?.length) {
      if (deletedFavouriteItemIds?.length || (selectFavouriteSkey && isFavorite)) {
        setIsLoading(true);

        thunkDispatch(
          deleteListItemThunk({
            skeys: deletedFavouriteItemIds?.length
              ? deletedFavouriteItemIds
              : [selectFavouriteSkey],
            pkey: selectFavouritePkey
          })
        )
          .then(() => {
            setIsVisible(false);
          })

          .catch(() => {
            dispatch(
              showSnackbar({
                text: t("something_went_wrong"),
                type: SnackbarVariations.TOAST,
                duration: 2000,
                backgroundColor: "red"
              })
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }

      const _skeys = selectListIds.filter(
        id =>
          id !== selectFavouriteSkey &&
          !deletedFavouriteItemIds?.includes(id) &&
          !preSelectedFavouriteItems?.includes(id)
      );

      if (_skeys?.length) {
        setIsLoading(true);
        thunkDispatch(
          favoriteItemThunk({
            skeys: _skeys,
            pkey: selectFavouritePkey
          })
        )
          .then(async () => {
            await logEvent(FAVORITE_ITEMS_MODAL_ADD_TO_LIST_SUCCESS, {
              source: "favorite_list_footer",
              name: modalTextInputValue
            });
            setIsVisible(false);
          })
          .catch(async () => {
            await logEvent(FAVORITE_ITEMS_MODAL_ADD_TO_LIST_FAILED, {
              source: "favorite_list_footer",
              name: modalTextInputValue
            });

            dispatch(
              showSnackbar({
                text: t("something_went_wrong"),
                type: SnackbarVariations.TOAST,
                duration: 2000,
                backgroundColor: "red"
              })
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setIsVisible(false);
    }
  };

  return (
    <View style={footerRoot}>
      <Button
        onPress={onButtonPress}
        title={buttonTitle}
        style={buttonStyle}
        labelStyle={footerButtonLabelStyle}
        isLoading={isLoading}
      />
    </View>
  );
};

export { MoveToAnotherListFooter };
