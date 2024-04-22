import React, { memo, useCallback, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  InteractionManager
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import styles from "./PostDetails.styles";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { Post, PostSponsership } from "~/components/home";
import { PostComment, PostCommentSkeleton, WriteComment } from "~/components/post";
import { PLATFORM } from "~/constants/variables";
import { clearEditComment, clearReplyOnComment } from "~/redux/reducers/social.reducer";
import { getPostComments } from "~/redux/thunk/home.thunk";
import { PostClass } from "~/redux/types/propertySocialAction.types";
import { moderateScale } from "~/utils/";

const PostDetails = (props: any): JSX.Element => {
  const { route, navigation } = props;
  const {
    postPkey,
    commentsCounter = 0,
    timestamp,
    fromComments = false,
    isSponserShip = false,
    enable_post_actions = false
  } = route?.params;

  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();

  const commentsListContainerRef = useRef(null);
  const isScrolledToCommentsList = useRef(false);
  const isFirstTimeScrolling = useRef(true);

  const isLoading = useSelector((state: RootState) => state.home.comments.isLoading);
  const lastEvaluatedKey = useSelector(
    (state: RootState) => state.home.comments.lastEvaluatedKey
  );

  const isLast = !lastEvaluatedKey;

  const postCommentsListSelector = createSelector(
    (state: RootState) => state.home.comments.entities,
    items =>
      Object.keys(items)
        ?.filter(comment => items[comment]?.post_pkey === postPkey)
        .map(key => items[key])
        .sort((a, b) => moment(b.index).diff(moment(a.index)))
  );

  const postCommentsList = useSelector(postCommentsListSelector);

  const {
    emptyCommentsWrapperStyle,
    containerStyle,
    keyboardAvoidingViewStyle,
    contentContainerStyle
  } = styles(theme);

  useEffect(() => {
    isScrolledToCommentsList.current = false;
    if (postCommentsList.length === commentsCounter) {
      return;
    }
    dispatch(
      getPostComments({
        postPkey,
        timestamp,
        nextIndex: undefined,
        type: isSponserShip ? PostClass.SPONSORED : PostClass.POST
      })
    );
  }, [
    commentsCounter,
    dispatch,
    isSponserShip,
    postCommentsList.length,
    postPkey,
    timestamp
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      dispatch(clearEditComment(""));
      dispatch(clearReplyOnComment(""));
    });

    return unsubscribe;
  }, [navigation]);

  const getComments = useCallback(
    (nextIndex = undefined) => {
      dispatch(
        getPostComments({
          postPkey,
          timestamp,
          nextIndex,
          type: isSponserShip ? PostClass.SPONSORED : PostClass.POST
        })
      );
    },
    [postPkey, timestamp, dispatch, isSponserShip]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", e => {
      if (
        fromComments &&
        commentsListContainerRef?.current &&
        isFirstTimeScrolling?.current &&
        postCommentsList.length !== 0
      ) {
        isFirstTimeScrolling.current = false;
        InteractionManager.runAfterInteractions(() => {
          commentsListContainerRef?.current?.scrollToIndex({
            animated: true,
            index: 0
          });
        });
      }
    });

    return unsubscribe;
  }, [fromComments, isFirstTimeScrolling, navigation, postCommentsList.length]);

  const renderListHeaderComponent = useCallback(() => {
    return isSponserShip ? (
      <PostSponsership
        key={postPkey}
        pkey={postPkey}
        enable_post_actions={enable_post_actions}
      />
    ) : (
      <Post postPkey={postPkey} isInsidePostDetails />
    );
  }, [postPkey, enable_post_actions, isSponserShip]);

  const handleEmptyOnLayout = useCallback(
    event => {
      if (fromComments && isFirstTimeScrolling?.current) {
        isFirstTimeScrolling.current = false;
        commentsListContainerRef?.current?.scrollToOffset({
          offset: event.nativeEvent.layout.y,
          animated: true
        });
      }
    },
    [fromComments, isFirstTimeScrolling]
  );

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={emptyCommentsWrapperStyle} onLayout={handleEmptyOnLayout}>
        <Icon
          type={IconTypes.FOUNDATION}
          name={"comments"}
          size={moderateScale(150)}
          color={theme.colors.grayBB}
        />
        <CText fontSize={14}>{t("empty_comments_title")}</CText>
        <CText fontSize={14}>{t("empty_comments_subtitle")}</CText>
      </View>
    );
  }, [isLoading, theme.colors.grayBB, t, emptyCommentsWrapperStyle]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading) {
      return null;
    }
    return <PostCommentSkeleton commentsCounter={commentsCounter} />;
  }, [commentsCounter, isLoading]);

  const handleRenderItem = useCallback(({ item }) => {
    const {
      likes,
      post_pkey,
      text,
      timestamp,
      created_by,
      index,
      replies_counter,
      isLiked
    } = item;

    return (
      <PostComment
        key={index}
        likes={likes}
        pkey={post_pkey}
        text={text}
        timestamp={timestamp}
        created_by={created_by}
        index={index}
        replies_counter={replies_counter}
        isLiked={isLiked}
        isSponserShip={isSponserShip}
      />
    );
  }, []);

  const handleOnEndReached = useCallback(() => {
    if (isLast || !lastEvaluatedKey?.index) {
      return;
    }
    getComments(lastEvaluatedKey?.index);
  }, [lastEvaluatedKey, getComments, isLast]);

  const handleKeyExtractor = useCallback(item => item.index, []);

  const scrollToFirstComment = useCallback(() => {
    if (postCommentsList.length === 0 || isScrolledToCommentsList?.current) {
      return;
    }
    isScrolledToCommentsList.current = true;
    commentsListContainerRef?.current?.scrollToIndex({ animated: true, index: 0 });
  }, [postCommentsList]);

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={PLATFORM === "ios" ? "padding" : null}
        style={keyboardAvoidingViewStyle}
        keyboardVerticalOffset={PLATFORM === "ios" ? headerHeight : 0}
      >
        <FlatList
          ref={commentsListContainerRef}
          data={postCommentsList}
          renderItem={handleRenderItem}
          keyExtractor={handleKeyExtractor}
          ListHeaderComponent={renderListHeaderComponent}
          onEndReachedThreshold={0.5}
          onEndReached={handleOnEndReached}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={renderListFooterComponent}
          contentContainerStyle={contentContainerStyle}
        />
        <WriteComment
          postPkey={postPkey}
          timestamp={timestamp}
          scrollToFirstCommentCb={scrollToFirstComment}
          isSponserShip={isSponserShip}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default memo(PostDetails);
