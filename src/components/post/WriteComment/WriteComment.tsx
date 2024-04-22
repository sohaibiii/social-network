import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Keyboard, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { useTheme } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
  FadeOutDown,
  runOnJS
} from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";

import styles from "./WriteComment.styles";

import { RootState } from "~/redux/store";

import commentsService from "~/apiServices/comments";
import IMAGES from "~/assets/images";
import {
  CText,
  Icon,
  IconTypes,
  TextInput,
  UserProfileAvatar
} from "~/components/common";
import { APP_SCREEN_WIDTH } from "~/constants/variables";
import {
  commentAdded,
  postUpserted,
  commentUpserted,
  replyAdded,
  replyUpserted
} from "~/redux/reducers/home.reducer";
import { clearEditComment, clearReplyOnComment } from "~/redux/reducers/social.reducer";
import { PostClass } from "~/redux/types/propertySocialAction.types";
import {
  logEvent,
  POST_DETAILS_ADD_COMMENT,
  POST_DETAILS_ADD_COMMENT_FAILED,
  POST_DETAILS_ADD_COMMENT_SUCCESS,
  POST_DETAILS_ADD_REPLY,
  POST_DETAILS_ADD_REPLY_FAILED,
  POST_DETAILS_ADD_REPLY_SUCCESS,
  POST_DETAILS_EDIT_COMMENT,
  POST_DETAILS_EDIT_COMMENT_FAILED,
  POST_DETAILS_EDIT_COMMENT_SUCCESS,
  REPLY_DETAILS_ADD_REPLY,
  REPLY_DETAILS_ADD_REPLY_FAILED,
  REPLY_DETAILS_ADD_REPLY_SUCCESS,
  REPLY_DETAILS_EDIT_REPLY,
  REPLY_DETAILS_EDIT_REPLY_FAILED,
  REPLY_DETAILS_EDIT_REPLY_SUCCESS
} from "~/services/";
import { playSoundFile } from "~/services/soundPlayer";
import { generalErrorHandler } from "~/utils/";
import { moderateScale } from "~/utils/responsivityUtil";

const AnimatedView = Animated.createAnimatedComponent(View);

const MAX_COMMENT_LENGTH = 300;
const ANALYTICS_SOURCE = "write_a_comment";

const WriteComment = (props: any): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const {
    timestamp,
    postPkey,
    scrollToFirstCommentCb,
    isReplyDetailsPage = false,
    replyDetailsCommentIndex,
    isSponserShip
  } = props;

  const textInputRef = useRef(null);

  const {
    isEdit: isEditComment,
    editCommentText,
    isReplyOnComment,
    replyCommentText,
    originalCommentorName,
    commentIndex,
    isOriginalCommentInReplyDetails
  } = useSelector((state: RootState) => state.social) || {};

  const [isSendButtonShown, setIsSendButtonShown] = useState(false);
  const [commentValue, setCommentValue] = useState(editCommentText ?? "");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const commentSelector =
    useSelector(
      (state: RootState) =>
        state.home.comments.entities[
          isReplyDetailsPage ? replyDetailsCommentIndex : commentIndex
        ]
    ) || {};
  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const postSelector = useSelector(
    (state: RootState) => state.home.posts.entities[postPkey]
  );
  const userInfo = useSelector((state: RootState) => state.auth.userInfo) || {};
  const { profile: profile_image, roles = [], name = "", uuid } = userInfo;
  const isLoggedInUser = Object.keys(userInfo).length > 0;

  const initialWidth = moderateScale(40) + 15;
  const othersWidth = initialWidth + moderateScale(35) + 10;

  useEffect(() => {
    // textInputRef?.current?.focus();
    setCommentValue(editCommentText);
    handleOnFocus();
  }, [editCommentText]);

  const textInputOffset = useSharedValue(APP_SCREEN_WIDTH - initialWidth);

  const animatedSTextInputStyles = useAnimatedStyle(() => {
    return {
      width: textInputOffset.value
    };
  });

  const handleTextChanged = text => {
    if (!isLoggedInUser) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    textInputOffset.value = withSpring(
      text.length ? APP_SCREEN_WIDTH - othersWidth : APP_SCREEN_WIDTH - initialWidth,
      runOnJS(animateSend(text))
    );
  };

  const handleOnFocus = () => {
    return scrollToFirstCommentCb();
  };

  const animateSend = text => {
    setCommentValue(text);
    setIsSendButtonShown(!!text.length);
  };

  const handleSubmitComment = async () => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      post_pkey: postPkey
    };

    if (isReplyDetailsPage) {
      if (isEditComment) {
        await logEvent(REPLY_DETAILS_EDIT_REPLY, analyticsProps);

        if (isOriginalCommentInReplyDetails) {
          setIsCommentSubmitting(true);
          return commentsService
            .updateComment(postPkey, commentIndex, commentValue)
            .then(async res => {
              Keyboard.dismiss();
              const { ProcessInfo, created_by, ...restOfComment } = res;
              await logEvent(REPLY_DETAILS_EDIT_REPLY_SUCCESS, {
                ...analyticsProps,
                created_by: created_by.id
              });

              dispatch(
                commentUpserted({
                  ...restOfComment,
                  created_by: created_by.id,
                  post_pkey: postPkey
                })
              );

              setCommentValue("");
              dispatch(clearEditComment(""));
            })
            .catch(async error => {
              await logEvent(REPLY_DETAILS_EDIT_REPLY_FAILED, analyticsProps);
              generalErrorHandler(
                `Error: updateComment --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
              );
            })
            .finally(() => {
              setIsCommentSubmitting(false);
              setIsSendButtonShown(false);
              textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
            });
        }
        setIsCommentSubmitting(true);
        return commentsService
          .updateReply(postPkey, replyDetailsCommentIndex, commentIndex, commentValue)
          .then(res => {
            Keyboard.dismiss();
            const { ProcessInfo, created_by, ...restOfReply } = res;

            dispatch(
              replyUpserted({
                ...restOfReply,
                created_by: created_by.id,
                post_pkey: postPkey
              })
            );

            setCommentValue("");
            dispatch(clearEditComment(""));
          })
          .catch(error => {
            generalErrorHandler(
              `Error: updateReply --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
            );
          })
          .finally(() => {
            setIsCommentSubmitting(false);
            setIsSendButtonShown(false);
            textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
          });
      }
      await logEvent(REPLY_DETAILS_ADD_REPLY, analyticsProps);

      setIsCommentSubmitting(true);
      return commentsService
        .addReply(postPkey, replyDetailsCommentIndex, commentValue)
        .then(async res => {
          Keyboard.dismiss();

          const { ProcessInfo, created_by, ...resOfReply } = res || {};
          await logEvent(REPLY_DETAILS_ADD_REPLY_SUCCESS, {
            ...analyticsProps,
            created_by: created_by.id
          });

          dispatch(
            replyAdded({
              ...resOfReply,
              created_by: created_by.id,
              commentIndex: replyDetailsCommentIndex
            })
          );
          setCommentValue("");

          dispatch(
            commentUpserted({
              ...commentSelector,
              replies_counter: commentSelector.replies_counter + 1
            })
          );
          dispatch(clearEditComment(""));
        })
        .catch(async error => {
          await logEvent(REPLY_DETAILS_ADD_REPLY_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: addReply --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
          );
        })
        .finally(() => {
          setIsCommentSubmitting(false);
          setIsSendButtonShown(false);
          textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
        });
    }
    if (isReplyOnComment) {
      await logEvent(POST_DETAILS_ADD_REPLY, analyticsProps);

      setIsCommentSubmitting(true);

      return commentsService
        .addReply(postPkey, commentIndex, commentValue)
        .then(async res => {
          await logEvent(POST_DETAILS_ADD_REPLY_SUCCESS, analyticsProps);

          Keyboard.dismiss();

          setCommentValue("");

          dispatch(
            commentUpserted({
              ...commentSelector,
              replies_counter: commentSelector.replies_counter + 1
            })
          );
          dispatch(clearEditComment(""));
        })
        .catch(async error => {
          await logEvent(POST_DETAILS_ADD_REPLY_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: addReply --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
          );
        })
        .finally(() => {
          setIsCommentSubmitting(false);
          setIsSendButtonShown(false);
          textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
        });
    }
    if (isEditComment) {
      await logEvent(POST_DETAILS_EDIT_COMMENT, analyticsProps);

      setIsCommentSubmitting(true);

      return commentsService
        .updateComment(postPkey, commentIndex, commentValue)
        .then(async res => {
          Keyboard.dismiss();
          const { ProcessInfo, created_by, ...restOfComment } = res;
          await logEvent(POST_DETAILS_EDIT_COMMENT_SUCCESS, {
            ...analyticsProps,
            created_by: created_by.id
          });

          dispatch(
            commentUpserted({
              ...restOfComment,
              created_by: created_by.id,
              post_pkey: postPkey
            })
          );

          setCommentValue("");
          dispatch(clearEditComment(""));
        })
        .catch(async error => {
          await logEvent(POST_DETAILS_EDIT_COMMENT_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: editComment --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
          );
        })
        .finally(() => {
          setIsCommentSubmitting(false);
          setIsSendButtonShown(false);
          textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
        });
    }
    setIsCommentSubmitting(true);
    if (enable_sounds) {
      playSoundFile("comment.mp3");
    }
    await logEvent(POST_DETAILS_ADD_COMMENT, analyticsProps);
    commentsService
      .addComment(
        postPkey,
        timestamp,
        commentValue,
        isSponserShip ? PostClass.SPONSORED : PostClass.POST
      )
      .then(async res => {
        Keyboard.dismiss();
        const { ProcessInfo, created_by, ...restOfComment } = res;
        await logEvent(POST_DETAILS_ADD_COMMENT_SUCCESS, {
          ...analyticsProps,
          created_by: created_by.id
        });
        !!postSelector &&
          dispatch(
            postUpserted({
              ...postSelector,
              comments_counter: postSelector.comments_counter + 1
            })
          );
        dispatch(
          commentAdded({
            ...restOfComment,
            created_by: created_by.id,
            post_pkey: postPkey
          })
        );
        setCommentValue("");
      })
      .catch(async error => {
        await logEvent(POST_DETAILS_ADD_COMMENT_FAILED, analyticsProps);
        generalErrorHandler(
          `Error: addComment --WriteComment.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
        );
      })
      .finally(() => {
        setIsCommentSubmitting(false);
        setIsSendButtonShown(false);
        textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
      });
  };
  const handleClearReplyOnComment = () => {
    dispatch(clearReplyOnComment(""));
  };

  const {
    profileImageWrapperStyle,
    profileImageStyle,
    containerStyle,
    textInputWrapperStyle,
    sendIconStyle,
    replyWrapperStyles,
    closeReplyWrapperStyle,
    writeCommentWrapperStyle,
    commentTextInputStyle,
    replyOnCommentTextStyle,
    originalCommentorWrapperStyle
  } = useMemo(() => styles(theme), [theme]);
  const isRahhal = roles.length > 0;

  return (
    <View style={containerStyle}>
      {!!isReplyOnComment && (
        <AnimatedView
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={replyWrapperStyles}
        >
          <CText style={replyOnCommentTextStyle} color="white" fontSize={13}>
            {t("reply_on")}
          </CText>
          <View style={originalCommentorWrapperStyle}>
            <CText fontSize={13} lineHeight={16}>
              {originalCommentorName}
            </CText>
          </View>
          <TouchableOpacity
            style={closeReplyWrapperStyle}
            onPress={handleClearReplyOnComment}
          >
            <Icon
              style={sendIconStyle}
              type={IconTypes.SAFARWAY_ICONS}
              disabled
              name={"close_white"}
              width={moderateScale(17)}
              height={moderateScale(17)}
            />
          </TouchableOpacity>
        </AnimatedView>
      )}

      <View style={writeCommentWrapperStyle}>
        <View style={profileImageWrapperStyle}>
          {isLoggedInUser ? (
            <UserProfileAvatar
              isRahhal={isRahhal}
              name={name}
              profile={profile_image}
              id={uuid}
              analyticsSource={ANALYTICS_SOURCE}
            />
          ) : (
            <FastImage style={profileImageStyle} source={IMAGES.user_profile_default} />
          )}
        </View>
        <Animated.View style={[textInputWrapperStyle, animatedSTextInputStyles]}>
          <TextInput
            multiline
            theme={{ roundness: 30 }}
            outlineColor={theme.colors.primary}
            style={commentTextInputStyle}
            placeholder={isReplyDetailsPage ? t("write_reply") : t("write_comment")}
            maxLength={MAX_COMMENT_LENGTH}
            placeholderTextColor={theme.colors.gray}
            onChangeText={handleTextChanged}
            value={commentValue}
            onFocus={handleOnFocus}
            ref={textInputRef}
          />
        </Animated.View>

        {isSendButtonShown && (
          <Icon
            style={sendIconStyle}
            type={IconTypes.SAFARWAY_ICONS}
            onPress={handleSubmitComment}
            name={"send"}
            width={moderateScale(35)}
            height={moderateScale(35)}
            disabled={isCommentSubmitting}
          />
        )}
      </View>
    </View>
  );
};

export default WriteComment;
