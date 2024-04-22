import React, { useEffect, useState, useCallback, createRef, useMemo } from "react";
import { Image, View, SafeAreaView, FlatList, RefreshControl } from "react-native";

import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ProfileOthers.style";

import { RootState } from "~/redux/store";

import { homeService } from "~/apiServices/index";
import IMAGES from "~/assets/images";
import { SliderSection } from "~/components/common";
import { Post } from "~/components/home";
import { ProfileHeader } from "~/components/profileOthers/profileHeader";
import { upsertNewPosts } from "~/redux/reducers/home.reducer";
import { logEvent, PROFILE_LOADED } from "~/services/analytics";
import { generalErrorHandler } from "~/utils/";

export const profileTabFlatListRef = createRef<FlatList>();

const ProfileOthers = (): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { params = {} } = useRoute();

  const { uuid: userID, hasBackButton = false } = params as {
    uuid: string;
    hasBackButton?: boolean;
  };
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );

  const [posts, setPosts] = useState([]);
  const [nextSocialIndex, setNextSocialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishedLoadingMore, setIsFinishedLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    if (!userID) {
      return;
    }

    const handleOnProfileLoad = () => {
      return logEvent(`others${PROFILE_LOADED}`, {
        source: "others_profile_page",
        profile_user_id: userID
      });
    };

    handleOnProfileLoad();

    getPosts(userID);

    return () => {
      // clean up for pressing next profile
      setIsFinishedLoadingMore(false);
      setIsLoading(false);
      setNextSocialIndex(0);
      setPosts([]);
    };
  }, [userID, dispatch, getPosts]);

  const getPosts = useCallback(
    (userID, nextSocialIndex = 0) => {
      setIsLoading(true);
      homeService
        .getUserPosts(userID, nextSocialIndex)
        .then(res => {
          const { posts = [], nextIndex = { social: 0 } } = res;
          setPosts(oldposts => (nextSocialIndex === 0 ? posts : oldposts.concat(posts)));
          setIsLoading(false);
          setIsFinishedLoadingMore(posts.length < 10);
          setNextSocialIndex(nextIndex?.social);
          dispatch(upsertNewPosts(posts));
        })
        .catch(error =>
          generalErrorHandler(
            `Error: getUserPosts --ProfileOthers.tsx-- userID=${userID} nextSocialIndex=${nextSocialIndex} ${error}`
          )
        )
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [dispatch]
  );

  const {
    noPostsContainer,
    noPostsText,
    noPostsImage,
    loaderWrapperStyle,
    safeareaViewStyle
  } = useMemo(() => styles(colors, false), [colors]);

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
    return <ProfileHeader userID={userID} isRefreshing={isRefreshing} />;
  }, [userID, isRefreshing]);

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
  }, [isThemeDark, noPostsContainer, noPostsImage, noPostsText, t, isLoading]);

  const handleOnEndReached = useCallback(() => {
    if (isLoading || isFinishedLoadingMore) {
      return;
    }
    getPosts(userID, nextSocialIndex);
  }, [getPosts, userID, nextSocialIndex, isLoading, isFinishedLoadingMore]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading || isFinishedLoadingMore) {
      return null;
    }
    return (
      <View style={loaderWrapperStyle}>
        <ActivityIndicator />
      </View>
    );
  }, [isLoading, isFinishedLoadingMore, loaderWrapperStyle]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPosts([]);
    setNextSocialIndex(0);
    setIsFinishedLoadingMore(false);
    getPosts(userID, 0);
  }, [getPosts, userID]);

  return (
    <SafeAreaView style={safeareaViewStyle}>
      <FlatList
        data={posts}
        ref={profileTabFlatListRef}
        refreshControl={
          <RefreshControl
            tintColor={colors.black}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
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

export default ProfileOthers;
