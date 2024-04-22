import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme, Badge, Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import styles from "./ArticleDetails.styles";

import { RootState } from "~/redux/store";

import { commentsAPI } from "~/apis/";
import articleService from "~/apiServices/article";
import { Category, Article } from "~/apiServices/article/article.types";
import articleCommentService from "~/apiServices/articleComment";
import { CommentsType } from "~/apiServices/comments/comments.types";
import { Review, ReviewsType } from "~/apiServices/review/review.types";
import { AddReviewModal } from "~/components/addReviewModal";
import { ArticleMarkdown } from "~/components/articles";
import { Button, Icon, IconTypes, ReviewCard } from "~/components/common";
import { CText, ProgressiveImage, ParallaxHeaderScrollView } from "~/components/common";
import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";
import { UserProfileImage } from "~/components/profile/userProfileImage";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { loadNewUsers } from "~/redux/reducers/home.reducer";
import { AppStackRoutesArticleDetailsProps } from "~/router/Router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  SHARE_ARTICLE_INITIATE,
  SHARE_ARTICLE_FAILED,
  SHARE_ARTICLE_SUCCESS,
  REVIEW_CARD_ADD_COMMENT_SUCCESS,
  REVIEW_CARD_ADD_COMMENT_FAILED,
  REVIEW_CARD_ADD_COMMENT,
  SHOW_GALLERY
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { playSoundFile } from "~/services/soundPlayer";
import { generalErrorHandler, logError, scale } from "~/utils/";
import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const ANALYTICS_SOURCE = "article_details_page";
const DISPLAYABLE_COMMENTS_COUNT = 3;

const ArticleDetails = (props: AppStackRoutesArticleDetailsProps): JSX.Element => {
  const { route, navigation } = props;
  const { title, slug } = route?.params;
  const userToken = useSelector((state: RootState) => state?.auth?.userToken);
  const language = useSelector((state: RootState) => state.settings.language || "ar");
  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const parallaxHeaderHeight = verticalScale(260);
  const HeaderHeight = verticalScale(40) + insets.top;
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [reviews, setReviews] = useState<Review[] | undefined>();

  useEffect(() => {
    articleService
      .getArticle(slug)
      .then(data => {
        if (!data) {
          return;
        }

        setArticle(data);
        return articleCommentService.getContentReviews(
          data?.pkey,
          ReviewsType.ARTICLE,
          10
        );
      })
      .then(response => {
        const newUsers = response?.Items.map(review => {
          const { country, profileImage, profile, ...restOfProps } =
            review?.created_by ?? {};
          return {
            ...restOfProps,
            country_code: country?.id,
            country: country?.name,
            id: restOfProps.uuid,
            profile_image: profileImage,
            profile: profile
          };
        });

        dispatch(loadNewUsers(newUsers));
        setReviews(response.Items);
      })
      .catch(error =>
        logError(`Error: getArticle --ArticleDetails.tsx-- slug=${slug} ${error}`)
      );
  }, [slug]);

  const handleGoToUser = (uuid: string | undefined) => {
    navigation.navigate({
      name: "Profile",
      params: { uuid, hasBackButton: true }
    });
  };

  const { gallery, createdBy, travelCategories, timestamp, viewsCount } = article || {};
  const { name: createdByName, profileImage: createdByImage, uuid } = createdBy || {};

  const images = gallery?.map(item => {
    return {
      uri: `${Config.CONTENT_MEDIA_PREFIX}/${item.uuid}_md.jpg`,
      key: item.uuid,
      source: item.source,
      owner: item.owner
    };
  });

  const IMAGES_LENGTH = images?.length || 0;
  const coverPhoto = article?.featuredImageUUID
    ? `${Config.CONTENT_MEDIA_PREFIX}/${article?.featuredImageUUID}`
    : `${Config.CONTENT_MEDIA_PREFIX}/${
        Array.isArray(gallery) ? gallery[gallery.length - 1]?.uuid : ""
      }`;

  const handleSharePressed = async () => {
    setIsLoadingShare(true);
    await logEvent(SHARE_ARTICLE_INITIATE, {
      source: ANALYTICS_SOURCE,
      title: title.en,
      slug
    });
    handleCreateShareLink({
      action: DynamicLinksAction.ARTICLE,
      title: title[language],
      description: article?.summary,
      image: article?.featuredImageUUID || coverPhoto,
      params: {
        slug,
        title: title[language],
        imageUUID: article?.featuredImageUUID || coverPhoto
      }
    })
      .then(link => {
        return showShareView(link);
      })
      .then(async shareRes => {
        return logEvent(SHARE_ARTICLE_SUCCESS, {
          source: ANALYTICS_SOURCE,
          title: title.en,
          slug,
          ...shareRes
        });
      })
      .catch(error => {
        logError(
          `Error: handleCreateShareLink ---ArticleDetails.tsx---  slug=${slug} ${error}`
        );
        return logEvent(SHARE_ARTICLE_FAILED, {
          source: ANALYTICS_SOURCE,
          title: title.en,
          slug
        });
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  };

  const renderParallaxHeader = () => {
    return (
      <TouchableOpacity
        disabled={!images}
        style={parallaxHeaderWrapperStyle}
        onPress={showImageGallery}
      >
        <TouchableOpacity onPress={showImageGallery} style={parallaxHeaderTouchableStyle}>
          {coverPhoto !== "" && (
            <ProgressiveImage
              style={coverImageStyle}
              resizeMode={"cover"}
              thumbnailSource={{
                uri: `${coverPhoto}_xs.jpg`
              }}
              source={{
                uri: `${coverPhoto}_md.jpg`
              }}
              errorSource={{ uri: `${coverPhoto}_md.jpg` }}
            />
          )}
        </TouchableOpacity>
        <View style={overlayWrapperStyle} />
        {!!IMAGES_LENGTH && (
          <TouchableOpacity
            disabled={!images}
            style={imageGalleryIconWrapperStyle}
            onPress={showImageGallery}
          >
            <Icon
              type={IconTypes.ION_ICONS}
              name="ios-images-outline"
              size={23}
              color={"white"}
            />
            <CText
              color="white"
              fontSize={12}
              style={imagesLengthTextStyle}
            >{`(${IMAGES_LENGTH})`}</CText>
          </TouchableOpacity>
        )}
        {isLoadingShare ? (
          <View style={shareIconWrapperStyle}>
            <ActivityIndicator color={theme.colors.white} size={23} />
          </View>
        ) : (
          <TouchableOpacity style={shareIconWrapperStyle} onPress={handleSharePressed}>
            <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const showImageGallery = async () => {
    await logEvent(SHOW_GALLERY, {
      source: ANALYTICS_SOURCE,
      source_slug: slug,
      title
    });
    dispatch(
      showGalleryViewer({
        data: images,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0,
        sourceType: ANALYTICS_SOURCE,
        sourceIdentifier: slug
      })
    );
  };

  const renderStickyHeader = () => {
    return (
      <View style={stickyHeaderWrapperStyle}>
        <Appbar.BackAction
          style={stickyHeaderBackIconStyle}
          color={"white"}
          size={scale(18)}
          onPress={goBackHandler}
        />
        <View style={stickyHeaderTitleWrapperStyle}>
          <CText color="white" fontSize={12} numberOfLines={1} textAlign="center">
            {title[language]}
          </CText>
        </View>
      </View>
    );
  };

  const onShowMorePress = () => {
    navigation.navigate("Reviews", {
      pkey: article?.pkey,
      withStars: false,
      name: article?.title,
      ts: article?.timestamp,
      reviewsType: ReviewsType.ARTICLE,
      parentReviews: reviews,
      setParentReviews: setReviews
    });
  };

  const goBackHandler = () => {
    navigation.goBack();
  };

  const onAddComment = async ({ text }) => {
    if (enable_sounds) {
      playSoundFile("comment.mp3");
    }
    await logEvent(`article_details${REVIEW_CARD_ADD_COMMENT}`, {
      source: ANALYTICS_SOURCE,
      article_pkey: article?.pkey
    });

    commentsAPI
      .addComment(article?.pkey, null, text, CommentsType.ARTICLE)
      .then(({ data }) => {
        setReviews(prev => {
          return [data, ...prev];
        });

        return logEvent(`article_details${REVIEW_CARD_ADD_COMMENT_SUCCESS}`, {
          source: ANALYTICS_SOURCE,
          pkey: data?.pkey,
          status: data?.status,
          article_pkey: article?.pkey
        });
      })
      .catch(error => {
        generalErrorHandler(
          `Error: addComment --ArticleDetails.tsx-- pkey=${article?.pkey} ${error}`
        );
        return logEvent(`article_details${REVIEW_CARD_ADD_COMMENT_FAILED}`, {
          source: ANALYTICS_SOURCE,
          article_pkey: article?.pkey
        });
      });
  };

  const onAddReviewPress = () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    dispatch(
      showBottomSheet({
        Content: () => (
          <AddReviewModal
            onSubmit={onAddComment}
            name={title[language]}
            withStars={false}
          />
        ),
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
  };

  function updateReview(newReview: Review) {
    setReviews(
      reviews?.map(review => {
        if (review?.index !== newReview.index) {
          return review;
        }
        return {
          ...review,
          ...newReview
        };
      })
    );
  }

  function deleteReview(newIndex: string) {
    setReviews(prev => prev?.filter(item => item?.index !== newIndex));
  }

  const {
    safeareaViewStyle,
    authorWrapperStyle,
    userProfileImageStyle,
    titleTextStyle,
    parallaxBodyWrapperStyle,
    parallaxBodyBackground,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    shareIconWrapperStyle,
    imageGalleryIconWrapperStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    imagesLengthTextStyle,
    badgeWrapperStyle,
    badgeStyle,
    viewCountTextStyle,
    viewCountWrapperStyle,
    overlayWrapperStyle,
    coverImageStyle,
    commentTextStyle,
    moreButtonContainer,
    moreButtonStyle,
    moreButtonLabelStyle,
    commentsHeaderContainer,
    buttonContainer,
    reviewCardsContainerStyle,
    summaryTextStyle
  } = styles(theme, insets, parallaxHeaderHeight);

  return (
    <View style={safeareaViewStyle}>
      <Appbar.BackAction
        style={backIconStyle}
        color={"white"}
        size={scale(18)}
        onPress={goBackHandler}
      />
      <ParallaxHeaderScrollView
        parallaxHeaderHeight={parallaxHeaderHeight}
        stickyHeaderHeight={HeaderHeight}
        parallaxHeader={renderParallaxHeader}
        stickyHeader={renderStickyHeader}
      >
        <TouchableOpacity disabled activeOpacity={1} style={parallaxBodyWrapperStyle}>
          <View style={parallaxBodyBackground}>
            <View style={badgeWrapperStyle}>
              {travelCategories?.map((category: Category, index: number) => {
                const { id, name } = category;
                return (
                  <Badge key={`${id}-${index}`} style={badgeStyle} size={24}>
                    {name}
                  </Badge>
                );
              })}
            </View>
            {!!viewsCount && (
              <View style={viewCountWrapperStyle}>
                <Icon
                  type={IconTypes.ANT_DESIGN}
                  name="eyeo"
                  size={18}
                  color={theme.colors.primary_blue}
                />
                <CText
                  fontSize={11}
                  lineHeight={18}
                  color="primary_blue"
                  style={viewCountTextStyle}
                >
                  {viewsCount} {t("views.humanized", { count: viewsCount })}
                </CText>
              </View>
            )}

            <CText fontSize={18} style={titleTextStyle}>
              {title[language]}
            </CText>

            <View style={authorWrapperStyle}>
              <UserProfileImage
                source={{ uri: `${createdByImage}` }}
                height={moderateScale(40)}
                width={moderateScale(40)}
                borderRadius={moderateScale(10)}
                onPress={() => handleGoToUser(uuid)}
                style={userProfileImageStyle}
                shouldRenderProgressive={false}
              />
              <View>
                <CText
                  fontSize={13}
                  color={"primary_blue"}
                  onPress={() => handleGoToUser(uuid)}
                >
                  {createdByName}
                </CText>
                <CText fontSize={11} color="gray">
                  {moment(timestamp).fromNow()}
                </CText>
              </View>
            </View>
            {!!article?.summary && (
              <View>
                <CText fontSize={12} style={summaryTextStyle}>
                  {article?.summary}
                </CText>
              </View>
            )}
            {!!article && <ArticleMarkdown article={article} slug={slug} />}
          </View>
        </TouchableOpacity>
        {reviews ? (
          <>
            <View style={commentsHeaderContainer}>
              <CText fontSize={16} fontFamily={"thin"} style={commentTextStyle}>
                {t("article_comments")}
              </CText>
              <TouchableOpacity style={buttonContainer} onPress={onAddReviewPress}>
                <CText fontFamily={"thin"} fontSize={12} color="white">
                  {t("add_new_comment")}
                </CText>
              </TouchableOpacity>
            </View>
            <View style={reviewCardsContainerStyle}>
              {reviews.slice(0, DISPLAYABLE_COMMENTS_COUNT).map((review, index) => (
                <ReviewCard
                  isArticle
                  title={title[language]}
                  item={review}
                  key={`${review.index}-${review.text}-${review.rate}}`}
                  withStars={false}
                  index={index}
                  itemsLength={reviews.length}
                  onEditCb={updateReview}
                  onDeleteCb={deleteReview}
                  isRegularComment
                  analyticsType={ReviewCardAnalyticsTypes.ARTICLE}
                  reviewSource={slug}
                />
              ))}
            </View>
            {reviews.length >= DISPLAYABLE_COMMENTS_COUNT && (
              <View style={moreButtonContainer}>
                <Button
                  title={t("more")}
                  style={moreButtonStyle}
                  labelStyle={moreButtonLabelStyle}
                  onPress={onShowMorePress}
                />
              </View>
            )}
          </>
        ) : null}
      </ParallaxHeaderScrollView>
    </View>
  );
};

export default ArticleDetails;
