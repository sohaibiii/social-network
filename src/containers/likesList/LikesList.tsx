import React, { useEffect, useState, useCallback, useLayoutEffect, useRef } from "react";
import { View, SafeAreaView, FlatList } from "react-native";

import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import styles from "./LikesList.styles";

import postService from "~/apiServices/post";
import { CText, Icon, IconTypes } from "~/components/common";
import { UserLikeRow } from "~/components/likesList";
import { UserLikeRowSkeleton } from "~/components/likesList/UserLikeRowSkeleton";
import { loadNewUsers } from "~/redux/reducers/home.reducer";
import { AppStackRoutesLikesListProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { generalErrorHandler, scale } from "~/utils/";

const PAGE_SIZE = 10;

const LikesList = (props: AppStackRoutesLikesListProps): JSX.Element => {
  const { route, navigation } = props;
  const { postPkey, timestamp, title = "" } = route?.params || {};

  const theme = useTheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const pageRef = useRef(1);
  const totalLikesCount = useRef(0);

  const { headerWrapperStyle, likeTextStyle, safeareaStyle, separatorStyle } =
    styles(theme);

  useLayoutEffect(() => {
    navigation.setOptions({
      title
    });
  });

  const getUsersLikes = useCallback(
    (currentPage = 1) => {
      setIsLoading(true);
      postService
        .getLikesList(postPkey, timestamp, currentPage, PAGE_SIZE)
        .then(data => {
          totalLikesCount.current = data?.metadata?.totalResults ?? 0;
          dispatch(loadNewUsers(data?.users));
          setLikesList(
            currentPage === 1
              ? data?.users ?? []
              : prevState => prevState.concat(data?.users ?? [])
          );
        })
        .catch(error =>
          generalErrorHandler(
            `Error: getLikesList --LikesList.tsx-- postPkey=${postPkey} timestamp=${timestamp} page=${currentPage} ${error}`
          )
        )
        .finally(() => {
          setIsLoading(false);
        });
    },
    [postPkey, timestamp, dispatch]
  );

  useEffect(() => {
    if (!postPkey || !timestamp) {
      return;
    }
    getUsersLikes();
  }, [postPkey, timestamp, getUsersLikes]);

  const handleKeyExtractor = useCallback(item => item.id, []);

  const handleRenderItem = useCallback(({ item, index }) => {
    return <UserLikeRow {...item} />;
  }, []);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading) {
      return null;
    }
    return <UserLikeRowSkeleton />;
  }, [isLoading]);

  const renderListHeadercomponent = useCallback(() => {
    return (
      <View style={headerWrapperStyle}>
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          name={"like_selected"}
          width={scale(20)}
          height={scale(20)}
        />
        <CText
          fontSize={19}
          color="primary"
          style={likeTextStyle}
        >{`${totalLikesCount.current}`}</CText>
      </View>
    );
  }, [likesList, headerWrapperStyle, likeTextStyle]);

  const renderItemSeparatorComponent = useCallback(() => {
    return <View style={separatorStyle} />;
  }, [separatorStyle]);

  const handleOnEndReached = useCallback(() => {
    if (isLoading || likesList.length >= totalLikesCount.current) {
      return;
    }
    const newPage = pageRef.current + 1;
    pageRef.current = newPage;
    getUsersLikes(newPage);
  }, [getUsersLikes, isLoading, likesList.length]);

  return (
    <SafeAreaView style={safeareaStyle}>
      <FlatList
        keyExtractor={handleKeyExtractor}
        data={likesList}
        renderItem={handleRenderItem}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={renderListHeadercomponent}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
      />
    </SafeAreaView>
  );
};

export default LikesList;
