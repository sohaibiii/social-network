import React, { useCallback, memo } from "react";
import { ImageBackground, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import styles from "./HomepageHeader.styles";
import { HomepageHeaderType } from "./HomepageHeader.types";

import { RootState } from "~/redux/store";

import IMAGES from "~/assets/images";
import { IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { HeaderCard, HeaderSearchBar } from "~/components/home";
import { showNearByModal } from "~/components/nearby";
import { RESTAURANTS_CATEGORY_ID, THINGS_TO_DO_CATEGORY_ID } from "~/constants/";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { setSurroundingLandmarkData } from "~/redux/reducers/surroundingLandmarks.reducer";
import { openURL } from "~/services/";
import {
  logEvent,
  HOTELS_VISITED,
  TOP_RESTAURANTS_VISITED,
  THINGS_TO_DO_VISITED,
  SEARCH_PAGE_VISITED,
  ARTICLE_LIST_VISITED,
  DESTINATION_VISITED,
  BANK_OF_POINTS_VISITED,
  OPEN_EXTERNAL_URL
} from "~/services/analytics";
import { requestLocationPermission, getLocation } from "~/services/location/location";
import { navigate } from "~/services/navigation";

export const onLandmarksPress = async (data?: string[], propertyLocation?: any) => {
  if (!propertyLocation) {
    await requestLocationPermission();
    const location = await getLocation();
    if (!location) return;
    navigate("SurroundingLandmarks");
  } else {
    navigate("SurroundingLandmarks");
  }
};

const HomepageHeader = (props: HomepageHeaderType): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const { searchbarPlaceHolder = t("homepage_search_placeholder"), isHashtag = false } =
    props;

  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const mode = useSelector(
    (state: RootState) => state.auth.userInfo?.location_settings?.mode
  );

  const language = useSelector((state: RootState) => state.settings.language) || "ar";
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);
  const {
    homepageBackgroundImageStyle,
    homepageCardScrollViewStyle,
    cardsScrollviewWrapperStyle
  } = styles;

  const handleNavigateToScreen = useCallback(
    async screenName => {
      let navigationEvent = "";
      switch (screenName) {
        case "Articles":
          navigationEvent = ARTICLE_LIST_VISITED;
          break;
        case "Destinations":
          navigationEvent = DESTINATION_VISITED;
          break;
        case "PointsBank":
          navigationEvent = BANK_OF_POINTS_VISITED;
          break;
        case "HotelsSearch":
          navigationEvent = HOTELS_VISITED;
          break;
        default:
          navigationEvent = "other";
          break;
      }
      await logEvent(navigationEvent, { source: "home_page", type: "header_shortcut" });
      navigation.navigate(screenName);
    },
    [navigation]
  );

  const onRestaurantsPress = useCallback(async () => {
    await logEvent(TOP_RESTAURANTS_VISITED, {
      source: "home_page",
      categoryRecommendationId: RESTAURANTS_CATEGORY_ID
    });
    await logEvent(SEARCH_PAGE_VISITED, {
      source: "top_restaurant_page",
      isHashtag: false,
      categoryRecommendationId: RESTAURANTS_CATEGORY_ID,
      isCategoryRecommendation: true
    });
    navigation.navigate("Search", {
      isCategoryRecommendation: true,
      searchPlaceholder: t("homepage_search_placeholder"),
      searchTextPlaceholder: t("whereTo"),
      categoryRecommendationId: RESTAURANTS_CATEGORY_ID
    });
  }, [navigation, t]);

  const onThingsToDoPress = useCallback(async () => {
    await logEvent(THINGS_TO_DO_VISITED, {
      source: "home_page",
      categoryRecommendationId: THINGS_TO_DO_CATEGORY_ID
    });
    await logEvent(SEARCH_PAGE_VISITED, {
      source: "things_to_do_page",
      isHashtag: false,
      categoryRecommendationId: THINGS_TO_DO_CATEGORY_ID,
      isCategoryRecommendation: true
    });
    navigation.navigate("Search", {
      isCategoryRecommendation: true,
      searchTextPlaceholder: t("whereTo"),
      searchPlaceholder: t("homepage_search_placeholder"),
      categoryRecommendationId: THINGS_TO_DO_CATEGORY_ID
    });
  }, [navigation, t]);

  const handleGoToAffiliates = useCallback(async () => {
    const linkUrl = `${Config.URL_PREFIX}/mobile_webview?route=/${language}/affiliate&token=${userToken}`;
    await logEvent(OPEN_EXTERNAL_URL, { key: "affilates", linkUrl, source: "home_page" });
    return openURL(linkUrl);
  }, [language, userToken]);

  const handleGoToBusinessPortal = useCallback(async () => {
    const linkUrl = `${Config.PORTAL_SAFARWAY_URL}/${language}`;
    await logEvent(OPEN_EXTERNAL_URL, {
      key: "bussiness-portal",
      linkUrl,
      source: "home_page"
    });
    return openURL(`${Config.PORTAL_SAFARWAY_URL}/${language}`);
  }, [language]);

  const onNearByUsersPress = useCallback(async () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    const result = await requestLocationPermission();
    if (result === "granted") {
      if (mode === "on") {
        navigation.navigate("NearbyUsers");
      } else {
        showNearByModal();
      }
    } else {
      dispatch(
        showSnackbar({
          text: t("location_error_message"),
          type: SnackbarVariations.SNACKBAR,
          duration: 3000,
          backgroundColor: "red"
        })
      );
    }
  }, [dispatch, t, mode, userToken, navigation]);

  const handleOnLandmarkPressed = useCallback(async () => {
    await requestLocationPermission();
    const location = await getLocation();
    if (!location) return;

    dispatch(
      setSurroundingLandmarkData({
        location
      })
    );
    navigation.navigate({
      name: "SurroundingLandmarks",
      key: `${moment().unix()}`
    });
  }, [dispatch, navigation]);

  const debounceOnLandMarkPress = useDebouncedCallback(handleOnLandmarkPressed, 1500, {
    leading: true,
    trailing: false
  });

  const HEADER_CARDS_DATA = [
    {
      id: "destinations",
      name: t("destinations"),
      icon: "nav_destinations",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("Destinations")
    },
    {
      id: "surrounding_landmarks",
      name: t("surrounding_landmarks"),
      icon: "nearby",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: debounceOnLandMarkPress
    },
    {
      id: "hotels",
      name: t("hotel"),
      icon: "hotel",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("HotelsSearch")
    },
    {
      id: "thingsToDo",
      name: t("things_to_do"),
      icon: "toDo",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: onThingsToDoPress
    },
    {
      id: "restaurants",
      name: t("best_restaurants"),
      icon: "restaurants",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: onRestaurantsPress
    },
    {
      id: "business_portal",
      name: t("business_portal"),
      icon: "business",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: handleGoToBusinessPortal
    },
    {
      id: "safarway_affiliates",
      name: t("safarway_affiliates"),
      icon: "money",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: handleGoToAffiliates
    },
    {
      id: "articles",
      name: t("articles"),
      icon: "articles",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("Articles")
    },
    {
      id: "nearby_users",
      name: t("nearby_users"),
      icon: "nearby_users",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: onNearByUsersPress
    },
    {
      id: "points",
      name: t("points_bank"),
      icon: "coins",
      iconType: IconTypes.FONTAWESOME5,
      onPress: () => handleNavigateToScreen("PointsBank")
    }
  ];

  return (
    <ImageBackground
      source={isThemeDark ? IMAGES.homepage_bg_dark : IMAGES.homepage_bg}
      resizeMode="cover"
      style={homepageBackgroundImageStyle}
    >
      <HeaderSearchBar
        isHashtag={isHashtag}
        language={language}
        placeholder={searchbarPlaceHolder}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={cardsScrollviewWrapperStyle}
        contentContainerStyle={homepageCardScrollViewStyle}
      >
        {HEADER_CARDS_DATA.map(headerItem => {
          const { id, name, icon, iconType, onPress } = headerItem;
          return (
            <HeaderCard
              key={id}
              name={name}
              icon={icon}
              iconType={iconType}
              onPress={onPress}
              language={language}
            />
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
};

export default memo(HomepageHeader);
