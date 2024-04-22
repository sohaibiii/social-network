import React, { useCallback, memo, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  UIManager,
  Platform,
  LayoutAnimation,
  InteractionManager
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { createSelector } from "@reduxjs/toolkit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import styles from "./PostComment.styles";
import { PostCommentType } from "./PostComment.types";

import { RootState } from "~/redux/store";

import commentsService from "~/apiServices/comments";
import {
  ReportCommentButton,
  ReportCommentContent,
  ConfirmContent
} from "~/components/comment";
import {
  CText,
  Icon,
  IconTypes,
  modalizeRef,
  UserProfileAvatar
} from "~/components/common";
import { InlineReadMore } from "~/components/common/InlineReadMore";
import { InlineReadMoreMode } from "~/components/common/InlineReadMore/InlineReadMore.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { Reply } from "~/components/reply/";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  commentUpserted,
  commentDeleted,
  postUpserted
} from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { setEditComment, setReplyOnComment } from "~/redux/reducers/social.reducer";
import { getCommentReplies } from "~/redux/thunk/home.thunk";
import { PostClass } from "~/redux/types/propertySocialAction.types";
import {
  logEvent,
  POST_DETAILS_DELETE_COMMENT,
  POST_DETAILS_DELETE_COMMENT_FAILED,
  POST_DETAILS_DELETE_COMMENT_SUCCESS,
  POST_DETAILS_LIKE_COMMENT,
  POST_DETAILS_LIKE_COMMENT_FAILED,
  POST_DETAILS_LIKE_COMMENT_SUCCESS,
  REPLY_DETAILS_DELETE_COMMENT,
  REPLY_DETAILS_DELETE_COMMENT_FAILED,
  REPLY_DETAILS_DELETE_COMMENT_SUCCESS,
  REPLY_DETAILS_DELETE_REPLY,
  REPLY_DETAILS_LIKE_COMMENT,
  REPLY_DETAILS_LIKE_COMMENT_FAILED,
  REPLY_DETAILS_LIKE_COMMENT_SUCCESS
} from "~/services/";
import { playSoundFile } from "~/services/soundPlayer";
import { generalErrorHandler } from "~/utils/";
import { scale, moderateScale } from "~/utils/responsivityUtil";

const ANALYTICS_SOURCE = "post_comment";

const PostComment = (props: PostCommentType): JSX.Element => {
  const {
    likes = 0,
    pkey,
    text,
    timestamp,
    index,
    created_by,
    replies_counter = 0,
    isLiked,
    isReply = false,
    showFirstReply = true,
    isOriginalCommentInReplyDetails = false,
    isSponserShip = false
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const userSelector = useSelector(
    (state: RootState) => state.home.users.entities[created_by]
  );
  const commentSelector = useSelector(
    (state: RootState) => state.home.comments.entities[index]
  );

  const postSelector = useSelector((state: RootState) => state.home.posts.entities[pkey]);

  const loggedInUser = useSelector((state: RootState) => state.auth.userInfo);
  const { profile_image, profile, id, roles = [], verified, name } = userSelector || {};

  const isMyComment = loggedInUser?.id === commentSelector?.created_by;
  const isRahhal = roles.length > 0;

  const commentRepliesListSelector = createSelector(
    (state: RootState) => state.home.replies.entities,
    items =>
      Object.keys(items)
        ?.filter(reply => items[reply]?.commentIndex === index)
        .map(key => items[key])
        .sort((a, b) => moment(b.index).diff(moment(a.index)))
  );

  const commentRepliesList = useSelector(commentRepliesListSelector, shallowEqual);

  const deleteCommentTitle = isMyComment
    ? t("delete_comment_description")
    : t("delete_this_comment_description");

  /** this is until backend fix returning one reply with comment */
  useEffect(() => {
    if (replies_counter === 0) {
      return;
    }
    dispatch(
      getCommentReplies({
        postPkey: pkey,
        postIndex: index,
        nextIndex: undefined,
        limit: 10
      })
    );
  }, [index, pkey, replies_counter, dispatch]);

  const {
    nameWrapperStyle,
    verifiecIconStyle,
    userDetailsTextStyle,
    likeCommentButtonContainerStyle,
    likeCommentTextStyle,
    containerStyle,
    profileImageWrapperStyle,
    commentWrapperStyle,
    commentTimeWrapperStyle,
    actionWrapperStyle,
    nameMoreWrapperStyle,
    bottomSpacing
  } = useMemo(() => styles(theme), [theme]);

  const handleGoToProfile = useCallback(() => {
    navigation.navigate("Profile", {
      uuid: id,
      hasBackButton: true
    });
  }, [navigation, id]);

  const handleLikePressed = useCallback(async () => {
    if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
      modalizeRef.current?.close();
      return InteractionManager.runAfterInteractions(() => {
        navigation.navigate("PreLoginNavigationModal");
      });
    }
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      pkey,
      timestamp,
      index,
      is_like: !isLiked
    };

    const likeCommentEventName = isOriginalCommentInReplyDetails
      ? REPLY_DETAILS_LIKE_COMMENT
      : POST_DETAILS_LIKE_COMMENT;
    const likeCommentSuccessEventName = isOriginalCommentInReplyDetails
      ? REPLY_DETAILS_LIKE_COMMENT_SUCCESS
      : POST_DETAILS_LIKE_COMMENT_SUCCESS;
    const likeCommentFailedEventName = isOriginalCommentInReplyDetails
      ? REPLY_DETAILS_LIKE_COMMENT_FAILED
      : POST_DETAILS_LIKE_COMMENT_FAILED;

    await logEvent(likeCommentEventName, analyticsProps);

    if (!isLiked) {
      if (enable_sounds) {
        playSoundFile("like.mp3");
      }
      commentsService
        .LikeComment(pkey, index)
        .then(async () => {
          await logEvent(likeCommentSuccessEventName, analyticsProps);
        })
        .catch(async error => {
          await logEvent(likeCommentFailedEventName, analyticsProps);
          generalErrorHandler(
            `Error: LikeComment --PostComment.tsx-- pkey=${pkey} index=${index} ${error}`
          );
        });
      dispatch(commentUpserted({ ...commentSelector, isLiked: true, likes: likes + 1 }));
    } else {
      commentsService
        .unlikeComment(pkey, index)
        .then(async () => {
          await logEvent(likeCommentSuccessEventName, analyticsProps);
        })
        .catch(async error => {
          await logEvent(likeCommentFailedEventName, analyticsProps);
          generalErrorHandler(
            `Error: unlikeComment --PostComment.tsx-- pkey=${pkey} index=${index} ${error}`
          );
        });
      dispatch(commentUpserted({ ...commentSelector, isLiked: false, likes: likes - 1 }));
    }
  }, [pkey, index, commentSelector, dispatch, likes, isLiked, navigation, loggedInUser]);

  const showReportBottomSheet = useCallback(() => {
    if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
      modalizeRef.current?.close();
      return InteractionManager.runAfterInteractions(() => {
        navigation.navigate("PreLoginNavigationModal");
      });
    }
    dispatch(
      showBottomSheet({
        Content: () => (
          <ReportCommentContent
            onBackPressedCb={handleMoreCommentSettingsPressed}
            {...props}
          />
        ),
        props: {
          flatListProps: null,
          modalHeight: APP_SCREEN_HEIGHT * 0.6
        },
        customProps: {
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
  }, [dispatch, handleMoreCommentSettingsPressed, props, loggedInUser, navigation]);

  const renderDeleteCommentContent = useCallback(
    () => (
      <ConfirmContent
        onPress={() => modalizeRef.current?.close()}
        title={t("delete_comment_success")}
        icon={
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="verified_user"
            width={scale(60)}
            height={scale(60)}
            color={"green"}
          />
        }
        confirmText={t("done")}
      />
    ),
    [t]
  );

  const handleDeleteComment = useCallback(async () => {
    const source = isOriginalCommentInReplyDetails
      ? "reply_details_page"
      : "post_details_page";
    const analyticsProps = {
      source,
      pkey,
      timestamp,
      index
    };
    await logEvent(
      isOriginalCommentInReplyDetails
        ? REPLY_DETAILS_DELETE_COMMENT
        : POST_DETAILS_DELETE_COMMENT,
      analyticsProps
    );
    commentsService
      .deleteComment(
        pkey,
        timestamp,
        index,
        isSponserShip ? PostClass.SPONSORED : PostClass.POST
      )
      .then(async () => {
        dispatch(commentDeleted(index));
        await logEvent(
          isOriginalCommentInReplyDetails
            ? REPLY_DETAILS_DELETE_COMMENT_SUCCESS
            : POST_DETAILS_DELETE_COMMENT_SUCCESS,
          analyticsProps
        );

        !!postSelector &&
          dispatch(
            postUpserted({
              ...postSelector,
              comments_counter: postSelector.comments_counter - 1
            })
          );
        dispatch(
          showBottomSheet({
            Content: renderDeleteCommentContent,
            props: {
              flatListProps: null,
              modalHeight: APP_SCREEN_HEIGHT * 0.4
            }
          })
        );
        // means i am in reply route and i need to go back once main comment is deleted
        if (!showFirstReply) {
          navigation.goBack();
        }
      })
      .catch(async () => {
        await logEvent(
          isOriginalCommentInReplyDetails
            ? REPLY_DETAILS_DELETE_COMMENT_FAILED
            : POST_DETAILS_DELETE_COMMENT_FAILED,
          analyticsProps
        );

        dispatch(
          showSnackbar({
            text: t("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      });
  }, [
    dispatch,
    pkey,
    index,
    renderDeleteCommentContent,
    timestamp,
    t,
    postSelector,
    isOriginalCommentInReplyDetails,
    isSponserShip,
    navigation,
    showFirstReply
  ]);

  const renderDeleteCommentConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        title={deleteCommentTitle}
        description={t("delete_comment_confirm", {
          interpolation: { escapeValue: false },
          user: name
        })}
        icon={
          <Icon
            type={IconTypes.FONTAWESOME}
            disabled
            name={"trash-o"}
            color={theme.colors.text}
            size={scale(40)}
          />
        }
        hasLoading={true}
        onPress={handleDeleteComment}
        cancelText={t("cancel")}
        confirmText={t("delete_comment")}
        onBackPressedCb={handleMoreCommentSettingsPressed}
      />
    ),
    [handleDeleteComment, handleMoreCommentSettingsPressed, name, t, theme.colors.text]
  );

  const showDeleteCommentBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderDeleteCommentConfirmationContent,
        props: {
          flatListProps: null,
          modalHeight: APP_SCREEN_HEIGHT * 0.4
        },
        customProps: {
          scrollViewProps: null
        }
      })
    );
  }, [dispatch, renderDeleteCommentConfirmationContent]);

  const handleEditComment = useCallback(() => {
    dispatch(
      setEditComment({
        editCommentText: text,
        commentIndex: index,
        isOriginalCommentInReplyDetails: isOriginalCommentInReplyDetails
      })
    );
    modalizeRef.current?.close();
  }, [dispatch, text, index, isOriginalCommentInReplyDetails]);

  const bottomSheetContent: Element = useCallback(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    return (
      <View layout={LayoutAnimation.easeInEaseOut()} style={bottomSpacing}>
        {isMyComment ? (
          <>
            <ReportCommentButton
              onPress={handleEditComment}
              title={t("edit_comment")}
              description={t("edit_comment_description")}
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"edit"}
                  color={theme.colors.text}
                  size={scale(24)}
                />
              }
            />
            <ReportCommentButton
              title={t("delete_comment")}
              onPress={showDeleteCommentBottomSheet}
              description={deleteCommentTitle}
              icon={
                <Icon
                  type={IconTypes.FONTAWESOME}
                  disabled
                  name={"trash-o"}
                  color={theme.colors.text}
                  size={scale(25)}
                />
              }
            />
          </>
        ) : (
          <>
            <ReportCommentButton
              onPress={showReportBottomSheet}
              title={t("report_comment")}
              description={t("report_comment_description")}
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"alert-octagon"}
                  color={theme.colors.text}
                  size={scale(24)}
                />
              }
            />
          </>
        )}
        {!isMyComment && postSelector?.is_my_post && (
          <ReportCommentButton
            title={t("delete_comment")}
            onPress={showDeleteCommentBottomSheet}
            description={deleteCommentTitle}
            icon={
              <Icon
                type={IconTypes.FONTAWESOME}
                disabled
                name={"trash-o"}
                color={theme.colors.text}
                size={scale(25)}
              />
            }
          />
        )}
      </View>
    );
  }, [
    postSelector,
    bottomSpacing,
    theme.colors.text,
    isMyComment,
    showDeleteCommentBottomSheet,
    showReportBottomSheet,
    handleEditComment,
    t
  ]);

  const handleMoreCommentSettingsPressed = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent,
        props: {
          flatListProps: null,
          HeaderComponent: null,
          modalHeight: APP_SCREEN_HEIGHT * (isMyComment ? 0.22 : 0.13)
        }
      })
    );
  }, [dispatch, bottomSheetContent, isMyComment]);

  const handleReplyOnComment = useCallback(() => {
    dispatch(
      setReplyOnComment({
        replyCommentText: "",
        commentIndex: index,
        originalCommentorName: name
      })
    );
  }, [dispatch, index, name]);

  return (
    <View>
      <View style={containerStyle}>
        <View style={profileImageWrapperStyle}>
          <UserProfileAvatar
            isRahhal={isRahhal}
            name={name}
            profile={profile}
            id={id}
            analyticsSource={ANALYTICS_SOURCE}
          />
        </View>
        <View>
          <View style={commentWrapperStyle}>
            <View style={nameMoreWrapperStyle}>
              <TouchableOpacity onPress={handleGoToProfile}>
                <View style={nameWrapperStyle}>
                  {verified && (
                    <Icon
                      type={IconTypes.SAFARWAY_ICONS}
                      name="verified_user_filled"
                      height={scale(15)}
                      width={scale(15)}
                      style={verifiecIconStyle}
                    />
                  )}
                  <CText fontSize={14} lineHeight={17} color={"primary"}>
                    {name}
                  </CText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMoreCommentSettingsPressed}>
                <Icon
                  type={IconTypes.FEATHER}
                  name={"more-vertical"}
                  size={moderateScale(18)}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            <InlineReadMore
              maxNumberOfLinesToShow={3}
              isAutoLink
              mode={InlineReadMoreMode.FLEX}
              textProps={{ fontSize: 12 }}
              key={text}
              analyticsSource={ANALYTICS_SOURCE}
              pkey={pkey}
              index={index}
            >
              {text}
            </InlineReadMore>
          </View>
          <View style={actionWrapperStyle}>
            <TouchableOpacity
              style={likeCommentButtonContainerStyle}
              onPress={handleLikePressed}
            >
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                name={isLiked ? "like_selected" : "like"}
                width={RFValue(16)}
                height={RFValue(16)}
                disabled
              />
              <CText fontSize={11} lineHeight={15} style={likeCommentTextStyle}>
                {t("like")}
              </CText>
              {likes > 0 && (
                <CText fontSize={11} lineHeight={15} style={likeCommentTextStyle}>
                  {`(${likes})`}
                </CText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={likeCommentButtonContainerStyle}
              onPress={handleReplyOnComment}
            >
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                name={"comment"}
                width={RFValue(16)}
                height={RFValue(16)}
              />
              <CText fontSize={11} lineHeight={15} style={likeCommentTextStyle}>
                {replies_counter > 0
                  ? t("replies.humanized", {
                      count: replies_counter
                    })
                  : t("reply")}
              </CText>
            </TouchableOpacity>
            <View style={commentTimeWrapperStyle}>
              <CText fontSize={11} lineHeight={15} style={userDetailsTextStyle} disabled>
                {moment(index).fromNow()}
              </CText>
            </View>
          </View>
        </View>
      </View>
      {!!showFirstReply &&
        !!commentRepliesList &&
        Array.isArray(commentRepliesList) &&
        commentRepliesList.length > 0 &&
        Object.keys(commentRepliesList[0]).length > 0 && (
          <Reply
            repliesCount={commentRepliesList.length}
            reply={commentRepliesList[0]}
            isInCommentList
            commentIndex={index}
            isSponserShip={isSponserShip}
          />
        )}
    </View>
  );
};

export default memo(PostComment);
