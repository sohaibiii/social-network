import React, { FC, useEffect, useState } from "react";
import { View, ListRenderItem, TouchableOpacity } from "react-native";

import { useDispatch } from "react-redux";

import blockListStyles from "./blockList.styles";

import settingsService from "~/apiServices/settings";
import { CText, CustomFlatList } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { UserProfileItem } from "~/components/common/UserProfileItem";
import { setIsRefreshing } from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  BLOCK_LIST_VISITED,
  UNBLOCK_USER,
  UNBLOCK_USER_FAILED,
  UNBLOCK_USER_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/swTranslator";
import { SimpleUser } from "~/types/user";

const BlockList: FC = () => {
  const { root, rowContainer } = blockListStyles;

  const [blockList, setBlockList] = useState<SimpleUser[] | undefined>([]);

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    settingsService
      .getBlockList()
      .then(response => {
        setBlockList(response);
        return logEvent(BLOCK_LIST_VISITED, { source: "block_list_page" });
      })
      .catch(e => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 3000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onRemoveBanPress = (uuid: string) => async () => {
    await logEvent(UNBLOCK_USER, { source: "block_list_page" });
    settingsService
      .unblockUserRequest(uuid)
      .then(() => {
        setBlockList(pre => pre?.filter(user => user.uuid !== uuid));
        dispatch(setIsRefreshing({}));
        return logEvent(UNBLOCK_USER_SUCCESS, { source: "block_list_page", uuid });
      })
      .catch(async error => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 3000,
            backgroundColor: "red"
          })
        );
        await logEvent(UNBLOCK_USER_FAILED, { source: "block_list_page" });
      });
  };

  const renderItem: ListRenderItem<SimpleUser> = ({ item }) => {
    return (
      <View style={rowContainer}>
        <UserProfileItem user={item} />
        <TouchableOpacity onPress={onRemoveBanPress(item.uuid)}>
          <CText fontSize={12} color="error">
            {translate("remove_ban")}
          </CText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <CustomFlatList
      data={blockList}
      renderItem={renderItem}
      initialLoader={isLoading}
      contentContainerStyle={root}
    />
  );
};

export { BlockList };
