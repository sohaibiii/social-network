import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from "react-native";

import Clipboard from "@react-native-clipboard/clipboard";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme, ActivityIndicator, Appbar, Button } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";

import styles from "./Property.styles";

import { RootState } from "~/redux/store";

import { reviewAPI } from "~/apis/";
import PropertyAPIConstants from "~/apis/property/propertyEndpoint";
import ReviewsAPIConstants from "~/apis/review/reviewEndpoint";
import { propertyService, reviewService } from "~/apiServices/index";
import { Property as PropertyType } from "~/apiServices/property/property.types";
import { Review } from "~/apiServices/review/review.types";
import { AddReviewModal } from "~/components/addReviewModal";
import {
  CText,
  Icon,
  IconTypes,
  ProgressiveImage,
  ReviewCard,
  ReviewSummary,
  RatingBar,
  PriceDollars,
  TranslatedInlineReadMore
} from "~/components/common";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import {
  InlineReadMoreMode,
  InlineReadMoreType
} from "~/components/common/InlineReadMore/InlineReadMore.types";
import { RatingComponentTypes } from "~/components/common/RatingBar/RatingComponent/RatingComponent.types";
import { ReviewCardAnalyticsTypes } from "~/components/common/reviewCard/reviewCard.types";
import { PropertyCard } from "~/components/home";
import { ProperyCardSkeleton } from "~/components/home";
import {
  Feature,
  WorkingHours,
  ContactBusiness,
  Favourite,
  GetDirections,
  SpecialContent,
  PropertySkeleton,
  ClaimProperty
} from "~/components/property";
import { PROPERTY_AD } from "~/constants/";
import { APP_SCREEN_WIDTH, HORIZONTAL_SLIDER_HEIGHT } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { loadNewUsers } from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { setSurroundingLandmarkData } from "~/redux/reducers/surroundingLandmarks.reducer";
import { getPropertyById } from "~/redux/selectors";
import { AppStackRoutesPropertyProps } from "~/router/Router/AppStackRoutes/AppStackRoutes.type";
import {
  PROPERTY_GET_DATA,
  COPIED_TEXT,
  logEvent,
  SHOW_GALLERY,
  PROPERTY_GET_DATA_SUCCESS,
  PROPERTY_GET_DATA_FAILED,
  PROPERTY_SHARE,
  PROPERTY_SHARE_SUCCESS,
  SHOW_ALL_REVIEWS,
  PROPERTY_SHARE_FAILED,
  PROPERTY_NAVIGATE_TO_MAP,
  PROPERTY_RESERVE_TICKET,
  PROPERTY_ADD_REVIEW_FAILED,
  PROPERTY_ADD_REVIEW,
  PROPERTY_ADD_REVIEW_SUCCESS,
  PROPERTY_GET_PROPERTIES_BY_LOCATION,
  PROPERTY_GET_PROPERTIES_BY_LOCATION_SUCCESS,
  PROPERTY_GET_PROPERTIES_BY_LOCATION_FAILED,
  PROPERTY_GET_REVIEWS,
  PROPERTY_GET_REVIEWS_SUCCESS,
  PROPERTY_GET_REVIEWS_FAILED
} from "~/services/";
import { openURL } from "~/services/inappbrowser";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { GenericObject } from "~/types/common";
import { generalErrorHandler, logError, verticalScale, scale } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";
import { getHumanizedDuration } from "~/utils/stringUtil";

const dataProvider = new DataProvider((r1, r2) => {
  return r1.pkey !== r2.pkey;
});

const CARD_WIDTH = 156;

const _layoutProvider = new LayoutProvider(
  index => {
    return index;
  },
  (type, dim) => {
    dim.width = CARD_WIDTH;
    dim.height = HORIZONTAL_SLIDER_HEIGHT;
  }
);

const LAYOUT_SIZE = {
  height: HORIZONTAL_SLIDER_HEIGHT,
  width: APP_SCREEN_WIDTH
};

const ANALYTICS_SOURCE = "property_page";
const DISPLAYABLE_REVIEWS_COUNT = 3;

const Property = (props: AppStackRoutesPropertyProps): JSX.Element => {
  const { route, navigation } = props;
  const { title, slug } = route?.params;
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[PROPERTY_AD.config];

  const y = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const userToken = useSelector(
    (state: RootState) => state?.auth?.userToken,
    shallowEqual
  );
  const language = useSelector(
    (state: RootState) => state.settings.language,
    shallowEqual
  );

  const [propertyDetails, setPropertyDetails] = useState<PropertyType | undefined>();
  const [relatedProperties, setRelatedProperties] = useState<PropertyType[]>([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [isRelatedPropertiesLoading, setisRelatedPropertiesLoading] = useState(true);

  const parallaxHeaderHeight = verticalScale(300);
  const HeaderHeight = verticalScale(40) + insets.top;

  const {
    gallery,
    featuredImageUUID,
    name,
    description = "",
    originalDescription = "",
    translationSource,
    originalName,
    features,
    filters,
    phone,
    website,
    cityOrRegionName,
    cityOrRegionSlug,
    countryName,
    countrySlug,
    location,
    isRegionData,
    address,
    workingHours,
    min_visit_duration,
    max_visit_duration,
    isOpen,
    pkey,
    rate: _rate,
    email,
    specialContent,
    logo,
    isClaimed,
    isPremium,
    ticket,
    priceRange = 0,
    isReviewed: _isReviewed,
    is_permanently_closed
  } = propertyDetails || {};

  useEffect(() => {
    if (!!propertyDetails && !featuredImageUUID) {
      logError(`Error: Featured image --Property.tsx-- pkey=${pkey}`);
    }
  }, [propertyDetails]);

  const propertyByIdSelector = useMemo(() => getPropertyById(pkey), [pkey]);
  const property = useSelector(
    (state: RootState) => propertyByIdSelector(state),
    shallowEqual
  );

  const isFavorite = property?.is_favorite;

  const [isReviewed, setIsReviewed] = useState(_isReviewed);
  const [rate, setRate] = useState(_rate);

  const rating = rate?.rate_calculated || rate?.google_rate;

  const recyclerWidth = useMemo(
    () => Math.min(relatedProperties.length * CARD_WIDTH, APP_SCREEN_WIDTH),
    [relatedProperties.length]
  );

  const {
    namesWrapperStyle,
    propertyNameTextStyle,
    propertyDescriptionWrapperStyle,
    specialContentScrollViewStyle,
    safeareaViewStyle,
    parallaxBodyWrapperStyle,
    backIconStyle,
    stickyHeaderWrapperStyle,
    stickyHeaderStyle,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    shareIconWrapperStyle,
    favoriteIconWrapperStyle,
    imageGalleryIconWrapperStyle,
    parallaxHeaderWrapperStyle,
    parallaxHeaderTouchableStyle,
    imagesLengthTextStyle,
    sliderItemTextWrapperStyle,
    sliderTitleTextStyle,
    recommendedTimeTextStyle,
    sliderWrapperStyle,
    overlayWrapperStyle,
    coverImageStyle,
    flexOne,
    contentContainerStyle,
    featuresWrapperStyle,
    actionWrapperParallelStyle,
    claimedLogoWrapperStyle,
    claimedLogoStyle,
    specialContentWrapperStyle,
    buyTicketButtonStyle,
    moreButtonStyle,
    moreButtonWrapperStyle,
    moreButtonLabelStyle,
    buyTicketButtonLabelStyle,
    reviewsWrapperStyle,
    propertEnglishNameTextStyle,
    topWrapperStyle,
    actionsWrapperStyle,
    recommendedTimeStyle,
    reviewRowContainer,
    ratingStarsContainer,
    reviewButtonContainer,
    ratingStyle,
    showOnMapStyle,
    recycleViewStyle,
    reviewSliderWrapperStyle
  } = useMemo(
    () => styles(theme, insets, parallaxHeaderHeight, !!ticket, recyclerWidth),
    [theme, insets, parallaxHeaderHeight, ticket, recyclerWidth]
  );

  useEffect(() => {
    setIsReviewed(_isReviewed);
  }, [_isReviewed]);

  useEffect(() => {
    setRate(_rate);
  }, [_rate]);

  const galleryFormatted = useMemo(() => {
    return (
      gallery?.map(item => {
        return {
          uri: `${Config.CONTENT_MEDIA_PREFIX}/${item.uuid}_sm.jpg`,
          owner: item.owner,
          source: item.source
        };
      }) || []
    );
  }, [gallery]);

  const coverPhoto = `${Config.CONTENT_MEDIA_PREFIX}/${featuredImageUUID}`;
  const IMAGES_LENGTH = gallery?.length || 0;
  const logoPremium = `${Config.CONTENT_MEDIA_PREFIX}/${logo}`;

  useEffect(() => {
    if (!slug) {
      return;
    }
    getPropertyData();
  }, [slug]);

  const getPropertyData = async () => {
    let propertyTempRes = null;

    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      slug,
      pkey
    };

    await logEvent(PROPERTY_GET_DATA, analyticsProps);

    Promise.all([
      propertyService.getProperty(slug, language),
      propertyService.getPropertyStatus(slug)
    ])
      .then(async values => {
        const propertyRes = values[0];
        const propertyStatusAttr = values[1];

        setPropertyDetails({ ...propertyRes, ...propertyStatusAttr });
        setIsLoading(false);
        propertyTempRes = propertyRes;
        await logEvent(PROPERTY_GET_DATA_SUCCESS, analyticsProps);
        await logEvent(PROPERTY_GET_REVIEWS, analyticsProps);
        return reviewService.getContentReviews(propertyRes?.pkey, 10);
      })
      .then(async reviewRes => {
        await logEvent(PROPERTY_GET_REVIEWS_SUCCESS, analyticsProps);
        setReviews(reviewRes.Items);
        const newUsers = reviewRes?.Items.map(review => {
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
        await logEvent(PROPERTY_GET_PROPERTIES_BY_LOCATION, analyticsProps);
        return propertyService.getPropertiesByLocation(propertyTempRes?.location, 15);
      })
      .then(async nearbyRes => {
        const optimizedProperties = nearbyRes
          .filter(nearByProp => nearByProp.slug !== slug)
          .reduce(normalizeByKey("pkey"), {});

        dispatch(upsertProperties(optimizedProperties));
        setRelatedProperties(nearbyRes.filter(nearByProp => nearByProp.slug !== slug));
        await logEvent(PROPERTY_GET_PROPERTIES_BY_LOCATION_SUCCESS, analyticsProps);
      })
      .catch(error => {
        setIsLoading(false);
        generalErrorHandler(
          `Error: getProperty --Property.tsx slug=${slug} lang=${language} ${error}`
        );
        switch (error?.response?.config?.url) {
          case PropertyAPIConstants.PROPERTY:
            return logEvent(PROPERTY_GET_DATA_FAILED, analyticsProps);
          case PropertyAPIConstants.LOCATION:
            return logEvent(PROPERTY_GET_PROPERTIES_BY_LOCATION_FAILED, analyticsProps);
          case ReviewsAPIConstants.REVIEW:
            return logEvent(PROPERTY_GET_REVIEWS_FAILED, analyticsProps);
        }
      })
      .finally(() => {
        setisRelatedPropertiesLoading(false);
      });
  };

  const handleShare = useCallback(async () => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      slug,
      pkey
    };

    await logEvent(PROPERTY_SHARE, analyticsProps);

    setIsLoadingShare(true);
    const {
      name: shareTitle = "",
      featuredImageUUID: shareImage = "",
      description: shareDescription = ""
    } = propertyDetails;
    handleCreateShareLink({
      action: DynamicLinksAction.PROPERTY,
      title: shareTitle,
      description: propertyDetails?.description,
      image: shareImage,
      params: {
        slug
      }
    })
      .then(async link => {
        await showShareView(link);
        await logEvent(PROPERTY_SHARE_SUCCESS, analyticsProps);
      })
      .catch(async error => {
        logError(
          `Error: handleCreateShareLink --Property.tsx-- title=${shareTitle} image=${shareImage} description=${shareDescription} slug=${slug} ${error}`
        );
        await logEvent(PROPERTY_SHARE_FAILED, analyticsProps);
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  }, [
    propertyDetails?.name,
    propertyDetails?.description,
    propertyDetails?.featuredImageUUID,
    slug
  ]);

  const goBackHandler = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const showImageGallery = useCallback(async () => {
    await logEvent(SHOW_GALLERY, {
      source: ANALYTICS_SOURCE,
      source_slug: slug,
      pkey
    });
    dispatch(
      showGalleryViewer({
        data: galleryFormatted,
        isVisible: true,
        disableThumbnailPreview: false,
        currentIndex: 0,
        sourceType: ANALYTICS_SOURCE,
        sourceIdentifier: slug
      })
    );
  }, [dispatch, galleryFormatted]);

  const renderStickyHeader = useCallback(() => {
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
            {title}
          </CText>
        </View>
        <View style={actionsWrapperStyle}>
          {!!IMAGES_LENGTH && (
            <TouchableOpacity
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
            <TouchableOpacity style={shareIconWrapperStyle} onPress={handleShare}>
              <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {!!pkey && (
            <View style={favoriteIconWrapperStyle}>
              <Favourite isFavorite={!!isFavorite} pkey={pkey} />
            </View>
          )}
        </View>
      </View>
    );
  }, [
    IMAGES_LENGTH,
    actionsWrapperStyle,
    favoriteIconWrapperStyle,
    goBackHandler,
    handleShare,
    imageGalleryIconWrapperStyle,
    imagesLengthTextStyle,
    isFavorite,
    isLoadingShare,
    pkey,
    shareIconWrapperStyle,
    showImageGallery,
    stickyHeaderBackIconStyle,
    stickyHeaderTitleWrapperStyle,
    stickyHeaderWrapperStyle,
    theme.colors.white,
    title
  ]);

  const renderParallaxHeader = useCallback(() => {
    return (
      <TouchableOpacity style={parallaxHeaderWrapperStyle} onPress={showImageGallery}>
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
        <View style={actionWrapperParallelStyle}>
          {!!IMAGES_LENGTH && (
            <TouchableOpacity
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
            <TouchableOpacity style={shareIconWrapperStyle} onPress={handleShare}>
              <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {!!pkey && (
            <View style={favoriteIconWrapperStyle}>
              <Favourite isFavorite={!!isFavorite} pkey={pkey} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [
    IMAGES_LENGTH,
    actionWrapperParallelStyle,
    coverImageStyle,
    coverPhoto,
    favoriteIconWrapperStyle,
    handleShare,
    imageGalleryIconWrapperStyle,
    imagesLengthTextStyle,
    isFavorite,
    isLoadingShare,
    overlayWrapperStyle,
    parallaxHeaderTouchableStyle,
    parallaxHeaderWrapperStyle,
    pkey,
    shareIconWrapperStyle,
    showImageGallery,
    theme.colors.white
  ]);

  const handlePurchaseTicket = async () => {
    await logEvent(PROPERTY_RESERVE_TICKET, {
      source: ANALYTICS_SOURCE,
      slug,
      link: ticket.link
    });
    openURL(ticket.link);
  };

  const onSubmitReview = async ({ text, rating, uploadedImageIds }) => {
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      pkey,
      rating
    };

    await logEvent(PROPERTY_ADD_REVIEW, analyticsProps);

    setIsReviewed(true);

    return reviewAPI
      .addReview({
        text,
        pkey: propertyDetails?.pkey,
        rate: rating,
        gallery: uploadedImageIds.length
          ? uploadedImageIds.map(item => ({ id: item }))
          : null
      })
      .then(async ({ data }) => {
        await logEvent(PROPERTY_ADD_REVIEW_SUCCESS, analyticsProps);

        const { total_rate } = data || {};

        !!total_rate && Object.keys(total_rate).length > 0 && setRate(total_rate);
        setReviews(prev => [data, ...prev]);
      })
      .catch(async () => {
        await logEvent(PROPERTY_ADD_REVIEW_FAILED, analyticsProps);
        setIsReviewed(false);
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
            onSubmit={onSubmitReview}
            name={propertyDetails?.title[language]}
          />
        ),
        props: {
          closeOnOverlayTap: true,
          panGestureEnabled: false,
          withoutHeaderMargin: true,
          withHandle: false,
          fullScreen: false
        }
      })
    );
  };

  const onShowOnMapPress = async () => {
    await logEvent(PROPERTY_NAVIGATE_TO_MAP, {
      source: ANALYTICS_SOURCE,
      slug,
      pkey,
      lat: location?.lat,
      lon: location?.lon
    });

    dispatch(
      setSurroundingLandmarkData({
        data: relatedProperties?.map(item => item?.pkey) || [],
        location: {
          latitude: location?.lat,
          longitude: location?.lon
        }
      })
    );
    navigation.navigate({
      name: "SurroundingLandmarks",
      key: `${moment().unix()}`
    });
  };

  const updateReview = useCallback(
    (newReview: Review) => {
      const { total_rate, text = "" } = newReview || {};

      !!total_rate && Object.keys(total_rate).length > 0 && setRate(total_rate);

      setReviews(
        reviews.map(review => {
          if (review?.index !== newReview.index) {
            return review;
          }
          return {
            ...review,
            ...newReview,
            text
          };
        })
      );
    },
    [reviews]
  );
  const deleteReview = useCallback(
    (newIndex: string, res: GenericObject) => {
      const { total_rate } = res || {};
      !!total_rate && Object.keys(total_rate).length > 0 && setRate(total_rate);

      setIsReviewed(false);
      setReviews(prev => prev.filter(item => item?.index !== newIndex));
    },
    [reviews]
  );

  const onShowMorePress = async () => {
    await logEvent(SHOW_ALL_REVIEWS, {
      source: ANALYTICS_SOURCE,
      slug,
      pkey
    });

    navigation.navigate("Reviews", {
      pkey,
      withStars: true,
      name,
      isReviewed,
      setIsReviewed,
      parentReviews: reviews,
      setParentReviews: setReviews,
      rate
    });
  };

  const handleCopy = useCallback(
    async (text: string) => {
      Clipboard.setString(text);
      await logEvent(COPIED_TEXT, {
        source: ANALYTICS_SOURCE,
        text: text?.substr(0, 30),
        slug,
        pkey
      });

      dispatch(showSnackbar({ text: t("text_copied"), duration: 1000 }));
    },
    [dispatch, t]
  );

  const _rowRenderer = useCallback(
    (type, data) => {
      const item = data;

      return (
        <PropertyCard
          {...item}
          language={language}
          referenceLocation={location}
          shouldRenderProgressive={false}
          country={item?.country?.name ?? ""}
          city={item?.city?.name ?? ""}
          analyticsSource={ANALYTICS_SOURCE}
        />
      );
    },
    [language, location]
  );

  const recycleViewScollProps = useMemo(
    () => ({ showsHorizontalScrollIndicator: false }),
    []
  );

  const _dataProvider = useMemo(() => {
    const optimizedRelatedProps = relatedProperties.map(item => ({
      pkey: item.pkey,
      city: item.city,
      country: item.country,
      featured_image: item.featured_image,
      rate: item.rate,
      slug: item.slug,
      title: item.title,
      location: item.location
    }));

    return dataProvider.cloneWithRows(optimizedRelatedProps);
  }, [relatedProperties]);

  const animatedStickyHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(
        interpolate(
          y.value,
          [
            parallaxHeaderHeight - 2 * HeaderHeight,
            parallaxHeaderHeight - HeaderHeight,
            parallaxHeaderHeight
          ],
          [0, 0.7, 1],
          Extrapolate.CLAMP
        ),
        { damping: 15 }
      )
    };
  });

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      y.value = event.nativeEvent.contentOffset.y;
    },
    [y]
  );

  const animatedStickyHeaderStyles = [animatedStickyHeaderStyle, stickyHeaderStyle];

  return (
    <View style={safeareaViewStyle}>
      <Appbar.BackAction
        style={backIconStyle}
        color={"white"}
        size={scale(18)}
        onPress={goBackHandler}
      />
      <Animated.View style={animatedStickyHeaderStyles}>
        <Appbar.BackAction
          style={backIconStyle}
          color={"white"}
          size={scale(18)}
          onPress={goBackHandler}
        />
        <View style={stickyHeaderTitleWrapperStyle}>
          <CText color="white" fontSize={12} numberOfLines={1} textAlign="center">
            {title}
          </CText>
        </View>
        <View style={actionsWrapperStyle}>
          {!!IMAGES_LENGTH && (
            <TouchableOpacity
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
            <TouchableOpacity style={shareIconWrapperStyle} onPress={handleShare}>
              <Icon type={IconTypes.FONTISTO} name="share" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {!!pkey && (
            <View style={favoriteIconWrapperStyle}>
              <Favourite isFavorite={!!isFavorite} pkey={pkey} />
            </View>
          )}
        </View>
      </Animated.View>
      <ScrollView onScroll={handleOnScroll}>
        {renderParallaxHeader()}
        <View style={parallaxBodyWrapperStyle}>
          <View style={topWrapperStyle}>
            {isLoading ? (
              <PropertySkeleton />
            ) : (
              <View>
                <View style={namesWrapperStyle}>
                  <TouchableOpacity onLongPress={() => handleCopy(name)}>
                    <CText
                      fontSize={18}
                      fontFamily="regular"
                      style={propertyNameTextStyle}
                      lineHeight={23}
                    >
                      {name}
                    </CText>
                  </TouchableOpacity>
                  {!!isClaimed && (
                    <Icon
                      type={IconTypes.SAFARWAY_ICONS}
                      name="claimed"
                      width={scale(20)}
                      height={scale(20)}
                    />
                  )}
                </View>
                <TouchableOpacity onLongPress={() => handleCopy(originalName)}>
                  <CText
                    fontSize={17}
                    lineHeight={22}
                    fontFamily="regular"
                    style={propertEnglishNameTextStyle}
                  >
                    {originalName}
                  </CText>
                </TouchableOpacity>
              </View>
            )}
            {!!logo && (
              <View style={claimedLogoWrapperStyle}>
                <ProgressiveImage
                  style={claimedLogoStyle}
                  resizeMode={"cover"}
                  thumbnailSource={{
                    uri: `${logoPremium}_xs.jpg`
                  }}
                  source={{
                    uri: `${logoPremium}_md.jpg`
                  }}
                  errorSource={{ uri: `${logoPremium}_md.jpg` }}
                />
              </View>
            )}
          </View>
          <View style={propertyDescriptionWrapperStyle}>
            {(!!description || !!originalDescription) && (
              <TranslatedInlineReadMore
                analyticsSource={ANALYTICS_SOURCE}
                type={InlineReadMoreType.SUMMARY}
                slug={slug}
                description={description}
                originalDescription={originalDescription}
                translationSource={translationSource}
                mode={InlineReadMoreMode.FLEX}
                maxNumberOfLinesToShow={10}
                handleCopy={handleCopy}
                textProps={{
                  fontFamily: "thin",
                  style: {
                    lineHeight: 26
                  }
                }}
              />
            )}

            <View style={reviewRowContainer}>
              {rating != null ? (
                <View style={ratingStarsContainer}>
                  <RatingBar
                    ratingCount={5}
                    defaultValue={rating}
                    type={RatingComponentTypes.STAR}
                    size={scale(18)}
                    disabled
                    containerStyle={ratingStyle}
                    spacing={2}
                  />
                  {rate?.rate_contributes ? (
                    <CText fontSize={12} color="gray">
                      ({rate?.rate_contributes})
                    </CText>
                  ) : null}
                </View>
              ) : null}
              {!isReviewed && !is_permanently_closed ? (
                <TouchableOpacity
                  style={reviewButtonContainer}
                  onPress={onAddReviewPress}
                >
                  <CText lineHeight={17} fontSize={12} color="white">
                    {t("add_review")}
                  </CText>
                </TouchableOpacity>
              ) : null}
              <PriceDollars spacing={5} priceRange={priceRange} />
            </View>
          </View>
          <AdsItem adId={PROPERTY_AD.id} config={config} />
          {!!specialContent && specialContent.length > 0 && (
            <View style={sliderWrapperStyle}>
              <CText fontSize={16} style={sliderTitleTextStyle}>
                {t("special_content")}
              </CText>
              <View style={sliderItemTextWrapperStyle}>
                <View style={specialContentWrapperStyle}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={specialContentScrollViewStyle}
                  >
                    {specialContent?.map((item, index) => {
                      return <SpecialContent key={`${item.id}-${index}`} {...item} />;
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
          {features?.length > 0 && (
            <View style={sliderWrapperStyle}>
              <CText fontSize={16} style={sliderTitleTextStyle}>
                {t("features")}
              </CText>
              <View style={sliderItemTextWrapperStyle}>
                <View style={featuresWrapperStyle}>
                  {features?.map((feature, index) => {
                    return <Feature key={`${feature}=${index}`} feature={feature} />;
                  })}
                </View>
              </View>
            </View>
          )}
          {filters?.length > 0 && (
            <View style={sliderWrapperStyle}>
              <CText fontSize={16} style={sliderTitleTextStyle}>
                {t("property_filters")}
              </CText>
              <View style={sliderItemTextWrapperStyle}>
                <View style={featuresWrapperStyle}>
                  {filters?.map((feature, index) => {
                    return <Feature key={`${feature}=${index}`} feature={feature} />;
                  })}
                </View>
              </View>
            </View>
          )}
          {!!workingHours && Object.keys(workingHours).length > 0 && (
            <View style={sliderWrapperStyle}>
              <CText fontSize={16} style={sliderTitleTextStyle}>
                {t("working_hours")}
              </CText>
              <View style={sliderItemTextWrapperStyle}>
                <WorkingHours workingHours={workingHours} isOpen={isOpen} />
              </View>
            </View>
          )}
          {!!min_visit_duration && (
            <View style={recommendedTimeStyle}>
              <Icon
                type={IconTypes.SIMPLELINE_ICONS}
                name="clock"
                size={23}
                color={theme.colors.text}
              />
              <CText fontSize={14} lineHeight={19} style={recommendedTimeTextStyle}>
                {t("recommended_time")} :
                <CText fontSize={14} lineHeight={19} fontFamily={"light"}>
                  {getHumanizedDuration(min_visit_duration)}
                </CText>
                {!!max_visit_duration && max_visit_duration !== min_visit_duration && (
                  <CText fontSize={14} lineHeight={19} fontFamily={"light"}>
                    {` - ${getHumanizedDuration(max_visit_duration)}`}
                  </CText>
                )}
              </CText>
            </View>
          )}

          <View style={sliderWrapperStyle}>
            <View style={flexOne}>
              <GetDirections
                location={location}
                cityOrRegionName={cityOrRegionName}
                countryName={countryName}
                address={address}
                isRegionData={isRegionData}
                cityOrRegionSlug={cityOrRegionSlug}
                countrySlug={countrySlug}
              />
            </View>
          </View>

          {(!!phone || !!website || !!email) && (
            <View style={sliderWrapperStyle}>
              <CText fontSize={16} style={sliderTitleTextStyle}>
                {t("contact_business")}
              </CText>
              <View style={sliderItemTextWrapperStyle}>
                <View style={flexOne}>
                  <ContactBusiness phone={phone} website={website} email={email} />
                </View>
              </View>
            </View>
          )}
          {(isRelatedPropertiesLoading || relatedProperties.length > 0) && (
            <View style={sliderWrapperStyle}>
              <View style={showOnMapStyle}>
                <CText fontSize={16} style={sliderTitleTextStyle}>
                  {t("nearby_landmarks")}
                </CText>
                <TouchableOpacity onPress={onShowOnMapPress}>
                  <CText fontSize={12} color="primary" fontFamily="light">
                    {t("show_on_map")}
                  </CText>
                </TouchableOpacity>
              </View>
              {isRelatedPropertiesLoading ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={contentContainerStyle}
                >
                  {Array.from(Array(3).keys()).map((item, index) => {
                    return <ProperyCardSkeleton key={index.toString()} />;
                  })}
                </ScrollView>
              ) : (
                <View style={recycleViewStyle}>
                  <RecyclerListView
                    isHorizontal
                    layoutProvider={_layoutProvider}
                    dataProvider={_dataProvider}
                    rowRenderer={_rowRenderer}
                    scrollViewProps={recycleViewScollProps}
                    layoutSize={LAYOUT_SIZE}
                  />
                </View>
              )}
            </View>
          )}
          {(!isClaimed || !isPremium) && (
            <View style={sliderWrapperStyle}>
              <ClaimProperty slug={slug} propertyId={pkey} />
            </View>
          )}
        </View>
        <View style={reviewSliderWrapperStyle}>
          {reviews.length >= 1 && !!rate && (
            <View>
              <ReviewSummary rate={rate} />
            </View>
          )}
          <View style={stickyHeaderWrapperStyle}>
            <CText fontSize={16} style={sliderTitleTextStyle} fontFamily="thin">
              {t("reviews")}
            </CText>
            {!isReviewed && !is_permanently_closed ? (
              <TouchableOpacity style={reviewButtonContainer} onPress={onAddReviewPress}>
                <CText lineHeight={17} fontSize={12} color="white" fontFamily="thin">
                  {t("add_review")}
                </CText>
              </TouchableOpacity>
            ) : null}
          </View>
          {reviews.length > 0 && (
            <View style={sliderItemTextWrapperStyle}>
              <View style={reviewsWrapperStyle}>
                {reviews.slice(0, DISPLAYABLE_REVIEWS_COUNT).map((review, index) => (
                  <ReviewCard
                    title={propertyDetails?.title[language]}
                    key={`${review.index}-${review.text}-${review.rate}-${
                      review?.gallery?.map(image => image.id)?.join(",") ?? ""
                    }}`}
                    item={review}
                    index={index}
                    itemsLength={reviews.length}
                    onEditCb={updateReview}
                    onDeleteCb={deleteReview}
                    analyticsType={ReviewCardAnalyticsTypes.PROPERTY}
                    reviewSource={slug}
                  />
                ))}
              </View>
            </View>
          )}
          {reviews.length >= DISPLAYABLE_REVIEWS_COUNT && (
            <View style={moreButtonStyle}>
              <Button
                style={moreButtonWrapperStyle}
                labelStyle={moreButtonLabelStyle}
                onPress={onShowMorePress}
              >
                {t("more_reviews")}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
      {!!ticket && (
        <Button
          mode="contained"
          style={buyTicketButtonStyle}
          labelStyle={buyTicketButtonLabelStyle}
          onPress={handlePurchaseTicket}
        >
          {ticket.label[language]}
        </Button>
      )}
    </View>
  );
};

export default Property;
