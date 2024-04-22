import React, { memo, useCallback, useLayoutEffect, useRef } from "react";
import { View, SafeAreaView, FlatList, KeyboardAvoidingView } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ReplyDetails.styles";

import { RootState } from "~/redux/store";

import { CText, Icon, IconTypes } from "~/components/common";
import { PostComment, PostCommentSkeleton, WriteComment } from "~/components/post";
import { Reply } from "~/components/reply/Reply";
import { PLATFORM } from "~/constants/variables";
import { getCommentReplies } from "~/redux/thunk/home.thunk";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const ReplyDetails = (props: any): JSX.Element => {
  const { route, navigation } = props;
  const { commentIndex, isSponserShip = false } = route?.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  const repliesListContainerRef = useRef(null);

  const isLoading = useSelector((state: RootState) => state.home.replies.isLoading);
  const lastEvaluatedKey = useSelector(
    (state: RootState) => state.home.replies.lastEvaluatedKey
  );
  const isLast = !lastEvaluatedKey;

  const commentSelector = useSelector(
    (state: RootState) => state.home.comments.entities[commentIndex]
  );

  const commentRepliesListSelector =
    createSelector(
      (state: RootState) => state.home.replies.entities,
      items =>
        Object.keys(items)
          ?.filter(comment => items[comment]?.commentIndex === commentIndex)
          .map(key => items[key])
          .sort((a, b) => moment(b.index).diff(moment(a.index)))
    ) || [];
  const commentRepliesList = useSelector(commentRepliesListSelector);

  const { emptyCommentsWrapperStyle, flexGrow, containerStyle } = styles(theme);

  const {
    index,
    likes,
    post_pkey,
    text,
    timestamp,
    created_by,
    replies_counter,
    isLiked
  } = commentSelector || {};

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Appbar.BackAction
          color={theme.colors.primary}
          size={scale(18)}
          onPress={handleGoBack}
        />
      )
    });
  }, [handleGoBack, navigation, theme.colors.text]);

  const renderListHeaderComponent = useCallback(() => {
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
        showFirstReply={false}
        isOriginalCommentInReplyDetails
        isSponserShip={isSponserShip}
      />
    );
  }, [
    index,
    likes,
    post_pkey,
    text,
    timestamp,
    created_by,
    replies_counter,
    isLiked,
    isSponserShip
  ]);

  const handleRenderItem = useCallback(({ item }) => {
    const { index } = item;

    return (
      <Reply repliesCount={0} reply={item} isInCommentList={false} commentIndex={index} />
    );
  }, []);

  const handleKeyExtractor = useCallback((item, index) => {
    return item.index;
  }, []);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={emptyCommentsWrapperStyle}>
        <Icon
          type={IconTypes.FOUNDATION}
          name={"comments"}
          size={moderateScale(150)}
          color={theme.colors.grayBB}
        />
        <CText fontSize={14}>{t("empty_replies_title")}</CText>
        <CText fontSize={14}>{t("empty_replies_subtitle")}</CText>
      </View>
    );
  }, [isLoading, theme.colors.grayBB, t, emptyCommentsWrapperStyle]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading || replies_counter < 10) {
      return null;
    }
    return <PostCommentSkeleton commentsCounter={replies_counter} />;
  }, [replies_counter, isLoading]);

  const getReplies = useCallback(
    (nextIndex = undefined) => {
      dispatch(
        getCommentReplies({
          postPkey: post_pkey,
          postIndex: index,
          nextIndex,
          limit: 10
        })
      );
    },
    [post_pkey, index, dispatch]
  );

  const handleOnEndReached = useCallback(() => {
    if (isLast || !lastEvaluatedKey?.index) {
      return;
    }
    getReplies(lastEvaluatedKey?.index);
  }, [lastEvaluatedKey, getReplies, isLast]);

  const scrollToFirstComment = () => {};

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={PLATFORM === "ios" ? "padding" : null}
        style={flexGrow}
        keyboardVerticalOffset={PLATFORM === "ios" ? headerHeight : 0}
      >
        <FlatList
          ref={repliesListContainerRef}
          data={commentRepliesList}
          renderItem={handleRenderItem}
          ListHeaderComponent={renderListHeaderComponent}
          keyExtractor={handleKeyExtractor}
          onEndReachedThreshold={0.5}
          onEndReached={handleOnEndReached}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={renderListFooterComponent}
        />
        <WriteComment
          postPkey={post_pkey}
          timestamp={timestamp}
          scrollToFirstCommentCb={scrollToFirstComment}
          isReplyDetailsPage
          replyDetailsCommentIndex={index}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default memo(ReplyDetails);
