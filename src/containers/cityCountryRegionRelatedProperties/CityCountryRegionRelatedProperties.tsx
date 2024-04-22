import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from "react";
import { View, SafeAreaView, TouchableOpacity, FlatList } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

import { DestinationsType } from "../cityCountryRegion/CityCountryRegion.types";

import styles from "./CityCountryRegionRelatedProperties.style";

import { RootState } from "~/redux/store";

import { surroundingLandMarksAPI } from "~/apis/";
import cityService from "~/apiServices/city";
import countryService from "~/apiServices/country";
import regionService from "~/apiServices/region";
import { FilterContent } from "~/components/cityCountryRegionRelatedProperties";
import { CText, Icon, IconTypes } from "~/components/common";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import { PropertyCard, ProperyCardSkeleton } from "~/components/home";
import { MORE_RELATED_PROPERTIES_AD } from "~/constants/";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import {
  RELATED_PROPERTIES_OPEN_FILTERS,
  logEvent,
  RELATED_PROPERTIES_GET_PROPERTIES,
  RELATED_PROPERTIES_GET_PROPERTIES_SUCCESS,
  RELATED_PROPERTIES_GET_PROPERTIES_FAILED,
  RELATED_PROPERTIES_GET_PROPERTIES_NO_RESULTS
} from "~/services/";
import { generalErrorHandler, logError, scale } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";

const PAGE_SIZE = 10;
const SKELETON_CARD_WIDTH = APP_SCREEN_WIDTH / 2 - 8;

const CityCountryRegionRelatedProperties = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute();
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[MORE_RELATED_PROPERTIES_AD.config];

  const language = useSelector((state: RootState) => state.settings.language) || "ar";

  const { type, destinationPkey, pkey, total = 0, title, propertiesTitle } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [from, setFrom] = useState(0);
  const [totalElements, setTotalElements] = useState(total ?? 0);
  const [propertiesCategories, setPropertiesCategories] = useState([]);
  const INITIAL_FILTER_STATE = {
    is_open: false,
    price_range: "0",
    filters: []
  };
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE);

  const {
    flatListContentContainerStyle,
    safeareaViewStyle,
    propertyCardContainerStyle,
    separatorViewStyle,
    adStyle,
    skeletonWrapperStyle
  } = useMemo(() => styles, []);

  const handleOnApplyFilterCb = useCallback(
    async activeFilter => {
      await logEvent(RELATED_PROPERTIES_OPEN_FILTERS, {
        source: "related_properties_page",
        type,
        pkey,
        destination_pkey: destinationPkey,
        filters: { ...activeFilter }
      });

      setProperties([]);
      setFrom(0);
      setFilters({ ...activeFilter });
    },
    [destinationPkey, pkey, type]
  );

  const renderHeaderRight = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await logEvent(RELATED_PROPERTIES_OPEN_FILTERS, {
            source: "related_properties_page",
            type,
            pkey,
            destination_pkey: destinationPkey
          });

          dispatch(
            showBottomSheet({
              Content: () => (
                <FilterContent
                  categories={propertiesCategories}
                  setFilters={setFilters}
                  filters={filters}
                  onApplyFilterCb={handleOnApplyFilterCb}
                />
              ),
              props: {
                modalHeight: APP_SCREEN_HEIGHT / 2
              }
            })
          );
        }}
      >
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          name={"control"}
          width={20}
          height={20}
          color={false ? theme.colors.primary : theme.colors.gray}
          disabled
        />
      </TouchableOpacity>
    );
  }, [
    theme.colors.primary,
    theme.colors.gray,
    type,
    pkey,
    destinationPkey,
    dispatch,
    propertiesCategories,
    filters,
    handleOnApplyFilterCb
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${propertiesTitle} ${t("in")} ${title[language]}`,
      headerTitleStyle: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.regular.fontFamily,
        textAlign: "center",
        fontSize: RFValue(14)
      },
      headerRight: renderHeaderRight,
      headerStyle: { backgroundColor: theme.colors.background }
    });
  }, [
    navigation,
    theme.colors.primary,
    t,
    language,
    propertiesTitle,
    title,
    renderHeaderRight,
    theme.colors.background,
    theme.fonts.regular.fontFamily
  ]);

  const getProperties = useCallback(
    async (from = 0) => {
      setIsLoading(true);

      let promise;
      let promiseTitle = "";

      const appliedFilters = {};
      const amplitutdeAppliedFilters = {};
      if (filters.filters.length > 0) {
        appliedFilters.filters = filters.filters.map(f => f.id.toString());
        amplitutdeAppliedFilters.filters = filters.filters.map(f =>
          f.title.en.toString()
        );
        amplitutdeAppliedFilters.filterIds = filters.filters.map(f => f.id.toString());
      }
      if (filters.is_open !== INITIAL_FILTER_STATE.is_open) {
        appliedFilters.is_open = filters.is_open;
        amplitutdeAppliedFilters.is_open = filters.is_open;
      }
      if (
        !!filters.price_range &&
        filters.price_range !== INITIAL_FILTER_STATE.price_range
      ) {
        appliedFilters.price_range = [Number(filters.price_range)];
        amplitutdeAppliedFilters.price_range = [Number(filters.price_range)];
      }

      const analyticsProps = {
        source: "related_properties_page",
        type,
        pkey,
        destination_pkey: destinationPkey,
        from,
        filters: { ...amplitutdeAppliedFilters }
      };

      await logEvent(RELATED_PROPERTIES_GET_PROPERTIES, analyticsProps);

      if (type === DestinationsType.CITY) {
        promiseTitle = "getCityProperties";
        promise = cityService.getCityProperties(
          destinationPkey,
          pkey,
          from,
          appliedFilters
        );
      } else if (type === DestinationsType.COUNTRY) {
        promiseTitle = "getCountryPropertiesByPkey";
        promise = countryService.getCountryPropertiesByPkey(
          destinationPkey,
          pkey,
          from,
          appliedFilters
        );
      } else if (type === DestinationsType.REGION) {
        promiseTitle = "getRegionPropertiesByPkey";
        promise = regionService.getRegionPropertiesByPkey(
          destinationPkey,
          pkey,
          from,
          appliedFilters
        );
      } else {
        return logError(
          `went in city country region related propertoes with weird type ${type}`
        );
      }

      promise
        .then(async res => {
          await logEvent(RELATED_PROPERTIES_GET_PROPERTIES_SUCCESS, analyticsProps);

          const data = res[0] || {};

          if (data?.items.length === 0) {
            await logEvent(RELATED_PROPERTIES_GET_PROPERTIES_NO_RESULTS, analyticsProps);
            return setProperties([]);
          }

          const optimizedProperties = data?.items?.reduce(normalizeByKey("pkey"), {});

          dispatch(upsertProperties(optimizedProperties));

          setProperties(oldProperties =>
            from === 0 ? data.items : oldProperties.concat(data.items)
          );
          setFrom(oldFrom => oldFrom + PAGE_SIZE);
          setTotalElements(data?.total);
        })
        .catch(async error => {
          await logEvent(RELATED_PROPERTIES_GET_PROPERTIES_FAILED, analyticsProps);
          generalErrorHandler(
            `Error: ${promiseTitle} --CityCountryRegionRelatedProperties.tsx destinationPkey=${destinationPkey} pkey=${pkey} ${error}`
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      type,
      destinationPkey,
      pkey,
      filters,
      dispatch,
      INITIAL_FILTER_STATE.is_open,
      INITIAL_FILTER_STATE.price_range
    ]
  );

  useEffect(() => {
    getProperties();
  }, [getProperties]);

  useEffect(() => {
    surroundingLandMarksAPI
      .getTypeFilters(pkey)
      .then(res => {
        setPropertiesCategories(res?.data?.items);
      })
      .catch(error =>
        logError(
          `Error: getTypeFilters --CityCountryRegionRelatedProperties.tsx-- pkey=${pkey} ${error}`
        )
      );
  }, [pkey]);

  const handleKeyExtractor = useCallback((item, index) => {
    return `${item.pkey}-${index}`;
  }, []);

  const handleRenderItem = useCallback(
    ({ item, index }) => {
      return (
        <PropertyCard
          cardWidth={APP_SCREEN_WIDTH / 2 - scale(12)}
          containerStyle={propertyCardContainerStyle(index, theme)}
          key={`${item.pkey}-${index}`}
          {...item}
          language={language}
          shouldRenderProgressive={false}
          city={item?.city}
          country={item?.country}
          analyticsSource={"related_properties_page"}
        />
      );
    },
    [language, propertyCardContainerStyle, theme]
  );

  const handleOnEndReached = useCallback(() => {
    if (from >= totalElements || isLoading) {
      return;
    }
    getProperties(from);
  }, [from, getProperties, isLoading, totalElements]);

  const renderListHeaderComponent = useCallback(() => {
    return (
      <AdsItem
        adId={MORE_RELATED_PROPERTIES_AD.id}
        config={config}
        containerStyle={adStyle}
      />
    );
  }, [adStyle, config]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading) {
      return null;
    }
    if (total - properties?.length > 10) {
      return (
        <View style={skeletonWrapperStyle}>
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
          <ProperyCardSkeleton cardWidth={SKELETON_CARD_WIDTH} marginRight={0} />
        </View>
      );
    } else {
      return (
        <View style={skeletonWrapperStyle}>
          {Array.from(Array(total - properties?.length).keys()).map((item, index) => {
            return (
              <ProperyCardSkeleton
                cardWidth={SKELETON_CARD_WIDTH}
                marginRight={0}
                key={index}
              />
            );
          })}
        </View>
      );
    }
  }, [isLoading, properties?.length, skeletonWrapperStyle, total]);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View>
        <CText fontSize={13}>{t("no_results_found")}</CText>
      </View>
    );
  }, [isLoading, t]);

  const safeareaViewStyles = useMemo(
    () => safeareaViewStyle(theme),
    [safeareaViewStyle, theme]
  );

  return (
    <SafeAreaView style={safeareaViewStyles}>
      <FlatList
        data={properties}
        keyExtractor={handleKeyExtractor}
        ListHeaderComponent={renderListHeaderComponent}
        renderItem={handleRenderItem}
        numColumns={2}
        contentContainerStyle={flatListContentContainerStyle}
        onEndReachedThreshold={0.9}
        onEndReached={handleOnEndReached}
        ListFooterComponent={renderListFooterComponent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default CityCountryRegionRelatedProperties;
