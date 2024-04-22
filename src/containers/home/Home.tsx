import React, { useCallback, memo, createRef, useRef, useLayoutEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  RefreshControl,
  View,
  BackHandler,
  ToastAndroid
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { createSelector } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import styles from "./Home.styles";

import { RootState } from "~/redux/store";

import { FollowList } from "~/components/";
import { SliderSection, SliderSectionSkeleton, HeaderTopBar } from "~/components/common";
import { Destination } from "~/components/destinations";
import {
  PropertyCard,
  HomeReviewCard,
  ArticleCard,
  Post,
  PostSponsership,
  HomepageHeader
} from "~/components/home";
import { PostType } from "~/components/home/Post/Post.types";
import {
  APP_SCREEN_HEIGHT,
  APP_SCREEN_WIDTH,
  isRTL,
  PLATFORM
} from "~/constants/variables";
import { Puzzle } from "~/containers/puzzle";
import {
  clearTimelineData,
  clearTimeline,
  setHomepagePullToRefresh,
  setScrollOffsetValue
} from "~/redux/reducers/home.reducer";
import { getFreeFeedsTimelineThunk } from "~/redux/thunk/home.thunk";
import { TimelineClasses, TimelineTypes } from "~/redux/types/home.types";
import { AppStackProps } from "~/router/Router/Router.types";
import { HOMEPAGE_REFRESHED, logEvent, NEXT_POST_LOADED } from "~/services/analytics";
import { requestLocationPermission, getLocation } from "~/services/location/location";
import { navigate } from "~/services/navigation";
import { GenericObject } from "~/types/common";

export const flatListRef = createRef<FlatList>();
export const TRANSLATION_Y_OFFSET = APP_SCREEN_HEIGHT / 3 - 50;

export const onLandmarksPress = async (data?: string[]) => {
  await requestLocationPermission();
  const location = await getLocation();
  if (!location) return;
  navigate("SurroundingLandmarks", { location, data });
};

const REVIEW_CARD_WIDTH = APP_SCREEN_WIDTH * 0.8;

const timelineDataSelector = createSelector(
  (state: RootState) => state.home.timelineData,
  items => items
);
const languageSelector = createSelector(
  (state: RootState) => state.settings.language,
  items => items || "ar"
);
const userTokenSelector = createSelector(
  (state: RootState) => state.auth.userToken,
  items => items
);
const freeFeedsSelector = createSelector(
  (state: RootState) => state.home.freeFeeds,
  items => items
);
const isRefreshingSelector = createSelector(
  (state: RootState) => state.home.isRefreshing,
  items => items
);
const isFetchingRestOfTimelineDataSelector = createSelector(
  (state: RootState) => state.home.isFetchingRestOfTimelineData,
  items => items
);
const homepagePartRefreshSelector = createSelector(
  (state: RootState) => state.home.homepagePartRefresh,
  items => items
);
const authenticatedIndeciesSelector = createSelector(
  (state: RootState) => state.home.authenticatedIndecies,
  items => items
);
const locationSelector = createSelector(
  (state: RootState) => state.auth.location,
  items => items
);

const REVIEW_CARD_SNAP_INTERVAL = APP_SCREEN_WIDTH * 0.8 + 20;
const ARTICLE_CARD_SNAP_INTERVAL = (4 / 5) * APP_SCREEN_WIDTH + 10;

const Home = ({ navigation }: AppStackProps): JSX.Element => {
  const BIG_WIDTH = (APP_SCREEN_WIDTH - 12) / 3 - 8;
  const ASPECT_RATIO = 1.5 / 2;

  const timelineData = useSelector(timelineDataSelector, shallowEqual);
  const language = useSelector(languageSelector, shallowEqual);
  const userToken = useSelector(userTokenSelector, shallowEqual);
  const freeFeeds = useSelector(freeFeedsSelector, shallowEqual);
  const isRefreshing = useSelector(isRefreshingSelector, shallowEqual);
  const isFetchingRestOfTimelineData = useSelector(
    isFetchingRestOfTimelineDataSelector,
    shallowEqual
  );
  const homepagePartRefresh = useSelector(homepagePartRefreshSelector, shallowEqual);
  const authenticatedIndecies = useSelector(authenticatedIndeciesSelector, shallowEqual);
  const location = useSelector(locationSelector, shallowEqual);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const visitedAuthenticatedIndecies = useRef([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const direction = isRTL ? "left" : "right";
  const { articleScrollViewStyle, propertyScrollViewStyle, row } = styles;

  const renderSliderBody = useCallback(
    (timelineClass: TimelineClasses, data: GenericObject[]) => {
      switch (timelineClass) {
        case TimelineClasses.SPECIAL_DESTINATIONS:
          return (
            <ScrollView
              horizontal
              bounces={false}
              contentContainerStyle={propertyScrollViewStyle}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews
            >
              {data.length > 0 &&
                data.map((destination, index) => {
                  const {
                    slug,
                    title = { ar: "", en: "" },
                    country,
                    featured_image,
                    type,
                    pkey
                  } = destination;

                  const primaryTitle = title[language] || "";
                  const subTitle = country ? country.name : "";
                  if (type === "article") {
                    return null;
                  }
                  return (
                    <Destination
                      key={slug}
                      slug={slug}
                      title={primaryTitle}
                      subTitle={subTitle}
                      featuredImage={featured_image?.image_uuid}
                      width={BIG_WIDTH}
                      aspectRatio={ASPECT_RATIO}
                      shouldRenderProgressive={false}
                      type={type}
                      pkey={pkey}
                      analyticsSource="home_page_top_destinations"
                      index={index}
                    />
                  );
                })}
            </ScrollView>
          );
        case TimelineClasses.PROPERTY:
          return (
            <ScrollView
              horizontal
              contentContainerStyle={propertyScrollViewStyle}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews
            >
              {data?.map((item, index) => {
                return (
                  <PropertyCard
                    key={`${item.pkey}-${index}`}
                    {...item}
                    language={language}
                    shouldRenderProgressive={false}
                    country={item.country}
                    city={item.city}
                    analyticsSource={"home_page_top_tourist_attractions"}
                  />
                );
              })}
            </ScrollView>
          );
        case TimelineClasses.REVIEW:
          return (
            <>
              {!homepagePartRefresh ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews
                  pagingEnabled
                  snapToAlignment={"start"}
                  decelerationRate={"normal"}
                  disableIntervalMomentum
                  snapToInterval={REVIEW_CARD_SNAP_INTERVAL}
                >
                  {data?.map((item, index) => {
                    return (
                      <HomeReviewCard
                        onlyReview={data?.length <= 1}
                        language={language}
                        key={`${item.pkey}-${index}`}
                        item={item}
                        analyticsSource="home_page_latest_reviews"
                      />
                    );
                  })}
                </ScrollView>
              ) : (
                <View style={row}>
                  <SkeletonPlaceholder
                    direction={direction}
                    highlightColor={theme.colors.skeleton.highlight}
                    backgroundColor={theme.colors.skeleton.background}
                  >
                    <SkeletonPlaceholder.Item flexDirection="row-reverse">
                      <SkeletonPlaceholder.Item
                        width={REVIEW_CARD_WIDTH}
                        height={120}
                        borderRadius={8}
                        marginRight={10}
                        marginLeft={10}
                        paddingEnd={10}
                      />
                      <SkeletonPlaceholder.Item
                        width={REVIEW_CARD_WIDTH}
                        height={120}
                        borderRadius={8}
                        marginRight={10}
                        marginLeft={10}
                        paddingEnd={10}
                      />
                      <SkeletonPlaceholder.Item
                        width={REVIEW_CARD_WIDTH}
                        height={120}
                        borderRadius={8}
                        marginRight={10}
                        marginLeft={10}
                        paddingEnd={10}
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              )}
            </>
          );
        case TimelineClasses.INFLUENCERS:
          return (
            <FollowList data={data} analyticsSource="home_page_follow_suggestions" />
          );

        case TimelineClasses.ARTICLE:
          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={articleScrollViewStyle}
              removeClippedSubviews
              pagingEnabled
              snapToAlignment={"start"}
              decelerationRate={"normal"}
              disableIntervalMomentum
              snapToInterval={ARTICLE_CARD_SNAP_INTERVAL}
            >
              {data?.map((item, index) => {
                return (
                  <ArticleCard
                    key={`${item.pkey}-${index}`}
                    {...item}
                    language={language}
                    analyticsSource={"home_page_article_list"}
                  />
                );
              })}
            </ScrollView>
          );
        default:
          return <></>;
      }
    },
    [
      language,
      articleScrollViewStyle,
      propertyScrollViewStyle,
      homepagePartRefresh,
      direction,
      theme.colors.skeleton.background,
      theme.colors.skeleton.highlight
    ]
  );

  const handleMoreText = useCallback(
    (timelineClass: TimelineClasses): string => {
      switch (timelineClass) {
        case TimelineClasses.ARTICLE:
          return t("more");
        default:
          return "";
      }
    },
    [t]
  );

  const articleMoreCb = useCallback(() => {
    return navigation.navigate("Articles");
  }, [navigation]);

  const handleKeyExtractor = useCallback(
    (item, index) => `${item.endpoint}-${index}`,
    []
  );

  const handleRenderItem = useCallback(
    ({ item }) => {
      const { type, titles, class: timelineClass, data, additionalData } = item || {};
      if (!data || (Array.isArray(data) && data?.length === 0)) {
        return null;
      }
      switch (type) {
        case TimelineTypes.SLIDER:
          return (
            <SliderSection
              title={titles[language]}
              moreText={handleMoreText(timelineClass)}
              moreCallback={timelineClass === TimelineClasses.ARTICLE && articleMoreCb}
            >
              {renderSliderBody(timelineClass, data)}
            </SliderSection>
          );
        case TimelineTypes.FEED:
          return (
            <>
              {data.map((post: PostType) => {
                return <Post key={post.pkey} postPkey={post.pkey} />;
              })}
            </>
          );

        case TimelineTypes.SPONSORSHIP:
          return (
            <SliderSection title={titles[language]} noFooter>
              {data.map((post: PostType) => {
                return (
                  <PostSponsership
                    key={post.pkey}
                    pkey={post.pkey}
                    enable_post_actions={post?.preferences?.enable_post_actions}
                  />
                );
              })}
            </SliderSection>
          );
        case TimelineTypes.AUTHENTICATE:
          return <></>;

        case TimelineTypes.PUZZLE: {
          return (
            <Puzzle
              data={data}
              pkey={additionalData.pkey}
              time={additionalData.timestamp}
            />
          );
        }

        case TimelineTypes.NEAR_BY:
          if (!location) return null;
          return (
            <SliderSection title={titles[language]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews
              >
                {data?.map((item, index) => {
                  return (
                    <PropertyCard
                      key={`${item.pkey}-${index}`}
                      {...item}
                      referenceLocation={location}
                      language={language}
                      shouldRenderProgressive={false}
                      country={item?.country}
                      city={item?.city}
                      analyticsSource={"home_page_nearby_properties"}
                    />
                  );
                })}
              </ScrollView>
            </SliderSection>
          );
        default:
          return (
            <>
              {data.map((post: PostType) => {
                return <Post key={post.pkey} postPkey={post.pkey} />;
              })}
            </>
          );
      }
    },
    [renderSliderBody, handleMoreText, articleMoreCb, t, language, location]
  );

  const handleOnEndReached = useCallback(async () => {
    if (freeFeeds.isLoading || isFetchingRestOfTimelineData) {
      return;
    }
    const from = Number(freeFeeds.currentPage);
    await logEvent(NEXT_POST_LOADED, {
      source: "home_page",
      from: from + 1,
      to: from + freeFeeds.pageSize
    });
    dispatch(
      getFreeFeedsTimelineThunk({
        url: freeFeeds.baseURL,
        params: {
          from: from + 1,
          to: from + freeFeeds.pageSize
        }
      })
    );
  }, [dispatch, freeFeeds, isFetchingRestOfTimelineData]);

  const renderHeaderComponent = useCallback(() => {
    return (
      <>
        <HomepageHeader />

        {(isRefreshing || homepagePartRefresh) && (
          <SliderSectionSkeleton title titleWidth={150}>
            <SkeletonPlaceholder.Item
              width={BIG_WIDTH}
              height={BIG_WIDTH / ASPECT_RATIO}
              borderRadius={5}
              marginRight={10}
            />
            <SkeletonPlaceholder.Item
              width={BIG_WIDTH}
              height={BIG_WIDTH / ASPECT_RATIO}
              borderRadius={5}
              marginRight={10}
            />
            <SkeletonPlaceholder.Item
              width={BIG_WIDTH}
              height={BIG_WIDTH / ASPECT_RATIO}
              borderRadius={5}
              marginRight={10}
            />
          </SliderSectionSkeleton>
        )}
      </>
    );
  }, [
    // specialDestinations,
    ASPECT_RATIO,
    BIG_WIDTH,
    // language,
    // t,
    isRefreshing,
    homepagePartRefresh
    // row
  ]);

  const renderFooterComponent = useCallback(() => {
    const WIDTH = 105;
    const ASPECT_RATIO = 1.5 / 2;
    const HEIGHT = WIDTH / ASPECT_RATIO;

    if (
      !freeFeeds.isLoading &&
      !isFetchingRestOfTimelineData &&
      !(homepagePartRefresh || isRefreshing)
    ) {
      return null;
    }
    // should be replace with Post skeleton * FreeFeeds Page_size
    return (
      <SliderSectionSkeleton title titleWidth={150}>
        <SkeletonPlaceholder.Item
          width={WIDTH}
          height={HEIGHT}
          borderRadius={5}
          marginRight={10}
        />
        <SkeletonPlaceholder.Item
          width={WIDTH}
          height={HEIGHT}
          borderRadius={5}
          marginRight={10}
        />
        <SkeletonPlaceholder.Item
          width={WIDTH}
          height={HEIGHT}
          borderRadius={5}
          marginRight={10}
        />
      </SliderSectionSkeleton>
    );
  }, [
    freeFeeds.isLoading,
    homepagePartRefresh,
    isRefreshing,
    isFetchingRestOfTimelineData
  ]);

  const _onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (userToken) {
        return;
      }
      if (viewableItems && Array.isArray(viewableItems) && viewableItems.length > 0) {
        const viewabilityIndex = viewableItems[0].index;

        if (
          !userToken &&
          authenticatedIndecies.includes(viewabilityIndex) &&
          !visitedAuthenticatedIndecies.current?.includes(viewabilityIndex)
        ) {
          visitedAuthenticatedIndecies.current = [
            ...visitedAuthenticatedIndecies.current,
            viewabilityIndex
          ];
          return navigation.navigate("PreLoginNavigationModal");
        }
      }
    },
    [userToken, authenticatedIndecies, navigation]
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      onViewableItemsChanged: _onViewableItemsChanged
    }
  ]);
  const scrollHandler = useCallback(
    event => {
      const scrollOffsetValue = event.nativeEvent.contentOffset.y;
      if (scrollOffsetValue > (TRANSLATION_Y_OFFSET + 50) * 2) {
        return;
      }
      dispatch(setScrollOffsetValue(scrollOffsetValue));
    },
    [dispatch]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <HeaderTopBar language={language} isHome={true} />;
      }
    });
  }, [navigation, language]);

  let backPressCount = 0;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          backPressCount += 1;
          timeoutRef.current = setTimeout(() => (backPressCount = 0), 1000);
          ToastAndroid.show(t("double_back_exit"), ToastAndroid.SHORT);
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
        }
        return true;
      };
      if (PLATFORM === "android") {
        const subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );

        return () => {
          clearTimeout(timeoutRef.current);
          subscription.remove();
        };
      }
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    await logEvent(HOMEPAGE_REFRESHED, {
      source: "home_page",
      method: "pull-to-refresh"
    });
    dispatch(setHomepagePullToRefresh({}));
  }, [dispatch]);

  const renderRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isRefreshing || homepagePartRefresh}
        onRefresh={handleRefresh}
        tintColor={theme.colors.primary}
      />
    );
  }, [isRefreshing, homepagePartRefresh, handleRefresh, theme.colors.primary]);

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        onScroll={scrollHandler}
        refreshControl={renderRefreshControl()}
        data={timelineData}
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        ListHeaderComponent={renderHeaderComponent()}
        ListFooterComponent={renderFooterComponent()}
        showsVerticalScrollIndicator={false}
        testID="homepageFlatListID"
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.7}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        // initialNumToRender={5}
        // maxToRenderPerBatch={10}
        // updateCellsBatchingPeriod={30}
        // windowSize={11}
      />
    </SafeAreaView>
  );
};

export default memo(Home);
