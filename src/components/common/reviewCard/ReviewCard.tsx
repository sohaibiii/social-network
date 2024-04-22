import React, { FC, memo, useCallback, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import FastImage from "react-native-fast-image";
import { Avatar, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

import { CText, modalizeRef, RatingBar } from "../";
import { Icon, IconTypes } from "../Icon";
import { RatingComponentTypes } from "../RatingBar/RatingComponent/RatingComponent.types";

import reviewCardStyle from "./reviewCard.styles";
import { ReviewCardProps } from "./reviewCard.types";

import { RootState } from "~/redux/store";

import { reviewAPI } from "~/apis/";
import { reviewService, articleCommentService } from "~/apiServices/index";
import settingsService from "~/apiServices/settings";
import { AddReviewModal } from "~/components/addReviewModal";
import { InlineReadMore } from "~/components/common";
import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { ConfirmContent, ReportPostButton } from "~/components/post";
import { UserProfileImage } from "~/components/profile";
import { ReportReviewContent } from "~/components/review/ReportReviewContent";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { setIsRefreshing } from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import {
  logEvent,
  REVIEW_CARD_EDIT_COMMENT,
  REVIEW_CARD_EDIT_COMMENT_FAILED,
  REVIEW_CARD_EDIT_COMMENT_SUCCESS,
  REVIEW_CARD_OPEN_COMMENT_MORE_MENU,
  REVIEW_CARD_UNLIKE_COMMENT,
  REVIEW_CARD_UNLIKE_COMMENT_FAILED,
  REVIEW_CARD_UNLIKE_COMMENT_SUCCESS,
  REVIEW_CARD_LIKE_COMMENT,
  REVIEW_CARD_LIKE_COMMENT_FAILED,
  REVIEW_CARD_LIKE_COMMENT_SUCCESS,
  REVIEW_CARD_DELETE_COMMENT,
  REVIEW_CARD_DELETE_COMMENT_FAILED,
  REVIEW_CARD_DELETE_COMMENT_SUCCESS,
  //
  REVIEW_CARD_EDIT_REVIEW,
  REVIEW_CARD_EDIT_REVIEW_FAILED,
  REVIEW_CARD_EDIT_REVIEW_SUCCESS,
  REVIEW_CARD_OPEN_REVIEW_MORE_MENU,
  REVIEW_CARD_UNLIKE_REVIEW,
  REVIEW_CARD_UNLIKE_REVIEW_FAILED,
  REVIEW_CARD_UNLIKE_REVIEW_SUCCESS,
  REVIEW_CARD_LIKE_REVIEW,
  REVIEW_CARD_LIKE_REVIEW_FAILED,
  REVIEW_CARD_LIKE_REVIEW_SUCCESS,
  REVIEW_CARD_DELETE_REVIEW,
  REVIEW_CARD_DELETE_REVIEW_FAILED,
  REVIEW_CARD_DELETE_REVIEW_SUCCESS,
  REVIEW_CARD_BLOCK_USER,
  REVIEW_CARD_BLOCK_USER_FAILED,
  REVIEW_CARD_BLOCK_USER_SUCCESS,
  SHOW_GALLERY
} from "~/services/analytics";
import { translate } from "~/translations/";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const ReviewCard: FC<ReviewCardProps> = props => {
  const {
    item,
    title = "",
    index,
    withStars = true,
    isRegularComment = false,
    onVoteChange,
    onEditCb = () => undefined,
    onDeleteCb = () => undefined,
    isArticle = false,
    analyticsType,
    reviewSource = ""
  } = props;
  const {
    index: date,
    created_by,
    rate,
    text,
    gallery,
    votes = 0,
    voteStatus = 0,
    isLiked: _isLiked,
    likes: _likes = 0,
    pkey
  } = item || {};
  const { name, profile, uuid, id } = created_by || {};
  const { t } = useTranslation();
  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const userUuid = useSelector((state: RootState) => state.auth.userInfo?.id);
  const service = isArticle ? articleCommentService : reviewService;
  const [votesCount, setVotesCount] = useState(votes);
  const [isLiked, setIsLiked] = useState(_isLiked);
  const [likes, setLikes] = useState(_likes);
  const [voteValue, setVoteValue] = useState(voteStatus);
  const isMyReview = (uuid || id) === userUuid;
  const dispatch = useDispatch();

  const { colors } = useTheme();
  const navigation = useNavigation();

  const {
    container,
    root,
    userImageContainer,
    voteContainer,
    flexStyle,
    headerContainer,
    nameStyle,
    ratingStyle,
    footerImageStyle,
    textContainerStyle,
    imagesContainer,
    bottomActionContainer,
    likeContainer,
    likeTextStyle,
    bottomSpacing,
    avatarLabelStyle
  } = reviewCardStyle(colors);

  let likeEvent = "",
    likeEventSuccess = "",
    likeEventFailed = "",
    unlikeEvent = "",
    unlikeEventSuccess = "",
    unlikeEventFailed = "",
    openMoreMenu = "",
    deleteEvent = "",
    deleteEventSuccess = "",
    deleteEventFailed = "",
    editEvent = "",
    editEventSuccess = "",
    editEventFailed = "",
    blockUserEvent = "",
    blockUserEventSuccess = "",
    blockUserEventFailed = "";

  switch (analyticsType) {
    case ReviewCardAnalyticsTypes.ARTICLE:
      likeEvent = `article_details${REVIEW_CARD_LIKE_COMMENT}`;
      likeEventSuccess = `article_details${REVIEW_CARD_LIKE_COMMENT_SUCCESS}`;
      likeEventFailed = `article_details${REVIEW_CARD_LIKE_COMMENT_FAILED}`;
      unlikeEvent = `article_details${REVIEW_CARD_UNLIKE_COMMENT}`;
      unlikeEventSuccess = `article_details${REVIEW_CARD_UNLIKE_COMMENT_SUCCESS}`;
      unlikeEventFailed = `article_details${REVIEW_CARD_UNLIKE_COMMENT_FAILED}`;
      openMoreMenu = `article_details${REVIEW_CARD_OPEN_COMMENT_MORE_MENU}`;
      deleteEvent = `article_details${REVIEW_CARD_DELETE_COMMENT}`;
      deleteEventSuccess = `article_details${REVIEW_CARD_DELETE_COMMENT_SUCCESS}`;
      deleteEventFailed = `article_details${REVIEW_CARD_DELETE_COMMENT_FAILED}`;
      editEvent = `article_details${REVIEW_CARD_EDIT_COMMENT}`;
      editEventSuccess = `article_details${REVIEW_CARD_EDIT_COMMENT_SUCCESS}`;
      editEventFailed = `article_details${REVIEW_CARD_EDIT_COMMENT_FAILED}`;
      blockUserEvent = `article_details${REVIEW_CARD_BLOCK_USER}`;
      blockUserEventSuccess = `article_details${REVIEW_CARD_BLOCK_USER_SUCCESS}`;
      blockUserEventFailed = `article_details${REVIEW_CARD_BLOCK_USER_FAILED}`;
      break;

    default:
      likeEvent = `${analyticsType}${REVIEW_CARD_LIKE_REVIEW}`;
      likeEventSuccess = `${analyticsType}${REVIEW_CARD_LIKE_REVIEW_SUCCESS}`;
      likeEventFailed = `${analyticsType}${REVIEW_CARD_LIKE_REVIEW_FAILED}`;
      unlikeEvent = `${analyticsType}${REVIEW_CARD_UNLIKE_REVIEW}`;
      unlikeEventSuccess = `${analyticsType}${REVIEW_CARD_UNLIKE_REVIEW_SUCCESS}`;
      unlikeEventFailed = `${analyticsType}${REVIEW_CARD_UNLIKE_REVIEW_FAILED}`;
      openMoreMenu = `${analyticsType}${REVIEW_CARD_OPEN_REVIEW_MORE_MENU}`;
      deleteEvent = `${analyticsType}${REVIEW_CARD_DELETE_REVIEW}`;
      deleteEventSuccess = `${analyticsType}${REVIEW_CARD_DELETE_REVIEW_SUCCESS}`;
      deleteEventFailed = `${analyticsType}${REVIEW_CARD_DELETE_REVIEW_FAILED}`;
      editEvent = `${analyticsType}${REVIEW_CARD_EDIT_REVIEW}`;
      editEventSuccess = `${analyticsType}${REVIEW_CARD_EDIT_REVIEW_SUCCESS}`;
      editEventFailed = `${analyticsType}${REVIEW_CARD_EDIT_REVIEW_FAILED}`;
      blockUserEvent = `${analyticsType}${REVIEW_CARD_BLOCK_USER}`;
      blockUserEventSuccess = `${analyticsType}${REVIEW_CARD_BLOCK_USER_SUCCESS}`;
      blockUserEventFailed = `${analyticsType}${REVIEW_CARD_BLOCK_USER_FAILED}`;
      break;
  }

  const handleVotePress = (offset: number) => () => {
    let currentValue = votesCount;
    let currentOffset = offset;

    if (offset == 1 && voteValue == -1) {
      currentOffset += 1;
    } else if (offset == -1 && voteValue == 1) {
      currentOffset -= 1;
    }

    if (voteValue == offset) {
      currentValue = votesCount - offset;
      setVoteValue(0);
      setVotesCount(votesCount - currentOffset);
    } else {
      currentValue = votesCount + offset;
      setVoteValue(offset);
      setVotesCount(votesCount + currentOffset);
    }
    onVoteChange && onVoteChange(currentValue);
  };

  const handleGalleryPressed = (index: number) => async () => {
    await logEvent(SHOW_GALLERY, {
      source: `${analyticsType}_page`,
      source_id: reviewSource,
      is_review: true,
      review_id: pkey
    });
    dispatch(
      showGalleryViewer({
        data: galleryFormatted,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: index || 0,
        sourceType: `${analyticsType}_page`,
        sourceIdentifier: reviewSource,
        isReview: true,
        reviewID: pkey
      })
    );
  };

  const openProfileHandler = () => {
    navigation.navigate("Profile", {
      uuid,
      hasBackButton: true
    });
  };

  const handleMoreReviewSettingsPressed = useCallback(async () => {
    await logEvent(openMoreMenu, {
      source: analyticsType,
      isLoggedIn: !!userToken
    });

    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    dispatch(
      showBottomSheet({
        Content: bottomSheetContent,
        props: {
          useDynamicSnapPoints: true,
          flatListProps: null,
          HeaderComponent: null
        }
      })
    );
  }, [dispatch, navigation, userToken]);

  const handleLikePressed = useCallback(async () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    const analyticsProps = { source: analyticsType, pkey };

    if (!isLiked) {
      await logEvent(likeEvent, analyticsProps);
      reviewAPI
        .likeReview(pkey, date)
        .then(() => {
          return logEvent(likeEventSuccess, {
            source: analyticsType,
            pkey
          });
        })
        .catch(() => {
          return logEvent(likeEventFailed, analyticsProps);
        });
      setIsLiked(true);
      setLikes(prev => prev + 1);
    } else {
      await logEvent(unlikeEvent, analyticsProps);

      reviewAPI
        .unlikeReview(pkey, date)
        .then(() => {
          return logEvent(unlikeEventSuccess, analyticsProps);
        })
        .catch(() => {
          return logEvent(unlikeEventFailed, analyticsProps);
        });
      setIsLiked(false);
      setLikes(prev => prev - 1);
    }
  }, [isLiked, navigation, pkey, userToken]);

  const galleryFormatted =
    gallery?.map(({ id }) => {
      return {
        uri: `${Config.SOCIAL_MEDIA_PREFIX}/${id}_sm.jpg`
      };
    }) || [];

  const firstNameCharacters = name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const renderBlockUserConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        onPress={() => modalizeRef.current?.close()}
        title={t("block_user_success", {
          interpolation: { escapeValue: false },
          user: name
        })}
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
    [name, t]
  );

  const showReportBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <ReportReviewContent
            onBackPressedCb={handleMoreReviewSettingsPressed}
            timestamp={date}
            pkey={pkey}
            analyticsType={analyticsType}
          />
        ),
        props: {
          useDynamicSnapPoints: true,
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
  }, [date, dispatch, handleMoreReviewSettingsPressed, pkey]);

  const renderDeleteReviewContent = useCallback(
    () => (
      <ConfirmContent
        onPress={modalizeRef.current?.close}
        title={
          isRegularComment ? t("delete_comment_success") : t("delete_review_success")
        }
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
    [t, isRegularComment]
  );

  const handleDeleteReview = useCallback(async () => {
    const analyticsProps = { source: analyticsType, pkey };
    await logEvent(deleteEvent, analyticsProps);
    service
      .deleteReview(pkey, date)
      .then(res => {
        dispatch(
          showBottomSheet({
            Content: renderDeleteReviewContent,
            props: {
              useDynamicSnapPoints: true,
              flatListProps: null
            }
          })
        );
        return res;
      })
      .then(res => {
        onDeleteCb(date, res);
        return logEvent(deleteEventSuccess, analyticsProps);
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(deleteEventFailed, analyticsProps);
      });
  }, [dispatch, pkey, renderDeleteReviewContent, index]);

  const handleBlockUser = useCallback(async () => {
    await logEvent(blockUserEvent, { source: analyticsType, uuid });
    settingsService
      .blockUserRequest(uuid)
      .then(() => {
        dispatch(setIsRefreshing({}));

        dispatch(
          showBottomSheet({
            Content: renderBlockUserConfirmationContent,
            props: {
              useDynamicSnapPoints: true,
              flatListProps: null
            }
          })
        );
        return logEvent(blockUserEventSuccess, { source: analyticsType, uuid });
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(blockUserEventFailed, { source: analyticsType, uuid });
      });
  }, [dispatch, renderBlockUserConfirmationContent, uuid]);

  const renderDeleteReviewConfirmationContent = useCallback(
    () => (
      <ConfirmContent
        title={
          isRegularComment
            ? t("delete_comment_description")
            : t("delete_review_description")
        }
        description={
          isRegularComment
            ? t("delete_comment_confirm")
            : t("delete_review_confirm", {
                interpolation: { escapeValue: false },
                user: name
              })
        }
        icon={
          <Icon
            type={IconTypes.FONTAWESOME}
            disabled
            name={"trash-o"}
            color={colors.text}
            size={scale(40)}
          />
        }
        hasLoading={true}
        onPress={handleDeleteReview}
        cancelText={t("cancel")}
        confirmText={isRegularComment ? t("delete_comment") : t("deleteReview")}
        onBackPressedCb={handleMoreReviewSettingsPressed}
      />
    ),
    [
      colors.text,
      handleDeleteReview,
      handleMoreReviewSettingsPressed,
      name,
      t,
      isRegularComment
    ]
  );

  const renderBlockUserContent = useCallback(
    () => (
      <ConfirmContent
        title={t("block_user_description")}
        description={t("block_user_confirm", {
          interpolation: { escapeValue: false },
          user: name
        })}
        icon={
          <Icon
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            disabled
            name={"block-helper"}
            color={colors.text}
            size={scale(40)}
          />
        }
        hasLoading={true}
        onPress={handleBlockUser}
        cancelText={t("cancel")}
        confirmText={t("blockUser")}
        onBackPressedCb={handleMoreReviewSettingsPressed}
      />
    ),
    [colors.text, handleBlockUser, handleMoreReviewSettingsPressed, name, t]
  );

  const showBlockUserBottomSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: renderBlockUserContent,
        props: {
          flatListProps: null,
          useDynamicSnapPoints: true
        }
      })
    );
  }, [dispatch, renderBlockUserContent]);

  const handleUpdateReview = async ({ text, rating, uploadedImageIds }) => {
    const analyticsProps = { source: analyticsType, pkey };
    await logEvent(editEvent, analyticsProps);
    service
      .updateReview(
        pkey,
        date,
        text.length > 0 ? text : null,
        rating,
        uploadedImageIds.length ? uploadedImageIds.map(item => ({ id: item })) : null
      )
      .then(res => {
        onEditCb(res);
        return logEvent(editEventSuccess, analyticsProps);
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        return logEvent(editEventFailed, analyticsProps);
      });
  };

  const showEditReviewBottomSheet = useCallback(() => {
    modalizeRef.current?.close();
    dispatch(
      showBottomSheet({
        Content: () => (
          <AddReviewModal
            name={title}
            initialText={text}
            initialRate={rate}
            initialGallery={gallery?.map(image => ({
              uri: `${Config.SOCIAL_MEDIA_PREFIX}/${image.id}_md.jpg`,
              alreadyUploaded: image?.status === "COMPLETE",
              uuid: image.id,
              id: image.id,
              name: image.id,
              fileName: image.id
            }))}
            onSubmit={handleUpdateReview}
            withStars={withStars}
          />
        ),
        customProps: {},
        props: {
          modalHeight: APP_SCREEN_HEIGHT,
          closeOnOverlayTap: true,
          panGestureEnabled: false,
          withoutHeaderMargin: true,
          withHandle: false,
          fullScreen: true
        }
      })
    );
  }, [dispatch, handleUpdateReview, rate, text, title, withStars, gallery]);

  const showDeleteReviewBottomSheet = useCallback(async () => {
    dispatch(
      showBottomSheet({
        Content: renderDeleteReviewConfirmationContent,
        props: {
          flatListProps: null,
          useDynamicSnapPoints: true
        }
      })
    );
  }, [dispatch, renderDeleteReviewConfirmationContent]);

  const bottomSheetContent: Element = useCallback(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    return (
      <View layout={LayoutAnimation.easeInEaseOut()} style={bottomSpacing}>
        {isMyReview ? (
          <>
            <ReportPostButton
              onPress={showEditReviewBottomSheet}
              title={isRegularComment ? t("edit_comment") : t("editReview")}
              description={
                isRegularComment
                  ? t("edit_comment_description")
                  : t("edit_review_description")
              }
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"edit"}
                  color={colors.text}
                  size={scale(24)}
                />
              }
            />
            <ReportPostButton
              title={isRegularComment ? t("delete_comment") : t("deleteReview")}
              onPress={showDeleteReviewBottomSheet}
              description={
                isRegularComment
                  ? t("delete_comment_description")
                  : t("delete_review_description")
              }
              icon={
                <Icon
                  type={IconTypes.FONTAWESOME}
                  disabled
                  name={"trash-o"}
                  color={colors.text}
                  size={scale(25)}
                />
              }
            />
          </>
        ) : (
          <>
            <ReportPostButton
              onPress={showReportBottomSheet}
              title={isRegularComment ? t("report_comment") : t("reportReview")}
              description={
                isRegularComment
                  ? t("report_comment_description")
                  : t("report_review_description")
              }
              icon={
                <Icon
                  type={IconTypes.FEATHER}
                  disabled
                  name={"alert-octagon"}
                  color={colors.text}
                  size={scale(24)}
                />
              }
            />
            <ReportPostButton
              title={t("blockUser")}
              onPress={showBlockUserBottomSheet}
              description={t("block_user_description")}
              icon={
                <Icon
                  type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                  disabled
                  name={"block-helper"}
                  color={colors.text}
                  size={scale(20)}
                />
              }
            />
          </>
        )}
      </View>
    );
  }, [
    bottomSpacing,
    colors.text,
    isMyReview,
    showBlockUserBottomSheet,
    showDeleteReviewBottomSheet,
    showEditReviewBottomSheet,
    showReportBottomSheet,
    t,
    isRegularComment
  ]);

  return (
    <View style={container}>
      <View style={root}>
        <View style={userImageContainer}>
          {profile ? (
            <UserProfileImage
              source={{ uri: profile }}
              height={moderateScale(40)}
              width={moderateScale(40)}
              borderRadius={10}
              onPress={openProfileHandler}
            />
          ) : (
            <Avatar.Text
              size={moderateScale(40)}
              label={firstNameCharacters}
              labelStyle={avatarLabelStyle}
            />
          )}
        </View>
        <View style={flexStyle}>
          <View>
            <View style={headerContainer}>
              <View style={flexStyle}>
                <TouchableOpacity onPress={openProfileHandler}>
                  <CText color="primary" fontSize={14} style={nameStyle} lineHeight={25}>
                    {name}
                  </CText>
                </TouchableOpacity>
                {withStars ? (
                  <RatingBar
                    ratingCount={5}
                    defaultValue={rate}
                    type={RatingComponentTypes.STAR}
                    size={scale(16)}
                    spacing={2}
                    disabled
                    containerStyle={ratingStyle}
                  />
                ) : null}
              </View>
              <View>
                <CText fontSize={12} fontFamily="thin">
                  {moment(date).fromNow()}
                </CText>
              </View>
              <TouchableOpacity onPress={handleMoreReviewSettingsPressed}>
                <Icon
                  type={IconTypes.FEATHER}
                  name={"more-vertical"}
                  size={moderateScale(22)}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={textContainerStyle}>
        {!!text && (
          <InlineReadMore
            maxNumberOfLinesToShow={3}
            isAutoLink
            key={text}
            textProps={{
              fontFamily: "thin",
              style: {
                lineHeight: 26
              }
            }}
          >
            {text}
          </InlineReadMore>
        )}
      </View>
      <View>
        {!!gallery && gallery?.length > 0 && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={imagesContainer}
          >
            {gallery.map(({ id }, index) => {
              return (
                <TouchableOpacity key={id} onPress={handleGalleryPressed(index)}>
                  <FastImage
                    source={{ uri: `${Config.SOCIAL_MEDIA_PREFIX}/${id}_sm.jpg` }}
                    style={footerImageStyle}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
      <View style={bottomActionContainer}>
        <TouchableOpacity onPress={handleLikePressed} style={likeContainer}>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={isLiked ? "like_selected" : "like"}
            width={RFValue(16)}
            height={RFValue(16)}
            onPress={handleLikePressed}
          />
          <CText fontSize={11} fontFamily="thin" lineHeight={25} style={likeTextStyle}>
            {t("like")}
          </CText>
          {likes ? (
            <CText fontSize={12} fontFamily="thin">
              ({likes})
            </CText>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ReviewCard);
