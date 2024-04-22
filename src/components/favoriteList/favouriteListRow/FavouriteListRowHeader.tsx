import React, { FC } from "react";
import { View, TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import FavouriteListRowStyles from "./favouriteListRow.styles";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes, TextInput } from "~/components/common";
import {
  setFavouriteListModalTextInputValue,
  setNewFavouriteListMode
} from "~/redux/reducers/favorite.slice";
import { translate } from "~/translations/swTranslator";

const MoveToAnotherListHeader: FC = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { headerItemContainer, headerItemRoot, headerIconStyle, handleStyle } =
    FavouriteListRowStyles(colors);

  const newListMode = useSelector((state: RootState) => state.favorite.newListMode);

  const onNewListPress = () => {
    dispatch(setNewFavouriteListMode(!newListMode));
    dispatch(setFavouriteListModalTextInputValue(""));
  };

  const onTextChangeDebounce = useDebouncedCallback(value => {
    dispatch(setFavouriteListModalTextInputValue(value));
  }, 200);

  const iconName = newListMode ? "minus-circle" : "plus-circle";
  const iconColor = newListMode ? colors.error : colors.gray;

  return (
    <View style={headerItemRoot}>
      <TouchableOpacity style={headerItemContainer} onPress={onNewListPress}>
        <Icon
          name={iconName}
          type={IconTypes.FONTAWESOME}
          color={iconColor}
          size={25}
          style={headerIconStyle}
        />
        <CText fontSize={14}>{translate("new_list")}</CText>
      </TouchableOpacity>
      {newListMode && (
        <TextInput
          label={translate("list_name")}
          onChangeText={onTextChangeDebounce}
          maxLength={30}
        />
      )}
    </View>
  );
};

export { MoveToAnotherListHeader };
