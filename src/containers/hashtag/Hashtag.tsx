import React, { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { View, SafeAreaView, FlatList } from "react-native";

import { useTheme, ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";

import styles from "./Hashtag.styles";

import homeService from "~/apiServices/home";
import { HeaderRight } from "~/components/common";
import { Post } from "~/components/home";
import { HomepageHeader } from "~/components/home";
import { APP_SCREEN_WIDTH, PLATFORM } from "~/constants/";
import { loadNewPosts } from "~/redux/reducers/home.reducer";
import { AppStackRoutesHashtagProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { generalErrorHandler, scale } from "~/utils/";
import { textEllipsis } from "~/utils/stringUtil";

const Hashtag = (props: AppStackRoutesHashtagProps): JSX.Element => {
  const { navigation, route } = props;
  const { hashtag } = route?.params;
  const dispatch = useDispatch();
  const theme = useTheme();

  const [hashtagPosts, setHashtagPosts] = useState([]);
  const [nextSocialIndex, setNextSocialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishedLoadingMore, setIsFinishedLoadingMore] = useState(false);

  const { loaderWrapperStyle } = styles(theme);

  const renderHeaderRight = useCallback(() => {
    return <HeaderRight />;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `#${hashtag}`,
      headerTitleStyle: {
        color: theme.colors.primary,
        maxWidth: APP_SCREEN_WIDTH - (PLATFORM === "android" ? 160 : 200),
        marginStart: PLATFORM === "android" ? 40 : 0
      },
      headerRight: renderHeaderRight
    });
  }, [hashtag, navigation, renderHeaderRight, theme.colors.primary]);

  const getHashtags = useCallback(
    (nextSocialIndex = 0) => {
      setIsLoading(true);
      homeService
        .getHashtag(hashtag, nextSocialIndex)
        .then(res => {
          const { feeds, nextIndex } = res;
          dispatch(loadNewPosts(feeds));
          setIsFinishedLoadingMore(feeds.length < 10);
          setNextSocialIndex(nextIndex.social);
          setHashtagPosts(oldhashtagPosts =>
            nextSocialIndex === 0 ? feeds : oldhashtagPosts.concat(feeds)
          );
        })
        .catch(error =>
          generalErrorHandler(
            `Error: getHashtag --Hashtag.tsx-- hashtag=${hashtag} nextSocialIndex=${nextSocialIndex} ${error}`
          )
        )
        .finally(() => {
          setIsLoading(false);
        });
    },
    [hashtag, dispatch]
  );

  const handleRenderItem = useCallback(({ item, index }) => {
    return <Post postPkey={item.pkey} />;
  }, []);

  const handleKeyExtractor = useCallback(item => {
    return item.pkey;
  }, []);

  const handleOnEndReached = useCallback(() => {
    if (isLoading || isFinishedLoadingMore) {
      return;
    }
    getHashtags(nextSocialIndex);
  }, [getHashtags, nextSocialIndex, isLoading, isFinishedLoadingMore]);

  const renderListHeaderComponent = useCallback(() => {
    return <HomepageHeader isHashtag searchbarPlaceHolder={`#${hashtag}`} />;
  }, [hashtag]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading) {
      return null;
    }
    return (
      <View style={loaderWrapperStyle}>
        <ActivityIndicator />
      </View>
    );
  }, [isLoading, loaderWrapperStyle]);

  useEffect(() => {
    getHashtags();
    return () => {
      // clean up for pressing next hashtag while in hashtag page
      setIsFinishedLoadingMore(false);
      setIsLoading(false);
      setNextSocialIndex(0);
      setHashtagPosts([]);
    };
  }, [getHashtags]);

  return (
    <SafeAreaView>
      <FlatList
        data={hashtagPosts}
        ListHeaderComponent={renderListHeaderComponent}
        renderItem={handleRenderItem}
        keyExtractor={handleKeyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        ListFooterComponent={renderListFooterComponent}
      />
    </SafeAreaView>
  );
};

export default Hashtag;
