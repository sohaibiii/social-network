import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  UIManager,
  Platform,
  LayoutAnimation
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

import { ReportReplyContent } from "../ReportReplyContent";

import styles from "./Reply.styles";

import { RootState } from "~/redux/store";

import commentsService from "~/apiServices/comments";
import { ReportCommentButton, ConfirmContent } from "~/components/comment";
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
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import {
  replyUpserted,
  replyDeleted,
  commentUpserted
} from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { setReplyOnComment, setEditComment } from "~/redux/reducers/social.reducer";
import {
  logEvent,
  REPLY_DETAILS_DELETE_REPLY,
  REPLY_DETAILS_DELETE_REPLY_FAILED,
  REPLY_DETAILS_DELETE_REPLY_SUCCESS,
  REPLY_DETAILS_LIKE_REPLY,
  REPLY_DETAILS_LIKE_REPLY_FAILED,
  REPLY_DETAILS_LIKE_REPLY_SUCCESS
} from "~/services/";
import { playSoundFile } from "~/services/soundPlayer";
import { generalErrorHandler } from "~/utils/";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const ANALYTICS_SOURCE = "reply";
const Reply = (props: any): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const {
    nameWrapperStyle,
    verifiecIconStyle,
    userDetailsTextStyle,
    likeCommentButtonContainerStyle,
    likeCommentTextStyle,
    containerStyle,
    profileImageWrapperStyle,
    containerWrapperStyle,
    commentTimeWrapperStyle,
    nameMoreWrapperStyle,
    bottomSpacing,
    replyWrapperStyle,
    replyActionWrapperStyle
  } = styles(theme);
  const {
    repliesCount = 0,
    reply,
    isInCommentList = false,
    commentIndex,
    isSponserShip = false
  } = props;

  const { likes, text, created_by, index, replies_counter = 0, isLiked } = reply || {};

  const userSelector = useSelector(
    (state: RootState) => state.home.users.entities[created_by]
  );
  const { profile_image, profile, id, roles = [], verified, name } = userSelector || {};

  const isRahhal = roles.length > 0;

  const loggedInUser = useSelector((state: RootState) => state.auth.userInfo);

  const replySelector = useSelector(
    (state: RootState) => state.home.replies.entities[index]
  );
  const commentSelector =
    (replySelector.commentIndex &&
      useSelector(
        (state: RootState) => state.home.comments.entities[replySelector.commentIndex]
      )) ||
    {};
  const isMyReply = loggedInUser?.id === replySelector?.created_by;

  const { timestamp, post_pkey } = commentSelector;
  const handleGoToProfile = useCallback(() => {
    navigation.navigate("Profile", {
      uuid: id,
      hasBackButton: true
    });
  }, [navigation, id]);

  const postSelector = useSelector(
    (state: RootState) => state.home.posts.entities[post_pkey]
  );

  const deleteReplyTitle = isMyReply
    ? t("delete_reply_description")
    : t("delete_this_reply_description");

  const showReportBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <ReportReplyContent
            onBackPressedCb={handleMoreReplySettingsPressed}
            index={replySelector?.index}
            pkey={`${post_pkey}_${replySelector?.commentIndex}`}
          />
        ),
        props: {
          flatListProps: null
        },
        customProps: {
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          }
        }
      })
    );
  }, [
    dispatch,
    handleMoreReplySettingsPressed,
    replySelector?.index,
    post_pkey,
    replySelector?.commentIndex
  ]);

  const bottomSheetContent: Element = useCallback(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    return (
      <View layout={LayoutAnimation.easeInEaseOut()} style={bottomSpacing}>
        {isMyReply ? (
          <>
            <ReportCommentButton
              onPress={handleEditReply}
              title={t("edit_reply")}
              description={t("edit_reply_description")}
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
              title={t("delete_reply")}
              onPress={showDeleteReplyBottomSheet}
              description={deleteReplyTitle}
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
              title={t("report_reply")}
              description={t("report_reply_description")}
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
        {!isMyReply && postSelector?.is_my_post && (
          <ReportCommentButton
            title={t("delete_reply")}
            onPress={showDeleteReplyBottomSheet}
            description={deleteReplyTitle}
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
    isMyReply,
    showDeleteReplyBottomSheet,
    showReportBottomSheet,
    handleEditReply,
    t
  ]);

  const showDeleteReplyBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderDeleteReplyConfirmationContent,
        props: {
          flatListProps: null,
          modalHeight: APP_SCREEN_HEIGHT * 0.4
        },
        customProps: {
          scrollViewProps: null
        }
      })
    );
  }, [dispatch, renderDeleteReplyConfirmationContent]);

  const renderDeleteReplyConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        title={deleteReplyTitle}
        description={t("delete_reply_confirm", {
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
        onPress={handleDeleteReply}
        cancelText={t("cancel")}
        confirmText={t("delete_reply")}
        onBackPressedCb={handleMoreReplySettingsPressed}
      />
    ),
    [handleDeleteReply, handleMoreReplySettingsPressed, name, t, theme.colors.text]
  );

  const handleDeleteReply = useCallback(async () => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      post_pkey,
      reply_index: replySelector?.commentIndex,
      timestamp,
      index
    };
    await logEvent(REPLY_DETAILS_DELETE_REPLY, analyticsProps);
    commentsService
      .deleteReply(post_pkey, replySelector?.commentIndex, index, timestamp)
      .then(async data => {
        dispatch(replyDeleted(index));
        await logEvent(REPLY_DETAILS_DELETE_REPLY_SUCCESS, {
          ...analyticsProps,
          replies_counter: data?.replies_counter
        });

        !!commentSelector &&
          dispatch(
            commentUpserted({
              ...commentSelector,
              replies_counter: data?.replies_counter
            })
          );
        dispatch(
          showBottomSheet({
            Content: renderDeleteReplyContent,
            props: {
              flatListProps: null,
              modalHeight: APP_SCREEN_HEIGHT * 0.4
            }
          })
        );
      })
      .catch(async () => {
        await logEvent(REPLY_DETAILS_DELETE_REPLY_FAILED, analyticsProps);
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
    post_pkey,
    replySelector?.commentIndex,
    index,
    renderDeleteReplyContent,
    t,
    commentSelector
  ]);

  const renderDeleteReplyContent = useCallback(
    () => (
      <ConfirmContent
        onPress={modalizeRef.current?.close}
        title={t("delete_reply_success")}
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

  const handleEditReply = useCallback(() => {
    dispatch(setEditComment({ editCommentText: text, commentIndex: index }));
    modalizeRef.current?.close();
  }, [dispatch, text, index]);

  const handleMoreReplySettingsPressed = useCallback(() => {
    if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    if (isInCommentList) {
      return navigation.navigate("ReplyDetails", { commentIndex, isSponserShip });
    }
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent,
        props: {
          flatListProps: null,
          HeaderComponent: null,
          modalHeight: APP_SCREEN_HEIGHT * (isMyReply ? 0.22 : 0.13)
        }
      })
    );
  }, [
    isInCommentList,
    navigation,
    commentIndex,
    dispatch,
    bottomSheetContent,
    isMyReply,
    isSponserShip,
    loggedInUser
  ]);

  const handleLikePressed = useCallback(async () => {
    if (!loggedInUser || Object.keys(loggedInUser).length === 0) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      post_pkey,
      reply_index: replySelector?.commentIndex,
      timestamp,
      index,
      is_like: !isLiked
    };
    await logEvent(REPLY_DETAILS_LIKE_REPLY, analyticsProps);

    if (!isLiked) {
      if (enable_sounds) {
        playSoundFile("like.mp3");
      }
      dispatch(replyUpserted({ ...replySelector, isLiked: true, likes: likes + 1 }));
      commentsService
        .likeReply(post_pkey, replySelector?.commentIndex, index)
        .then(
          async () => await logEvent(REPLY_DETAILS_LIKE_REPLY_SUCCESS, analyticsProps)
        )
        .catch(async error => {
          dispatch(replyUpserted({ ...replySelector, isLiked: false, likes: likes - 1 }));
          await logEvent(REPLY_DETAILS_LIKE_REPLY_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: likeReply --Reply.tsx-- postPkey=${post_pkey} comment=${replySelector?.commentIndex} index=${index} ${error}`
          );
        });
    } else {
      dispatch(replyUpserted({ ...replySelector, isLiked: false, likes: likes - 1 }));
      commentsService
        .unlikeReply(post_pkey, replySelector?.commentIndex, index)
        .then(
          async () => await logEvent(REPLY_DETAILS_LIKE_REPLY_SUCCESS, analyticsProps)
        )
        .catch(async error => {
          dispatch(replyUpserted({ ...replySelector, isLiked: true, likes: likes + 1 }));
          await logEvent(REPLY_DETAILS_LIKE_REPLY_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: unlikeReply --Reply.tsx-- postPkey=${post_pkey} comment=${replySelector?.commentIndex} index=${index} ${error}`
          );
        });
    }
  }, [
    loggedInUser,
    isLiked,
    navigation,
    enable_sounds,
    post_pkey,
    replySelector,
    index,
    dispatch,
    likes
  ]);

  const handleReplyOnComment = useCallback(() => {
    dispatch(
      setReplyOnComment({
        replyCommentText: "",
        commentIndex: index,
        originalCommentorName: name
      })
    );
  }, [dispatch, index, name]);

  const handleShowMoreReplies = useCallback(() => {
    return navigation.navigate("ReplyDetails", { commentIndex, isSponserShip });
  }, [navigation, commentIndex, isSponserShip]);

  return (
    <View style={containerWrapperStyle}>
      {repliesCount > 1 && (
        <TouchableOpacity onPress={handleShowMoreReplies}>
          <CText fontFamily="thin" fontSize={12} color="black">
            {`${t("show")} ${t("previous_replies.humanized", {
              count: repliesCount - 1
            })} ...`}
          </CText>
        </TouchableOpacity>
      )}
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
          <View style={replyWrapperStyle}>
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
              <TouchableOpacity onPress={handleMoreReplySettingsPressed}>
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
            >
              {text}
            </InlineReadMore>
          </View>
          <View style={replyActionWrapperStyle}>
            <>
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
              {isInCommentList && (
                <TouchableOpacity
                  style={likeCommentButtonContainerStyle}
                  onPress={handleMoreReplySettingsPressed}
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
              )}
            </>
            <View style={commentTimeWrapperStyle}>
              <CText fontSize={11} lineHeight={15} style={userDetailsTextStyle} disabled>
                {moment(index).fromNow()}
              </CText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Reply;
