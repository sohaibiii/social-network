import React, { FC, memo, useEffect, useLayoutEffect, useState } from "react";
import { ListRenderItem, TouchableOpacity, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import reviewScreenStyle from "./reviewScreen.styles";
import { GetReviewsProps } from "./reviewScreen.types";

import { RootState } from "~/redux/store";

import { commentsAPI, reviewAPI } from "~/apis/";
import { ReviewTypes } from "~/apis/review/review.types";
import articleCommentService from "~/apiServices/articleComment";
import { CommentsType } from "~/apiServices/comments/comments.types";
import reviewService from "~/apiServices/review";
import { Review, ReviewsType } from "~/apiServices/review/review.types";
import { ReviewScreenSkeleton, AddReviewModal } from "~/components/";
import {
  CText,
  CustomFlatList,
  modalizeRef,
  ReviewCard,
  ReviewSummary,
  ReviewSummaryProps
} from "~/components/common";
import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  INITIAL_LOADER,
  REFRESH_LOADER,
  FOOTER_LOADER,
  IS_REACHED_END
} from "~/constants/toggleState";
import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { loadNewUsers } from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { playSoundFile } from "~/services/soundPlayer";
import { useToggleState } from "~/utils/hooks";

const ReviewScreen: FC = () => {
  const { params } = useRoute();
  const {
    pkey,
    rate,
    withStars = true,
    name = "",
    ts = "",
    reviewsType = ReviewsType.PROPERTY,
    hotelId = "",
    isReviewed = false,
    setIsReviewed = () => {},
    parentReviews = [],
    setParentReviews = () => {}
  } = params as {
    pkey: string;
    rate?: ReviewSummaryProps["rate"];
    withStars?: boolean;
    name?: string;
    reviewsType?: ReviewsType;
    hotelId?: string;
    isReviewed?: boolean;
    setIsReviewed?: () => void;
    parentReviews?: any[];
    setParentReviews?: () => void;
  };

  const { colors } = useTheme();
  const userToken = useSelector((state: RootState) => state?.auth?.userToken);
  const enable_sounds =
    useSelector(
      (state: RootState) => state.auth?.userProfile?.preferences?.enable_sounds
    ) || false;

  const [reviews, setReviews] = useState([]);
  const [isAlreadyReviewed, setIsAlreadyReviewed] = useState(isReviewed);
  const [getToggleState, setToggleState] = useToggleState([
    INITIAL_LOADER,
    REFRESH_LOADER,
    FOOTER_LOADER,
    IS_REACHED_END
  ]);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { root, summaryStyle, buttonContainer } = reviewScreenStyle(
    colors,
    isAlreadyReviewed
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={buttonContainer}
          onPress={onAddReviewPress}
          disabled={isAlreadyReviewed}
        >
          <CText fontSize={12} color="white">
            {!withStars ? t("add_comment") : t("add_review")}
          </CText>
        </TouchableOpacity>
      ),
      title: !withStars ? t("article_comments") : t("reviews")
    });
  }, [navigation, isAlreadyReviewed, buttonContainer, onAddReviewPress, t, withStars]);

  useEffect(() => {
    getReviews({ loader: INITIAL_LOADER, reset: true });
  }, []);

  const onAddComment = ({ text, images, uploadedImageIds, rating }) => {
    if (enable_sounds) {
      playSoundFile("comment.mp3");
    }

    if (reviewsType === ReviewsType.ARTICLE) {
      commentsAPI.addComment(pkey, null, text, CommentsType.ARTICLE).then(({ data }) => {
        setReviews(prev => [data, ...prev]);
        setParentReviews(prev => [data, ...prev]);
      });
    } else {
      setIsAlreadyReviewed(true);
      return reviewAPI
        .addReview({
          text,
          pkey: reviewsType === ReviewsType.HOTEL ? hotelId : pkey,
          rate: rating,
          type: reviewsType,
          gallery: uploadedImageIds.length
            ? uploadedImageIds.map(item => ({ id: item }))
            : null
        })
        .then(({ data }) => {
          setIsReviewed(true);
          setReviews(prev => [data, ...prev]);
          setParentReviews(prev => [data, ...prev]);
        })
        .catch(error => {
          setIsAlreadyReviewed(false);
          dispatch(
            showSnackbar({
              text: error?.response?.data?.message || t("something_went_wrong"),
              type: SnackbarVariations.TOAST,
              duration: 2000,
              backgroundColor: "red"
            })
          );
        });
    }
  };

  const onAddReviewPress = () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    dispatch(
      showBottomSheet({
        Content: () => (
          <AddReviewModal onSubmit={onAddComment} name={name} withStars={withStars} />
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
  };

  const getReviews = ({ loader, reset, ts }: GetReviewsProps) => {
    setToggleState(loader, true);
    const isArticle = reviewsType === ReviewsType.ARTICLE;
    const service = isArticle
      ? articleCommentService.getContentReviewsWithTS(pkey, ReviewsType.ARTICLE, 20, ts)
      : reviewService.getContentReviewsWithTS(
          reviewsType === ReviewsType.HOTEL ? hotelId : pkey,
          20,
          ts
        );
    service
      .then(data => {
        if (!data || !data?.Items?.length) {
          return setToggleState(IS_REACHED_END, true);
        }
        const newUsers = (reset ? data.Items : [...reviews, ...(data?.Items || [])])?.map(
          review => {
            const { country, profile_image, profile, ...restOfProps } =
              review?.created_by ?? {};
            return {
              ...restOfProps,
              country_code: country?.id,
              country: country,
              uuid: restOfProps.id,
              profile_image: profile_image,
              profile: profile
            };
          }
        );

        setReviews(prev => (reset ? data.Items : [...prev, ...(data?.Items || [])]));
        dispatch(loadNewUsers(newUsers));
      })
      .catch(error => {
        dispatch(
          showSnackbar({
            text: t("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      })
      .finally(() => {
        setToggleState(loader);
      });
  };

  const onRefresh = () => {
    setToggleState(IS_REACHED_END);
    getReviews({ loader: REFRESH_LOADER, reset: true });
  };

  const onEndReached = () => {
    if (getToggleState(IS_REACHED_END)) return;
    const index = ts || reviews[reviews.length - 1]?.index;
    getReviews({ loader: FOOTER_LOADER, ts: index });
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

    setParentReviews(
      parentReviews?.map(prevReview => {
        if (prevReview?.index !== newReview?.index) {
          return prevReview;
        }
        return newReview;
      })
    );
  }

  function deleteReview(newIndex: string) {
    setReviews(prev => prev?.filter(item => item?.index !== newIndex));
    setParentReviews(prev => prev?.filter(item => item?.index !== newIndex));
    setIsAlreadyReviewed(false);
    setIsReviewed(false);
  }

  const renderItem: ListRenderItem<any> = ({ item, index }) => (
    <ReviewCard
      title={name}
      isArticle={reviewsType === ReviewsType.ARTICLE}
      item={item}
      index={index}
      key={`${item.index}-${item.text}-${item.rate}}`}
      itemsLength={reviews.length}
      withStars={withStars}
      onEditCb={updateReview}
      onDeleteCb={deleteReview}
      analyticsType={ReviewCardAnalyticsTypes.REVIEW}
      reviewSource={pkey}
      isRegularComment={!withStars}
    />
  );

  const keyExtractor = review =>
    `${review.index}-${review.text}-${review.rate}-${
      review?.gallery?.map(image => image.id)?.join(",") ?? ""
    }}`;

  const ListHeaderComponent = () => {
    if (!withStars) return <></>;

    return (
      <View style={summaryStyle}>
        <ReviewSummary rate={rate} />
      </View>
    );
  };

  return (
    <CustomFlatList
      data={reviews}
      contentContainerStyle={root}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      initialSkeleton={<ReviewScreenSkeleton />}
      initialLoader={getToggleState(INITIAL_LOADER)}
      footerLoader={getToggleState(FOOTER_LOADER)}
      refreshing={getToggleState(REFRESH_LOADER)}
      keyExtractor={keyExtractor}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};

export default memo(ReviewScreen);
