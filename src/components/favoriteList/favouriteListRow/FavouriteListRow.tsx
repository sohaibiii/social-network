import React, { FC } from "react";
import { TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import FavouriteListRowStyles from "./favouriteListRow.styles";
import { FavouriteListRowProps } from "./favouriteListRow.types";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { setSelectListId } from "~/redux/reducers/favorite.slice";

const FavouriteListRow: FC<FavouriteListRowProps> = props => {
  const { item } = props;

  const { colors } = useTheme();
  const dispatch = useDispatch();

  const selectListIds = useSelector((state: RootState) => state.favorite.selectListIds);

  const { headerItemContainer, radioButtonStyle, listNameStyle } =
    FavouriteListRowStyles(colors);

  const iconName = (skey: string) => {
    let result = "";

    if (selectListIds?.includes(skey)) {
      result = "radio-btn-active";
    } else {
      result = "radio-btn-passive";
    }

    return result;
  };

  const iconColor = (skey: string) => {
    let result = "";

    if (selectListIds?.includes(skey)) {
      result = colors.primary;
    } else {
      result = colors.gray;
    }

    return result;
  };

  const onItemPress = (skey: string) => () => {
    dispatch(setSelectListId(skey));
  };

  return (
    <TouchableOpacity style={headerItemContainer} onPress={onItemPress(item.skey)}>
      <Icon
        type={IconTypes.FONTISTO}
        name={iconName(item.skey)}
        size={20}
        color={iconColor(item.skey)}
        style={radioButtonStyle}
      />
      <CText fontSize={14} style={listNameStyle}>
        {item.name}
      </CText>
    </TouchableOpacity>
  );
};

export { FavouriteListRow };
