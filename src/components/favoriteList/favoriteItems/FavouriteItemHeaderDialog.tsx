import React, { FC, memo, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";

import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import favouriteItemsStyles from "./favoriteItems.styles";
import { FavouriteItemHeaderDialogProps } from "./favouriteItems.types";

import { RootState } from "~/redux/store";

import { TextInput } from "~/components/common";
import { PLATFORM } from "~/constants/variables";
import { setShowEditFavouriteListNameDialog } from "~/redux/reducers/favorite.slice";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { updateFavouriteListNameThunk } from "~/redux/thunk/favorite.thunk";
import { FAVORITE_ITEMS_LIST_NAME_EDITED, logEvent } from "~/services/";
import { translate } from "~/translations/swTranslator";
import { thunkDispatch } from "~/utils/reduxUtil";
import { verticalScale } from "~/utils/responsivityUtil";

const FavouriteItemHeaderDialog: FC<FavouriteItemHeaderDialogProps> = props => {
  const { name = "", skey } = props;

  const { colors } = useTheme();
  const { t } = useTranslation();

  const { flexStyle, menuDeleteItemStyle, editNameInputStyle, dialogTitleStyle } =
    favouriteItemsStyles(colors);

  const [isSaving, setIsSaving] = useState(false);
  const [listName, setListName] = useState("");

  const dispatch = useDispatch();

  const showEditFavouriteListNameDialog = useSelector(
    (state: RootState) => state.favorite.showEditFavouriteListNameDialog
  );

  useEffect(() => {
    setListName(name);
  }, [name, showEditFavouriteListNameDialog]);

  const hideDialog = () => dispatch(setShowEditFavouriteListNameDialog(false));

  const onEditPress = async () => {
    const name = listName.trim();
    if (!name) return;
    setIsSaving(true);
    await logEvent(FAVORITE_ITEMS_LIST_NAME_EDITED, {
      source: "favorite_items_header_dialog",
      name,
      skey
    });

    thunkDispatch(updateFavouriteListNameThunk({ name, skey }))
      .catch(() => {
        dispatch(
          showSnackbar({
            visible: true,
            duration: 3000,
            text: t("name_already_exists"),
            backgroundColor: "red",
            textColor: colors.white
          })
        );
      })
      .finally(() => {
        hideDialog();
        setIsSaving(false);
      });
  };

  return (
    showEditFavouriteListNameDialog && (
      <Portal>
        <KeyboardAvoidingView
          behavior={PLATFORM === "ios" ? "padding" : "height"}
          style={flexStyle}
          keyboardVerticalOffset={verticalScale(-100)}
        >
          <ScrollView
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={flexStyle}
            bounces={false}
          >
            <Dialog dismissable={false} visible={true} onDismiss={hideDialog}>
              <Dialog.Title style={dialogTitleStyle}>
                {translate("edit_name")}
              </Dialog.Title>
              <Dialog.Content>
                <TextInput
                  style={editNameInputStyle}
                  value={listName}
                  label={translate("rename_your_list")}
                  autoFocus
                  maxLength={30}
                  onChangeText={setListName}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={onEditPress} loading={isSaving} disabled={isSaving}>
                  {translate("edit")}
                </Button>
                <Button onPress={hideDialog} labelStyle={menuDeleteItemStyle}>
                  {translate("cancel")}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
    )
  );
};

export default memo(FavouriteItemHeaderDialog);
