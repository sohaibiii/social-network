import React, { useEffect, useState, useCallback, createRef, memo, useMemo } from "react";
import { Image, View, SafeAreaView, FlatList, RefreshControl } from "react-native";

import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import profileStyles from "./Profile.style";

import { RootState } from "~/redux/store";

import { homeService } from "~/apiServices/index";
import IMAGES from "~/assets/images";
import { SliderSection } from "~/components/common";
import { Post } from "~/components/home";
import { ProfileHeader } from "~/components/profile";
import { loadNewPosts, upsertNewPosts } from "~/redux/reducers/home.reducer";
import { getUserProfileThunk } from "~/redux/thunk";
import { logEvent, PROFILE_LOADED } from "~/services/analytics";
import { generalErrorHandler } from "~/utils/";

export const profileTabFlatListRef = createRef<FlatList>();

const Profile = (): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const userProfile = useSelector((state: RootState) => state.auth.userProfile);
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const [posts, setPosts] = useState([]);
  const [nextSocialIndex, setNextSocialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishedLoadingMore, setIsFinishedLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMyProfile = true;
  const dispatch = useDispatch();

  const getPosts = useCallback(
    (nextSocialIndex = 0) => {
      setIsLoading(true);
      homeService
        .getMyPosts(nextSocialIndex)
        .then(res => {
          const { posts, nextIndex } = res;
          setIsFinishedLoadingMore(posts.length < 10);
          setNextSocialIndex(nextIndex.social);
          setPosts(oldposts => (nextSocialIndex === 0 ? posts : oldposts.concat(posts)));
          setIsLoading(false);
          dispatch(getUserProfileThunk());
          dispatch(upsertNewPosts(posts));
        })
        .catch(error =>
          generalErrorHandler(
            `Error: getMyPosts --Profile.tsx-- nextSocialIndex=${nextSocialIndex} ${error}`
          )
        )
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [dispatch]
  );

  useEffect(() => {
    const handleOnProfileLoad = () => {
      return logEvent(`my${PROFILE_LOADED}`, { source: "my_profile_page" });
    };

    handleOnProfileLoad();
    getPosts();
  }, [getPosts]);

  const {
    noPostsContainer,
    noPostsText,
    noPostsImage,
    loaderWrapperStyle,
    safeareaViewStyle
  } = useMemo(() => profileStyles(colors, isMyProfile), [colors, isMyProfile]);

  const handleRenderItem = useCallback(
    ({ item, index }) => {
      return index === 0 ? (
        <SliderSection title={t("feedsProfileTitle")}>
          <Post postPkey={item.pkey} />
        </SliderSection>
      ) : (
        <Post postPkey={item.pkey} />
      );
    },
    [t]
  );

  const handleKeyExtractor = useCallback(item => {
    return item.pkey;
  }, []);

  const renderListHeaderComponent = useCallback(() => {
    return <ProfileHeader isRefreshing={isRefreshing} />;
  }, [isRefreshing]);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={noPostsContainer}>
        <Text style={noPostsText}>{t("no_posts")}</Text>
        <Image
          resizeMode={"contain"}
          source={isThemeDark ? IMAGES.noPostsDark : IMAGES.noPosts}
          style={noPostsImage}
        />
      </View>
    );
  }, [isLoading, isThemeDark, noPostsContainer, noPostsImage, noPostsText, t]);

  const handleOnEndReached = useCallback(() => {
    if (isLoading || isFinishedLoadingMore) {
      return;
    }

    getPosts(nextSocialIndex);
  }, [getPosts, isFinishedLoadingMore, isLoading, nextSocialIndex]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading || isFinishedLoadingMore) {
      return null;
    }
    return (
      <View style={loaderWrapperStyle}>
        <ActivityIndicator />
      </View>
    );
  }, [isFinishedLoadingMore, isLoading, loaderWrapperStyle]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPosts([]);
    setNextSocialIndex(0);
    setIsFinishedLoadingMore(false);
    getPosts(0);
  }, [getPosts]);
  const renderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        tintColor={colors.black}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    );
  }, [isRefreshing, handleRefresh, colors.black]);

  return (
    <SafeAreaView style={safeareaViewStyle}>
      <FlatList
        data={posts}
        ref={profileTabFlatListRef}
        refreshControl={renderRefreshControl()}
        renderItem={handleRenderItem}
        keyExtractor={handleKeyExtractor}
        ListHeaderComponent={renderListHeaderComponent}
        ListEmptyComponent={renderListEmptyComponent}
        onEndReachedThreshold={0.9}
        onEndReached={handleOnEndReached}
        ListFooterComponent={renderListFooterComponent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
      />
    </SafeAreaView>
  );
};

export default memo(Profile, isEqual);
