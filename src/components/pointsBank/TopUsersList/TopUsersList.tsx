import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useState,
  memo,
  useCallback
} from "react";
import { ListRenderItem, FlatListProps, TouchableOpacity, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { NativeStackHeaderProps } from "@react-navigation/native-stack/src/types";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import TopUserItem from "./TopUserItem";
import topUsersStyle from "./TopUsersList.styles";
import { TopUsersListProps } from "./TopUsersList.types";

import { RootState } from "~/redux/store";

import { userAPI } from "~/apis/";
import { getTopUsersAPI } from "~/apis/pointsBank";
import { IconTypes, Icon, CText, CustomHeader } from "~/components/";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import { PointsBankSkeleton } from "~/components/pointsBank";
import { TOP_20_AD } from "~/constants/";
import {
  logEvent,
  TOP_20_VISITED,
  SHARE_TOP_20_INITIATED,
  SHARE_TOP_20_SUCCESS,
  SHARE_TOP_20_FAILED
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { translate } from "~/translations/swTranslator";
import { scale } from "~/utils/";
import { generalErrorHandler } from "~/utils/";
import { logError } from "~/utils/errorHandler";

const ShareButton = () => {
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { colors } = useTheme();

  const { buttonLabelStyle, buttonStyle } = topUsersStyle(colors);

  const onPublishPress = async () => {
    setIsLoadingShare(true);
    setDisabled(true);

    await logEvent(SHARE_TOP_20_INITIATED, {
      source: "points_bank_page",
      action: DynamicLinksAction.TOP_20
    });

    handleCreateShareLink({
      params: {},
      title: translate("top20Title"),
      action: DynamicLinksAction.TOP_20
    })
      .then(link => {
        return showShareView(link);
      })
      .then(async shareRes => {
        await logEvent(SHARE_TOP_20_SUCCESS, {
          source: "points_bank_page",
          action: DynamicLinksAction.TOP_20,
          ...shareRes
        });
        setDisabled(false);
      })
      .catch(async error => {
        setDisabled(true);
        logError(`Error: handleCreateShareLink --TopUsersList.tsx-- ${error}`);
        generalErrorHandler(`Error: handleCreateShareLink --TopUsersList.tsx ${error}`);
        await logEvent(SHARE_TOP_20_FAILED, {
          source: "points_bank_page",
          action: DynamicLinksAction.TOP_20
        });
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  };

  return (
    <TouchableOpacity
      onPress={onPublishPress}
      style={buttonStyle}
      disabled={isLoadingShare || disabled}
    >
      <Icon type={IconTypes.FONTISTO} name="share" size={scale(16)} color={"white"} />
      <CText style={buttonLabelStyle} fontSize={14} lineHeight={18} color={"white"}>
        {translate("share")}
      </CText>
      {isLoadingShare && <ActivityIndicator color={"white"} size={scale(16)} />}
    </TouchableOpacity>
  );
};

const TopUsersList: FC = () => {
  const navigation = useNavigation();
  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[TOP_20_AD.config];

  const [topUsers, setTopUsers] = useState<TopUsersListProps[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: (props: NativeStackHeaderProps) => (
        <CustomHeader
          {...props}
          options={{
            ...props.options,
            headerRight: ShareButton
          }}
        />
      )
    });
  }, []);

  useEffect(() => {
    getTopUsers().then(async () => {
      await logEvent(TOP_20_VISITED, { source: "points_bank_page" });
    });
  }, []);

  const getTopUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const topUsersData = await getTopUsersAPI("7");
      const userIds = topUsersData.map(data => data.user);

      const data = await userAPI.getUsersListAPI({ users: userIds });

      const response = data.users.map(user => ({
        ...user,
        points: topUsersData.find(u => u.user === user.uuid)?.points
      }));

      setTopUsers(response);
    } catch (error) {
      logError(`Error: getTopUsersAPI --TopUsersList.tsx-- ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    getTopUsers().finally(() => {
      setIsRefreshing(false);
    });
  }, [getTopUsers]);

  const renderItem: ListRenderItem<TopUsersListProps> = useCallback(
    ({ item, index }) => <TopUserItem item={item} index={index} />,
    []
  );

  const keyExtractor: FlatListProps<TopUsersListProps>["keyExtractor"] = useCallback(
    item => item.uuid + "",
    []
  );

  const renderListHeader = useCallback(() => {
    return <AdsItem adId={TOP_20_AD.id} config={config} />;
  }, [config]);

  return (
    <>
      {isLoading ? (
        <PointsBankSkeleton />
      ) : (
        <FlatList
          keyExtractor={keyExtractor}
          data={topUsers}
          renderItem={renderItem}
          ListHeaderComponent={renderListHeader}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
      )}
    </>
  );
};

export default memo(TopUsersList);
