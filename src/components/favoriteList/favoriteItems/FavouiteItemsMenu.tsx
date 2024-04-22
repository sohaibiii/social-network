import React, { FC, memo, useRef } from "react";
import { TouchableOpacity } from "react-native";

import { Menu, useTheme } from "react-native-paper";
import { batch, useDispatch } from "react-redux";

import favouriteItemsStyles from "./favoriteItems.styles";
import { FavouiteItemsMenuProps } from "./favouriteItems.types";

import { Icon, IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  setSelectFavouritemSkey,
  setSelectFavouritemPkey
} from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { checkIsFavouriteThunk, deleteListItemThunk } from "~/redux/thunk/favorite.thunk";
import {
  logEvent,
  FAVORITE_ITEMS_SHOW_MENU,
  FAVORITE_ITEMS_MENU_DELETE_PROPERTY_FAILED,
  FAVORITE_ITEMS_MENU_DELETE_PROPERTY_SUCCESS,
  FAVORITE_ITEMS_MENU_MOVE_TO_ANOTHER_LIST
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { logError } from "~/utils/";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

const ITEM_MENU = "ITEM_MENU";
const FavouiteItemsMenu: FC<FavouiteItemsMenuProps> = props => {
  const { skey, pkey, setIsVisible } = props;

  const { colors } = useTheme();
  const { menuDeleteItemStyle, optionsContainer } = favouriteItemsStyles(colors);

  const dispatch = useDispatch();

  const [getToggleState, setToggleState] = useToggleState([ITEM_MENU]);

  const onDismiss = () => {
    setToggleState(ITEM_MENU);
  };

  const onOptionsPress = async () => {
    await logEvent(FAVORITE_ITEMS_SHOW_MENU, {
      source: "favorite_items_menu",
      pkey,
      skey
    });
    setToggleState(ITEM_MENU, true);
  };

  const onMoveToAntherListPress = async () => {
    await logEvent(FAVORITE_ITEMS_MENU_MOVE_TO_ANOTHER_LIST, {
      source: "favorite_items_menu",
      pkey,
      skey
    });

    batch(() => {
      dispatch(setSelectFavouritemPkey(pkey));
      dispatch(setSelectFavouritemSkey(skey));
      thunkDispatch(checkIsFavouriteThunk(pkey)).finally(() => {
        setIsVisible(true);
      });
    });

    onDismiss();
  };

  const onDeletePress = () => {
    thunkDispatch(deleteListItemThunk({ skeys: [skey], pkey }))
      .then(async () => {
        await logEvent(FAVORITE_ITEMS_MENU_DELETE_PROPERTY_SUCCESS, {
          source: "favorite_items_menu",
          pkey,
          skey
        });
      })
      .catch(async error => {
        await logEvent(FAVORITE_ITEMS_MENU_DELETE_PROPERTY_FAILED, {
          source: "favorite_items_menu"
        });
        logError(`Error in FavouriteItemsMenu ${error}`);
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
        onDismiss();
      });
  };

  const menuItems = [
    {
      onPress: onMoveToAntherListPress,
      title: translate("move_to_anther_list")
    },
    {
      onPress: onDeletePress,
      title: translate("delete"),
      titleStyle: menuDeleteItemStyle
    }
  ];

  return (
    <>
      <Menu
        visible={!!getToggleState(ITEM_MENU)}
        onDismiss={onDismiss}
        anchor={
          <TouchableOpacity style={optionsContainer} onPress={onOptionsPress}>
            <Icon
              name="dots-three-vertical"
              type={IconTypes.ENTYPO}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        }
      >
        {menuItems.map((menu, index) => (
          <Menu.Item key={index} {...menu} />
        ))}
      </Menu>
    </>
  );
};

export default memo(FavouiteItemsMenu);
