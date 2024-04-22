import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Keyboard, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { useTheme, Avatar } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
  FadeOutDown,
  runOnJS
} from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";

import styles from "./WriteCommentPostModal.styles";

import { RootState } from "~/redux/store";

import commentsService from "~/apiServices/comments";
import IMAGES from "~/assets/images";
import { CText, Icon, IconTypes, TextInput } from "~/components/common";
import { APP_SCREEN_WIDTH, PLATFORM } from "~/constants/variables";
import {
  commentAdded,
  postUpserted,
  commentUpserted,
  replyAdded,
  replyUpserted
} from "~/redux/reducers/home.reducer";
import { clearEditComment, clearReplyOnComment } from "~/redux/reducers/social.reducer";
import { playSoundFile } from "~/services/soundPlayer";
import { generalErrorHandler } from "~/utils/";
import { scale, moderateScale } from "~/utils/responsivityUtil";

const AnimatedView = Animated.createAnimatedComponent(View);

const MAX_COMMENT_LENGTH = 300;

const WriteCommentPostModal = (props: any): JSX.Element => {
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
    style = {}
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

  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

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

  const postSelector = useSelector(
    (state: RootState) => state.home.posts.entities[postPkey]
  );
  const userInfo = useSelector((state: RootState) => state.auth.userInfo) || {};
  const { profile: profile_image, roles = [], name = "" } = userInfo;
  const isLoggedInUser = Object.keys(userInfo).length > 0;

  const initialWidth = moderateScale(40) + 15;
  const othersWidth = initialWidth + moderateScale(35) + 10;

  useEffect(() => {
    // textInputRef?.current?.focus();
    setCommentValue(editCommentText);
    handleTextInputFocused();
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

  const handleTextInputFocused = useCallback(() => {
    return scrollToFirstCommentCb();
  }, []);

  const animateSend = text => {
    setCommentValue(text);
    setIsSendButtonShown(!!text.length);
  };

  const handleSubmitComment = () => {
    if (isReplyDetailsPage) {
      if (isEditComment) {
        if (isOriginalCommentInReplyDetails) {
          setIsCommentSubmitting(true);
          return commentsService
            .updateComment(postPkey, commentIndex, commentValue)
            .then(res => {
              Keyboard.dismiss();
              const { ProcessInfo, created_by, ...restOfComment } = res;

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
            .catch(error => {
              generalErrorHandler(
                `Error: updateComment --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
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
              `Error: updateReply --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyDetailsCommentIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
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
        .addReply(postPkey, replyDetailsCommentIndex, commentValue)
        .then(res => {
          Keyboard.dismiss();

          const { ProcessInfo, created_by, ...resOfReply } = res || {};
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
        .catch(error => {
          generalErrorHandler(
            `Error: addReply --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
          );
        })
        .finally(() => {
          setIsCommentSubmitting(false);
          setIsSendButtonShown(false);
          textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
        });
    }
    if (isReplyOnComment) {
      setIsCommentSubmitting(true);

      return commentsService
        .addReply(postPkey, commentIndex, commentValue)
        .then(res => {
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
        .catch(error => {
          generalErrorHandler(
            `Error: addReply --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
          );
        })
        .finally(() => {
          setIsCommentSubmitting(false);
          setIsSendButtonShown(false);
          textInputOffset.value = withSpring(APP_SCREEN_WIDTH - initialWidth);
        });
    }
    if (isEditComment) {
      setIsCommentSubmitting(true);

      return commentsService
        .updateComment(postPkey, commentIndex, commentValue)
        .then(res => {
          Keyboard.dismiss();
          const { ProcessInfo, created_by, ...restOfComment } = res;

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
        .catch(error => {
          generalErrorHandler(
            `Error: updateComment --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} replyIndex=${replyDetailsCommentIndex} commentIndex=${commentIndex} ${error}`
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
    commentsService
      .addComment(postPkey, timestamp, commentValue)
      .then(res => {
        Keyboard.dismiss();
        const { ProcessInfo, created_by, ...restOfComment } = res;
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
      .catch(error => {
        generalErrorHandler(
          `Error: addComment --WriteCommentPostModal.tsx-- timestamp=${timestamp} postPkey=${postPkey} commentIndex=${commentIndex} ${error}`
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
    rahhalStyle,
    profileImageStyle,
    rahhalProfileImageStyle,
    containerStyle,
    textInputWrapperStyle,
    sendIconStyle,
    replyWrapperStyles,
    closeReplyWrapperStyle,
    writeCommentWrapperStyle,
    commentTextInputStyle,
    replyOnCommentTextStyle,
    originalCommentorWrapperStyle,
    avatarLabelStyle
  } = styles(theme);

  const isRahhal = roles.length > 0;
  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const containerStyles = [containerStyle, style];

  return (
    <View style={containerStyles}>
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
            <>
              {profile_image ? (
                <FastImage
                  style={isRahhal ? rahhalProfileImageStyle : profileImageStyle}
                  source={{ uri: `${profile_image}` }}
                />
              ) : (
                <Avatar.Text
                  size={moderateScale(40)}
                  label={firstNameCharacters}
                  labelStyle={avatarLabelStyle}
                />
              )}
              {isRahhal && (
                <View style={rahhalStyle}>
                  <Icon
                    type={IconTypes.SAFARWAY_ICONS}
                    name={"traveller_badge_icon"}
                    width={scale(20)}
                    height={scale(35)}
                    startColor={theme.colors.white}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </>
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
            placeholder={t("write_comment")}
            maxLength={MAX_COMMENT_LENGTH}
            placeholderTextColor={theme.colors.gray}
            onChangeText={handleTextChanged}
            value={commentValue}
            onFocus={handleTextInputFocused}
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

export default WriteCommentPostModal;
