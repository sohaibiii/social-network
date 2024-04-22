import React, { FC, memo, useState } from "react";
import { StatusBar, InteractionManager, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";
import Modal from "react-native-modal";
import { Menu, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import favouriteItemsStyles from "./favoriteItems.styles";

import { ConfirmationModal, Icon, IconTypes } from "~/components/common";
import { setShowEditFavouriteListNameDialog } from "~/redux/reducers/favorite.slice";
import { deleteListByIdThunk } from "~/redux/thunk/favorite.thunk";
import {
  logEvent,
  FAVORITE_ITEMS_HEADER_MENU_CLICKED,
  FAVORITE_ITEMS_SHOW_EDIT_LIST_NAME_MODAL,
  FAVORITE_ITEMS_SHOW_DELETE_LIST_MODAL,
  FAVORITE_ITEMS_DELETE_LIST_SUCCESS,
  FAVORITE_ITEMS_DELETE_LIST_FAILED,
  FAVORITE_ITEMS_DELETE_LIST
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { logError } from "~/utils/";
import { useToggleState } from "~/utils/hooks";
import { thunkDispatch } from "~/utils/reduxUtil";

const HEADER_MENU = "HEADER_MENU";

const FavouriteItemsHeaderMenu: FC<{ skey: string }> = ({ skey }) => {
  const { colors } = useTheme();
  const { headerRightIconContainer, menuDeleteItemStyle } = favouriteItemsStyles(colors);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [getToggleState, setToggleState] = useToggleState([HEADER_MENU]);
  const [isCloseDialogVisible, setIsCloseDialogVisible] = useState(false);

  const onEditButtonPress = async () => {
    await logEvent(FAVORITE_ITEMS_HEADER_MENU_CLICKED, {
      source: "favorite_items_header_menu"
    });
    setToggleState(HEADER_MENU, true);
  };

  const onEditNamePress = async () => {
    await logEvent(FAVORITE_ITEMS_SHOW_EDIT_LIST_NAME_MODAL, {
      source: "favorite_items_header_menu"
    });
    onDismiss();
    dispatch(setShowEditFavouriteListNameDialog(true));
  };

  const onDismiss = () => {
    setToggleState(HEADER_MENU);
  };

  const onDeleteListPress = async () => {
    onDismiss();
    await logEvent(FAVORITE_ITEMS_SHOW_DELETE_LIST_MODAL, {
      source: "favorite_items_header_menu"
    });
    onDeletePress();
  };

  const onDeletePress = async () => {
    await logEvent(FAVORITE_ITEMS_DELETE_LIST, {
      source: "favorite_items_header_menu",
      skey
    });
    setIsCloseDialogVisible(true);
  };

  const hideSheet = () => {
    setIsCloseDialogVisible(false);
  };

  const onConfirmCb = () => {
    hideSheet();
    thunkDispatch(deleteListByIdThunk(skey))
      .then(async () => {
        await logEvent(FAVORITE_ITEMS_DELETE_LIST_SUCCESS, {
          source: "favorite_items_header_menu",
          skey
        });

        InteractionManager.runAfterInteractions(() => {
          navigation.goBack();
        });
      })
      .catch(async error => {
        logError(
          `Error: deleteListByIdThunk --FavouriteItemsHeaderMenu.tsx-- skey=${skey} ${error}`
        );
        await logEvent(FAVORITE_ITEMS_DELETE_LIST_FAILED, {
          source: "favorite_items_header_menu",
          skey
        });
      });
  };

  const menuItems = [
    {
      onPress: onEditNamePress,
      title: translate("edit_name")
    },
    {
      onPress: onDeleteListPress,
      title: translate("delete_list"),
      titleStyle: menuDeleteItemStyle
    }
  ];

  return (
    <>
      <Modal
        onBackButtonPress={hideSheet}
        isVisible={isCloseDialogVisible}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        onBackdropPress={hideSheet}
        onSwipeComplete={hideSheet}
        onDismiss={hideSheet}
      >
        <ConfirmationModal
          description={translate("deleteConfirmation")}
          cancelTitle={translate("cancel")}
          confirmText={translate("confirm")}
          confirmColor={colors.red}
          onConfirmCb={onConfirmCb}
          onExitCb={hideSheet}
        />
      </Modal>
      <Menu
        visible={!!getToggleState(HEADER_MENU)}
        onDismiss={onDismiss}
        statusBarHeight={StatusBar?.currentHeight}
        anchor={
          <TouchableOpacity onPress={onEditButtonPress} style={headerRightIconContainer}>
            <Icon
              name="menu"
              type={IconTypes.ENTYPO}
              size={28}
              color={colors.gray}
              disabled
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

export default memo(FavouriteItemsHeaderMenu);
