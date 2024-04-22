import React, { useCallback, useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator
} from "react-native";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { DestinationsType } from "../cityCountryRegion/CityCountryRegion.types";

import styles from "./SearchCityCountyRegion.style";

import { RootState } from "~/redux/store";

import countryService from "~/apiServices/country";
import { CText, PropertyMiniCard, TextInput, Icon, IconTypes } from "~/components/common";
import { SearchCityCountyRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import {
  logEvent,
  NAVIGATE_TO_CITY_COUNTRY_REGION,
  SEARCH_CITY_COUNTRY_REGION_SEARCH,
  SEARCH_CITY_COUNTRY_REGION_GET,
  SEARCH_CITY_COUNTRY_REGION_GET_SUCCESS,
  SEARCH_CITY_COUNTRY_REGION_GET_FAILED
} from "~/services/";
import { generalErrorHandler } from "~/utils/";

const SearchCityCountyRegion = (props: SearchCityCountyRegionProps): JSX.Element => {
  const { navigation, route } = props;

  const { type, slug, destinationInfo = {} } = route?.params || {};
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [countryName, setCountryName] = useState<string>("");
  const [regionWithCities, setRegionWithCities] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const searchCountryCityRegionTerm = "";
  const language = useSelector((state: RootState) => state.settings.language || "ar");

  const {
    containerStyle,
    noResultTextStyle,
    searchHeaderWrapperStyle,
    searchTitleTextStyle,
    closeIconStyle,
    headerWrapperStyle
  } = useMemo(() => styles(colors), [colors]);

  useEffect(() => {
    if (!destinationInfo?.pkey) {
      return;
    }
    const pKey =
      type === DestinationsType.CITY || type === DestinationsType.REGION
        ? destinationInfo?.country?.id
        : destinationInfo?.pkey;

    const analyticsProps = {
      source: "search_city_modal",
      pkey: pKey,
      slug,
      type
    };

    logEvent(SEARCH_CITY_COUNTRY_REGION_GET, analyticsProps);

    countryService
      .getCountryRegionsAndCitiesByPkey(pKey)
      .then(async response => {
        const { regionsWithCitiesData = [], countryName = "" } = response;
        await logEvent(SEARCH_CITY_COUNTRY_REGION_GET_SUCCESS, analyticsProps);

        setCountryName(countryName);
        setRegionWithCities(regionsWithCitiesData);
        setFilteredDestinations(regionsWithCitiesData);
      })
      .catch(async error => {
        await logEvent(SEARCH_CITY_COUNTRY_REGION_GET_FAILED, analyticsProps);
        generalErrorHandler(
          `${error} getCountryRegionsAndCitiesByPkey failed in SearchCityCountryRegion`
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [type, destinationInfo, slug]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: props => (
        <SafeAreaView style={headerWrapperStyle}>
          <View />
          <CText
            fontSize={13}
            style={searchTitleTextStyle}
            color="primary"
            textAlign="center"
          >
            {`${t("list_of_cities_in")} ${t("in")} ${countryName}`}
          </CText>
          <Icon
            type={IconTypes.MATERIAL_ICONS}
            name={"close"}
            size={23}
            color={colors.text}
            style={closeIconStyle}
            onPress={navigation.goBack}
          />
        </SafeAreaView>
      )
    });
  }, [
    destinationInfo.country.name,
    destinationInfo.name,
    navigation,
    searchTitleTextStyle,
    t,
    type,
    colors.text,
    closeIconStyle,
    headerWrapperStyle,
    countryName
  ]);

  const handleNavigateToCountry = useCallback(async () => {
    const { slug: countrySlug, name: countryTitle } = destinationInfo?.country;
    Keyboard.dismiss();
    await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
      source: "search_city_country_region",
      title: countryTitle,
      slug: countrySlug,
      type: DestinationsType.COUNTRY
    });

    navigation.navigate({
      name: "CityCountryRegion",
      key: `${moment().unix()}`,
      params: { title: countryTitle, slug: countrySlug, type: DestinationsType.COUNTRY }
    });
  }, [destinationInfo?.country, navigation]);

  const handlePropertyCallback = useCallback(
    async item => {
      const { type, slug, title } = item;
      Keyboard.dismiss();
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        source: "search_city_country_region",
        title: title[language],
        slug,
        type
      });
      navigation.navigate({
        name: "CityCountryRegion",
        key: `${moment().unix()}`,
        params: { title: title[language], slug, type }
      });
    },
    [language, navigation]
  );

  const handleKeyExtractor = useCallback(
    (item: any, index: number) => `${item.pkey}-${index}`,
    []
  );

  const handleRenderItem = useCallback(
    ({ item, index }) => {
      return (
        <View>
          <PropertyMiniCard
            hasRating={false}
            selected={false}
            setSelectionCb={handlePropertyCallback}
            item={item}
          />
        </View>
      );
    },
    [handlePropertyCallback]
  );

  const handleListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return <ActivityIndicator size={"large"} />;
    }
    return (
      <CText fontSize={14} textAlign="center" style={noResultTextStyle}>
        {t("no_results_found")}
      </CText>
    );
  }, [noResultTextStyle, t, isLoading]);

  const handleSearch = useCallback(
    async textSearched => {
      await logEvent(SEARCH_CITY_COUNTRY_REGION_SEARCH, {
        source: "search_city_modal",
        term: textSearched,
        slug,
        type
      });

      const filteredDestinations = regionWithCities?.filter(
        dest =>
          dest?.title?.ar?.toLowerCase()?.includes(textSearched.toLowerCase()) ||
          dest?.title?.en?.toLowerCase()?.includes(textSearched.toLowerCase())
      );
      setFilteredDestinations(
        textSearched === "" ? regionWithCities : filteredDestinations
      );
    },
    [regionWithCities, slug, type]
  );

  const handleListHeaderComponent = useCallback(() => {
    const isNotCountry =
      type === DestinationsType.CITY || type === DestinationsType.REGION;

    return (
      <View>
        <View style={searchHeaderWrapperStyle}>
          <TextInput
            defaultValue={searchCountryCityRegionTerm}
            onChangeText={handleSearch}
            label={t("search")}
            leftIcon={"magnify"}
          />
        </View>
        {isNotCountry && (
          <TouchableOpacity
            style={searchHeaderWrapperStyle}
            onPress={handleNavigateToCountry}
          >
            <CText fontSize={13} color={"primary"} style={searchTitleTextStyle}>
              {`<< ${t("return_to_country", {
                country: countryName
              })}`}
            </CText>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    type,
    searchHeaderWrapperStyle,
    handleSearch,
    t,
    handleNavigateToCountry,
    searchTitleTextStyle,
    countryName
  ]);

  return (
    <SafeAreaView style={containerStyle}>
      <FlatList
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        data={filteredDestinations}
        ListEmptyComponent={handleListEmptyComponent}
        ListHeaderComponent={handleListHeaderComponent}
        keyboardShouldPersistTaps={"handled"}
      />
    </SafeAreaView>
  );
};

export default SearchCityCountyRegion;
