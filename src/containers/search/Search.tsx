import React, { useCallback, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import LottieView from "lottie-react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { Appbar, useTheme } from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import searchStyles, { searchScopeStyles } from "./Search.style";
import { SearchScopes } from "./SearchScopes";

import { RootState } from "~/redux/store";

import { searchService } from "~/apiServices/index";
import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";
import LOTTIE from "~/assets/lottie";
import {
  CText,
  Icon,
  IconTypes,
  LottieActivityIndicator,
  modalizeRef,
  PropertyMiniCard,
  TextInput
} from "~/components/";
import { PropertyMiniCardSkeleton } from "~/components/common/PropertyMiniCard";
import { HashtagCard } from "~/components/hashtag";
import { UserRow } from "~/components/profileFollows";
import { DestinationSearch } from "~/components/search/destinationSearch";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { PLATFORM } from "~/constants/variables";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { AppStackRoutesSearchProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  SEARCH_PAGE_FILTER_SELECTED,
  SEARCH_PAGE_CLEAR_SEARCH,
  SEARCH_PAGE_LOAD_MORE_RESULT,
  SEARCH_PAGE_REFRESH_RESULT,
  SEARCH_PAGE_SEARCH,
  SEARCH_PAGE_SEARCH_FAILED,
  SEARCH_PAGE_SEARCH_NO_RESULT,
  SEARCH_PAGE_SEARCH_SUCCESS,
  NAVIGATE_TO_CITY_COUNTRY_REGION,
  NAVIGATE_TO_PROPERTY
} from "~/services/analytics";
import { generalErrorHandler, scale } from "~/utils/";

const Search = (props: AppStackRoutesSearchProps): JSX.Element => {
  const { route } = props;
  const { t } = useTranslation();
  const { isHashtag } = route?.params || {};
  const {
    isCategoryRecommendation = false,
    categoryRecommendationId = 0,
    searchTextPlaceholder = "",
    searchPlaceholder = isHashtag ? t("search_for_hashtag") : t("search_for_all")
  } = route?.params || {};

  const PAGE_SIZE = 10;
  const navigation = useNavigation();
  const language = useSelector((state: RootState) => state.settings.language) || "ar";
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState<PropertyResponseType[]>([]);
  const [from, setFrom] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedScope, setSelectedScope] = useState<string>(
    isCategoryRecommendation ? SearchScopes.DESTINATION : SearchScopes.GENERAL
  );
  const [searchText, setSearchText] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<CountryRegionCityType>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const BUTTONS = [
    SearchScopes.GENERAL,
    SearchScopes.PROPERTY,
    SearchScopes.COUNTRY,
    SearchScopes.CITY,
    SearchScopes.USER
  ];

  const {
    container,
    buttonsContainer,
    searchContainerStyle,
    contentContainerStyle,
    notFoundStyle,
    iconStyle,
    loadingStyle,
    rowStyle,
    containerStyle,
    clearTextStyle,
    destinationStyle,
    shadowStyle,
    flex
  } = searchStyles(colors);

  const handleTextChanged = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      setIsLoading(true);
      // setFrom(0);
      // setSearchResults([]);
      handleTextChangedDebounced(text);
    } else {
      setSearchResults([]);
    }
  };

  const handleTextChangedDebounced = useDebouncedCallback(text => {
    getSearchResults(0, PAGE_SIZE, text, selectedScope);
  }, 300);

  const getSearchResults = useCallback(
    async (
      fromParam = 0,
      pageSize = PAGE_SIZE,
      searchTerm: string,
      scope = SearchScopes.GENERAL,
      destination = selectedDestination
    ) => {
      if (totalResults > 0 && fromParam >= totalResults) {
        return;
      }

      setIsLoading(true);
      let searchFunction;
      let searchFunctionTitle;
      if (isHashtag) {
        searchFunctionTitle = "searchByTerm";
        searchFunction = searchService.searchByTerm(
          `#${searchTerm}`,
          SearchScopes.HASHTAG,
          fromParam,
          pageSize
        );
      } else if (scope === SearchScopes.PROPERTY && !!destination) {
        const { _index = "", pkey = "" } = destination || {};
        let countries: string[] = [];
        let regions: string[] = [];
        let cities: string[] = [];
        switch (_index) {
          case DestinationsType.COUNTRY:
            countries = [pkey];
            break;
          case DestinationsType.REGION:
            regions = [pkey];
            break;
          case DestinationsType.CITY:
            cities = [pkey];
            break;
        }
        searchFunctionTitle = "searchByTags";
        searchFunction = searchService.searchByTags(
          searchTerm,
          countries.map(geoPlace => geoPlace).join(","),
          regions.map(geoPlace => geoPlace).join(","),
          cities.map(geoPlace => geoPlace).join(","),
          fromParam,
          pageSize
        );
      } else {
        searchFunctionTitle = "searchByTerm";
        searchFunction = searchService.searchByTerm(
          searchTerm,
          scope,
          fromParam,
          pageSize
        );
      }
      await logEvent(SEARCH_PAGE_SEARCH, {
        source: "search_page",
        searchTerm,
        scope,
        fromParam,
        pageSize,
        isCategoryRecommendation,
        categoryRecommendationId
      });
      searchFunction
        .then(data => {
          setSearchResults(
            fromParam === 0
              ? getUniqueArray(data?.items) ?? []
              : prevState => getUniqueArray(prevState.concat(data?.items ?? []))
          );
          setTotalResults(data?.total.value ?? 0);
          if (data?.items?.length === 0) {
            return logEvent(SEARCH_PAGE_SEARCH_NO_RESULT, {
              source: "search_page",
              searchTerm,
              scope,
              fromParam,
              pageSize,
              isCategoryRecommendation,
              categoryRecommendationId
            });
          }
          return logEvent(SEARCH_PAGE_SEARCH_SUCCESS, {
            source: "search_page",
            searchTerm,
            scope,
            fromParam,
            pageSize,
            isCategoryRecommendation,
            categoryRecommendationId
          });
        })
        .catch(error => {
          generalErrorHandler(
            `Error: Search ${searchFunctionTitle} --Search.tsx-- term=${searchTerm} scope=${scope} from=${fromParam} top=${isCategoryRecommendation} ${error}`
          );
          logEvent(SEARCH_PAGE_SEARCH_FAILED, {
            source: "search_page",
            searchTerm,
            scope,
            fromParam,
            pageSize,
            isCategoryRecommendation,
            categoryRecommendationId
          });
        })
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [
      selectedDestination,
      totalResults,
      isHashtag,
      categoryRecommendationId,
      isCategoryRecommendation
    ]
  );

  const getUniqueArray = (arr: any[]) => {
    if (selectedScope === SearchScopes.USER) {
      return arr.filter(
        (tag, index, array) => array.findIndex(k => k.id === tag.id) === index
      );
    }
    return arr.filter(
      (tag, index, array) => array.findIndex(k => k.pkey === tag.pkey) === index
    );
  };

  const handleCityCountryRegionPressed = useCallback(
    async (res: CountryRegionCityType) => {
      const { title = { ar: "", en: "" }, pkey, id, slug = "", _index = "" } = res;
      const translatedTitle = title[language as "ar" | "en" | "fr"];
      if (isCategoryRecommendation) {
        navigation.navigate("ThingsToDo", {
          id,
          slug,
          pkey,
          country: translatedTitle,
          countryTitle: title,
          type: _index,
          thingsToDoId: categoryRecommendationId
        });
        return;
      }
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        slug,
        title: translatedTitle,
        type: _index,
        source: "search_page"
      });
      navigation.navigate({
        name: "CityCountryRegion",
        key: `${moment().unix()}`,
        params: {
          title: translatedTitle,
          slug,
          type: _index
        }
      });
    },
    [navigation, categoryRecommendationId, isCategoryRecommendation, language]
  );

  const handlePropertyPressed = useCallback(
    async (res: PropertyResponseType) => {
      const { slug } = res;
      await logEvent(NAVIGATE_TO_PROPERTY, {
        source: "search_page",
        slug
      });

      navigation.navigate("Property", { slug });
    },
    [navigation]
  );

  const renderResults = useCallback(
    ({ item }) => {
      if (!item) {
        return <View />;
      }
      const { pkey, _index, featured_image = {} } = item;
      const { image_uuid = "" } = featured_image || {};

      // Remove after backend fixes SAF-3579
      if (!pkey && _index !== SearchScopes.USER) {
        return <View />;
      }

      switch (_index) {
        case SearchScopes.USER:
          return <UserRow hasButtons={false} {...item} profileImage={image_uuid} />;
        case SearchScopes.PROPERTY:
          return (
            <PropertyMiniCard
              setSelectionCb={handlePropertyPressed}
              key={pkey}
              item={item}
              hasRating
            />
          );
        case SearchScopes.HASHTAG:
          return <HashtagCard hashtag={item.name} />;
        default:
          return (
            <PropertyMiniCard
              setSelectionCb={handleCityCountryRegionPressed}
              key={pkey}
              item={item}
            />
          );
      }
    },
    [handleCityCountryRegionPressed, handlePropertyPressed]
  );

  const handleFilterSelected = useCallback(
    async (scope: string) => {
      setIsLoading(true);
      setFrom(0);
      setSearchResults([]);
      let newScope = scope;
      if (selectedScope === scope) {
        newScope = SearchScopes.GENERAL;
      }
      setSelectedScope(newScope);
      if (searchText.length > 2) {
        getSearchResults(0, PAGE_SIZE, searchText, newScope);
      } else {
        setIsLoading(false);
      }
      await logEvent(SEARCH_PAGE_FILTER_SELECTED, {
        source: "search_page",
        scope: newScope
      });
    },
    [getSearchResults, searchText, selectedScope]
  );

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading || searchResults.length === 0) {
      return null;
    }
    return <PropertyMiniCardSkeleton />;
  }, [isLoading, searchResults.length]);

  const renderListEmptyComponent = useCallback(() => {
    if (searchText.length < 3) {
      return (
        <View style={notFoundStyle}>
          <CText fontSize={14}>
            {searchText.length === 0 ? searchPlaceholder : t("search_length")}
          </CText>
          {isHashtag && (
            <View style={iconStyle}>
              <Icon
                type={IconTypes.MATERIAL_ICONS}
                name={"tag"}
                size={80}
                color={colors.white}
              />
            </View>
          )}
        </View>
      );
    }

    if (isLoading) {
      return <LottieActivityIndicator style={loadingStyle} />;
    }
    return (
      <View style={notFoundStyle}>
        <LottieView source={LOTTIE.not_found} autoPlay loop style={loadingStyle} />
        <CText fontSize={14}>{t("no_results_found")}</CText>
      </View>
    );
  }, [
    searchText.length,
    isLoading,
    notFoundStyle,
    loadingStyle,
    t,
    searchPlaceholder,
    colors.white,
    iconStyle,
    isHashtag
  ]);

  const handleOnEndReached = useCallback(async () => {
    if (isLoading || isRefreshing || searchResults.length >= totalResults) {
      return;
    }
    const newFrom = from + PAGE_SIZE;

    setFrom(newFrom);
    getSearchResults(newFrom, PAGE_SIZE, searchText, selectedScope);
    await logEvent(SEARCH_PAGE_LOAD_MORE_RESULT, {
      source: "search_page",
      page: newFrom,
      searchText,
      scope: selectedScope
    });
  }, [
    from,
    getSearchResults,
    isLoading,
    isRefreshing,
    searchResults.length,
    searchText,
    selectedScope,
    totalResults
  ]);

  const handleOnRefresh = useCallback(async () => {
    if (!(searchText.length > 2)) {
      return;
    }
    setIsRefreshing(true);
    setFrom(0);
    setSearchResults([]);
    getSearchResults(0, PAGE_SIZE, searchText, selectedScope);

    await logEvent(SEARCH_PAGE_REFRESH_RESULT, { source: "search_page" });
  }, [getSearchResults, searchText, selectedScope]);

  const textInputTheme = useTheme({
    roundness: 8,
    colors: {
      background: colors.searchBarBackground
    }
  });

  const handleDestinationSelected = useCallback(
    item => {
      setSelectedDestination(item);
      setFrom(0);
      setSearchResults([]);
      if (searchText.length > 2) {
        getSearchResults(0, PAGE_SIZE, searchText, selectedScope, item);
      }
      modalizeRef.current?.close();
    },
    [getSearchResults, searchText, selectedScope]
  );

  const handleShowDestinationSelector = () => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <DestinationSearch
            onDestinationSelected={handleDestinationSelected}
            language={language}
          />
        ),
        props: {
          style: {
            marginTop: APP_SCREEN_HEIGHT * 0.15 - StatusBar?.currentHeight
          },
          scrollViewProps: {
            keyboardShouldPersistTaps: "handled",
            showsVerticalScrollIndicator: false
          },
          flatListProps: null,
          HeaderComponent: null
        }
      })
    );
  };

  const handleClearText = useCallback(async () => {
    setSearchText("");
    textInputRef?.current?.clear();
    setSearchResults([]);
    await logEvent(SEARCH_PAGE_CLEAR_SEARCH, { source: "search_page" });
  }, []);

  const handleKeyExtractor = useCallback((item, index) => {
    const { _index, pkey, id } = item;

    switch (_index) {
      case "user":
        return `${id}-${index}`;
      case "city":
      case "country":
      case "property":
        return pkey;
      default:
        return index;
    }
  }, []);

  const textInputRef = useRef();

  return (
    <SafeAreaView style={container}>
      <KeyboardAvoidingView behavior={PLATFORM === "ios" ? "padding" : null} style={flex}>
        <View style={containerStyle}>
          <View style={rowStyle}>
            <TouchableOpacity>
              <Appbar.BackAction
                onPress={navigation.goBack}
                color={colors.primary}
                size={20}
              />
            </TouchableOpacity>
            <TextInput
              autoFocus
              textInputContainerStyle={searchContainerStyle}
              placeholder={searchTextPlaceholder}
              placeholderTextColor={colors.gray}
              defaultValue={searchText}
              ref={textInputRef}
              theme={textInputTheme}
              onChangeText={handleTextChanged}
            />
            {searchText.length > 0 && (
              <TouchableOpacity style={clearTextStyle} onPress={handleClearText}>
                <Icon
                  disabled
                  type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                  size={scale(20)}
                  name={"close"}
                  color={colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          {selectedScope === SearchScopes.PROPERTY && (
            <TouchableOpacity onPress={handleShowDestinationSelector}>
              <Animated.View entering={FadeInUp} pointerEvents={"none"}>
                <TextInput
                  mode={"flat"}
                  underlineColor={"transparent"}
                  style={destinationStyle}
                  value={selectedDestination?.title[language] || ""}
                  placeholder={t("search_where")}
                  theme={textInputTheme}
                  onChangeText={handleTextChanged}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
          {!isCategoryRecommendation && !isHashtag && (
            <View style={buttonsContainer}>
              <ScrollView
                contentContainerStyle={flex}
                horizontal
                keyboardShouldPersistTaps={"handled"}
              >
                {BUTTONS.map(item => {
                  const { containerStyle } = searchScopeStyles(
                    colors,
                    selectedScope === item
                  );
                  return (
                    <TouchableOpacity
                      onPress={() => handleFilterSelected(item)}
                      key={item}
                      style={containerStyle}
                    >
                      <CText
                        fontSize={11}
                        lineHeight={16}
                        color={selectedScope === item ? "white" : "primary"}
                      >
                        {t(`search_page.${item}`)}
                      </CText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <LinearGradient
            locations={[0, 2 / 3, 1]}
            colors={[colors.shadowOverlay, "transparent", "transparent"]}
            style={shadowStyle}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={searchResults}
          style={flex}
          contentContainerStyle={contentContainerStyle}
          onEndReached={handleOnEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={renderListFooterComponent}
          renderItem={renderResults}
          keyExtractor={handleKeyExtractor}
          keyboardShouldPersistTaps={"handled"}
          refreshControl={
            <RefreshControl
              tintColor={colors.primary}
              refreshing={isRefreshing}
              onRefresh={handleOnRefresh}
            />
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;
