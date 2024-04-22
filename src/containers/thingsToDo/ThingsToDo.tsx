import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import thingsToDoStyles from "./ThingsToDo.style";

import { RootState } from "~/redux/store";

import { searchService } from "~/apiServices/index";
import { PropertyResponseType } from "~/apiServices/property/property.types";
import {
  Button,
  CText,
  Icon,
  LottieActivityIndicator,
  PropertyMiniCard
} from "~/components/";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import { PropertyMiniCardSkeleton } from "~/components/common/PropertyMiniCard";
import { THINGS_TO_DO_AD, RESTAURANTS_CATEGORY_ID } from "~/constants/";
import {
  logEvent,
  THINGS_TO_DO_LOAD_DATA,
  THINGS_TO_DO_LOAD_DATA_FAILED,
  THINGS_TO_DO_LOAD_DATA_SUCCESS,
  THINGS_TO_DO_LOAD_MORE_RESULT,
  THINGS_TO_DO_NO_RESULT,
  NAVIGATE_TO_PROPERTY,
  NAVIGATE_TO_CITY_COUNTRY_REGION,
  NAVIGATE_TO_CITY_COUNTRY_REGION_RELATED_PROPERTIES
} from "~/services/analytics";
import { generalErrorHandler } from "~/utils/";

const ThingsToDo = (props): JSX.Element => {
  const { route = {} } = props;
  const { type, pkey, id, thingsToDoId, country, countryTitle, slug } = route?.params;

  const { t } = useTranslation();
  const PAGE_SIZE = 10;
  const navigation = useNavigation();

  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[THINGS_TO_DO_AD.config];

  const [properties, setProperties] = useState<PropertyResponseType[]>([]);
  const [from, setFrom] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    container,
    itemStyle,
    notFoundStyle,
    marginTop,
    whiteLabel,
    buttonStyle,
    rowStyle,
    loadingStyle,
    margin
  } = thingsToDoStyles;

  const getThingsToDo = useCallback(
    async (fromParam = 0) => {
      await logEvent(THINGS_TO_DO_LOAD_DATA, {
        page: fromParam,
        size: PAGE_SIZE,
        type,
        id,
        things_to_do_id: thingsToDoId
      });
      searchService
        .getCategoryRecommendation(fromParam, PAGE_SIZE, type, id, thingsToDoId)
        .then(res => {
          if (res) {
            if (Array.isArray(res) && res.length > 0) {
              const { title = "", items = [], total = 0 } = res[0];
              navigation.setOptions({
                title
              });
              setProperties(
                fromParam === 0 ? items : prevState => prevState.concat(items)
              );
              if (totalResults === 0) {
                setTotalResults(total);
              }
              if (items.length === 0) {
                return logEvent(THINGS_TO_DO_NO_RESULT, {
                  page: fromParam,
                  size: PAGE_SIZE,
                  type,
                  id,
                  things_to_do_id: thingsToDoId
                });
              }
              return logEvent(THINGS_TO_DO_LOAD_DATA_SUCCESS, {
                page: fromParam,
                size: PAGE_SIZE,
                type,
                id,
                things_to_do_id: thingsToDoId
              });
            }
          }
        })
        .catch(async error => {
          generalErrorHandler(
            `Error: getCategoryRecommendation --ThingsToDo.tsx-- id=${id} thingsToDoId=${thingsToDoId} type=${type} from=${fromParam} ${error}`
          );
          await logEvent(THINGS_TO_DO_LOAD_DATA_FAILED, {
            page: fromParam,
            size: PAGE_SIZE,
            type,
            id,
            things_to_do_id: thingsToDoId
          });
        })
        .finally(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        });
    },
    [id, navigation, thingsToDoId, totalResults, type]
  );

  useEffect(() => {
    getThingsToDo();
  }, []);

  const handleGoToCounty = async () => {
    await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
      slug,
      title: country,
      type,
      source:
        thingsToDoId === RESTAURANTS_CATEGORY_ID
          ? "top_restaurants_result_page"
          : "things_to_do_result_page"
    });
    navigation.navigate("CityCountryRegion", { slug, title: country, type });
  };

  const handlePropertyPressed = async (res: PropertyResponseType) => {
    const { slug } = res;
    await logEvent(NAVIGATE_TO_PROPERTY, {
      source:
        thingsToDoId === RESTAURANTS_CATEGORY_ID
          ? "top_restaurants_result_page"
          : "things_to_do_result_page",
      slug
    });
    navigation.navigate("Property", { slug });
  };

  const handleNoResultsButton = async () => {
    if (thingsToDoId === RESTAURANTS_CATEGORY_ID) {
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION_RELATED_PROPERTIES, {
        type,
        destinationPkey: pkey,
        pkey: RESTAURANTS_CATEGORY_ID,
        total: 100,
        title: country,
        propertiesTitle: country,
        source: "top_restaurants_result_page"
      });
      navigation.navigate("CityCountryRegionRelatedProperties", {
        type,
        destinationPkey: pkey,
        pkey: RESTAURANTS_CATEGORY_ID,
        total: 100,
        title: countryTitle,
        propertiesTitle: t("restaurants")
      });
      return;
    }
    await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
      slug,
      title: country,
      type,
      source: "things_to_do_result_page"
    });
    navigation.navigate("CityCountryRegion", { slug, title: country, type });
  };
  const renderResults = useCallback(
    ({ item, index }) => {
      const { pkey } = item;

      return (
        <View style={itemStyle}>
          <PropertyMiniCard
            setSelectionCb={handlePropertyPressed}
            key={pkey}
            item={item}
            index={index}
          />
        </View>
      );
    },
    [navigation, itemStyle]
  );

  const renderListFooterComponent = useCallback(() => {
    if (properties.length === 0) {
      return null;
    }
    if (!isLoading && !isRefreshing && properties.length >= totalResults) {
      return (
        <TouchableOpacity style={margin} onPress={handleGoToCounty}>
          <CText color={"primary"} fontSize={15}>
            {t("for_more_results", {
              country
            })}
          </CText>
        </TouchableOpacity>
      );
    }
    return <PropertyMiniCardSkeleton />;
  }, [isLoading, isRefreshing, properties.length, totalResults]);

  const renderListHeaderComponent = useCallback(() => {
    return <AdsItem adId={THINGS_TO_DO_AD.id} config={config} />;
  }, [config]);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading || isRefreshing) {
      return <LottieActivityIndicator style={loadingStyle} />;
    }
    const descriptionText =
      thingsToDoId === RESTAURANTS_CATEGORY_ID
        ? "no_best_restaurants"
        : "no_best_things_to_do";
    const buttonText =
      thingsToDoId === RESTAURANTS_CATEGORY_ID
        ? `${t("restaurants")} ${t("in")} ${country}`
        : `${t("visit")} ${country}`;
    return (
      <View>
        <View style={notFoundStyle}>
          <Icon style={loadingStyle} color={"gray"} name={"no_results_sad"} />
          <CText style={marginTop} fontSize={18}>
            {t("sorry")}
          </CText>
          <CText style={marginTop} textAlign={"center"} fontSize={13} color={"gray"}>
            {t(descriptionText, {
              city: country
            })}
          </CText>
          <View style={rowStyle}>
            <Button
              style={buttonStyle}
              labelStyle={whiteLabel}
              onPress={handleNoResultsButton}
              title={buttonText}
            />
          </View>
        </View>
      </View>
    );
  }, [isLoading, isRefreshing, notFoundStyle, loadingStyle, t]);

  const handleOnEndReached = useCallback(async () => {
    if (properties.length >= totalResults) {
      return;
    }
    const newFrom = from + PAGE_SIZE;

    setFrom(newFrom);
    getThingsToDo(newFrom);
    await logEvent(THINGS_TO_DO_LOAD_MORE_RESULT, { page: newFrom });
  }, [from, getThingsToDo, properties.length, totalResults]);

  const handleOnRefresh = useCallback(() => {
    setIsRefreshing(true);
    setFrom(0);
    getThingsToDo();
  }, [getThingsToDo]);

  const handleKeyExtractor = useCallback((item, index) => {
    return `${item.pkey}-${index}`;
  }, []);

  return (
    <SafeAreaView style={container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={properties}
        keyExtractor={handleKeyExtractor}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={renderListHeaderComponent}
        renderItem={renderResults}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleOnRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default ThingsToDo;
