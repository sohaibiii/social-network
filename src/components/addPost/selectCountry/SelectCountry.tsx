import React, { useEffect, useState } from "react";
import { Keyboard, View, ScrollView } from "react-native";

import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";

import selectCountryStyle from "./SelectCountry.style";
import { SelectCountryRegionCityProps } from "./SelectCountryRegionCity.types";

import { searchService } from "~/apiServices/index";
import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";
import {
  CText,
  LottieActivityIndicator,
  PropertyMiniCard,
  TextInput
} from "~/components/";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { generalErrorHandler } from "~/utils/";

const SelectCountry = (props: SelectCountryRegionCityProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    onSearchCb = () => undefined,
    onSearchSuccessCb = () => undefined,
    onSearchFailedCb = () => undefined,
    selectedCountryRegionCity,
    initialSearch = "",
    setIsNextDisabled = () => undefined,
    onCountryRegionCityRemovedCb = () => undefined,
    onCountryRegionCitySelectedCb = () => undefined,
    countryRegionCityArr = [],
    isPost = false
  } = props;

  const [selection, setSelection] = useState(selectedCountryRegionCity?.pkey || "");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(!!initialSearch);
  const [countriesAndRegions, setCountriesAndRegions] = useState<PropertyResponseType[]>(
    []
  );

  const filteredCountryRegionCityArr =
    countryRegionCityArr?.filter(item => !item.isTemp) || [];

  const setSearchTermDebounced = useDebouncedCallback(value => {
    setSearchTerm(value);
    onSearchCb(value);
    if (value.length < 3) {
      setCountriesAndRegions([]);
      setIsLoading(false);
      return;
    }
    searchService
      .searchByTerm(value, "destination")
      .then(res => {
        onSearchSuccessCb(value);
        setCountriesAndRegions(
          res.items.filter(
            (tag, index, array) => array.findIndex(k => k.pkey === tag.pkey) === index
          )
        );
      })
      .catch(error => {
        onSearchFailedCb(value);
        generalErrorHandler(
          `Error: searchByTerm --SelectCountry.tsx-- term=${value} ${error}`
        );
      })
      .finally(() => setIsLoading(false));
  }, 200);

  useEffect(() => {
    if (initialSearch) {
      setSearchTermDebounced(initialSearch);
    }
  }, [initialSearch, setSearchTermDebounced]);

  useEffect(() => {
    const condition = isPost ? filteredCountryRegionCityArr.length <= 0 : !selection;
    setIsNextDisabled(condition);
  }, [filteredCountryRegionCityArr.length, setIsNextDisabled]);

  const { containerStyle, inputContainerStyle, loadingContainer, loadingStyle } =
    selectCountryStyle(APP_SCREEN_HEIGHT * 0.8);

  const handleSelectionPressed = (item: CountryRegionCityType) => {
    const { pkey = "" } = item;
    if (pkey === selection) {
      onCountryRegionCityRemovedCb(item);
      setSelection("");
      return;
    }
    Keyboard.dismiss();
    onCountryRegionCitySelectedCb(item);
    setSelection(pkey);
  };

  const handleUnselectionPressed = (item: CountryRegionCityType) => {
    onCountryRegionCityRemovedCb(item);
    setSelection("");
    return;
  };

  const handleLocationInputChanged = (value: string) => {
    if (value.length >= 3) {
      setIsLoading(true);
    }
    setSearchTermDebounced(value);
  };

  return (
    <View style={containerStyle} collapsable={false}>
      <View style={inputContainerStyle}>
        <TextInput
          defaultValue={searchTerm}
          onChangeText={handleLocationInputChanged}
          label={t("post_location")}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isPost &&
            filteredCountryRegionCityArr
              ?.filter(tag => tag.type === "country" || tag._index === "country")
              ?.map(item => {
                const { pkey = "", isTemp = false } = item;
                if (isTemp) {
                  return <View key={`temp_${pkey}`} />;
                }
                return (
                  <PropertyMiniCard
                    key={pkey}
                    selected={true}
                    setSelectionCb={handleUnselectionPressed}
                    item={item}
                  />
                );
              })}
          {isPost &&
            filteredCountryRegionCityArr
              ?.filter(tag => tag.type === "region" || tag._index === "region")
              ?.map(item => {
                const { pkey = "" } = item;
                return (
                  <PropertyMiniCard
                    key={pkey}
                    selected={true}
                    setSelectionCb={handleUnselectionPressed}
                    item={item}
                  />
                );
              })}
          {isPost &&
            filteredCountryRegionCityArr
              ?.filter(tag => tag.type === "city" || tag._index === "city")
              ?.map(item => {
                const { pkey = "" } = item;
                return (
                  <PropertyMiniCard
                    key={pkey}
                    selected={true}
                    setSelectionCb={handleUnselectionPressed}
                    item={item}
                  />
                );
              })}
          {countriesAndRegions
            .filter(item => {
              if (isPost) {
                return !filteredCountryRegionCityArr?.find(
                  dest => dest.slug === item.slug
                );
              }
              return filteredCountryRegionCityArr;
            })
            .map(item => {
              const { pkey = "" } = item;

              return (
                <PropertyMiniCard
                  key={pkey}
                  selected={selection === pkey}
                  setSelectionCb={handleSelectionPressed}
                  item={item}
                />
              );
            })}
        </ScrollView>
        {isLoading && (
          <View style={loadingContainer}>
            <LottieActivityIndicator style={loadingStyle} />
          </View>
        )}
        {countriesAndRegions.length <= 0 &&
          filteredCountryRegionCityArr?.filter(tag => tag.type !== "property")?.length ===
            0 &&
          !isLoading && (
            <View style={loadingContainer}>
              <View style={loadingStyle}>
                <CText textAlign={"center"}>
                  {searchTerm.length <= 0
                    ? t("search_for_location")
                    : t("no_results_found")}
                </CText>
              </View>
            </View>
          )}
      </View>
    </View>
  );
};
export default SelectCountry;
