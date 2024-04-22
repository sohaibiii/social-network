import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import selectPropertyStyle from "./SelectProperty.style";
import { SelectPropertyProps } from "./SelectProperty.types";

import { RootState } from "~/redux/store";

import { searchService } from "~/apiServices/index";
import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";
import {
  PropertyMiniCard,
  CText,
  LottieActivityIndicator,
  TextInput
} from "~/components/";
import { APP_SCREEN_HEIGHT, PAGER_STEPS_FOOTER, PLATFORM } from "~/constants/";
import { generalErrorHandler } from "~/utils/";

const SelectProperty = (props: SelectPropertyProps): JSX.Element => {
  const {
    multiSelect = false,
    countryRegionCity = {} as CountryRegionCityType,
    selectedProperties: selectedPropertiesProp = [],
    onSearchCb = () => undefined,
    onSearchSuccessCb = () => undefined,
    onSearchFailedCb = () => undefined,
    initialSearch = "",
    onPropertyAddedCb = () => undefined,
    onPropertyRemovedCb = () => undefined,
    setIsNextDisabled = () => undefined,
    isRateProperty = false
  } = props;
  const { t } = useTranslation();

  const [selectedProperties, setSelectedProperties] =
    useState<PropertyResponseType[]>(selectedPropertiesProp);

  const insets = useSafeAreaInsets();

  const [properties, setProperties] = useState<PropertyResponseType[]>([]);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(!!initialSearch);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const postCountryRegionCityArr = isRateProperty
    ? [
        useSelector(
          (reduxState: RootState) =>
            reduxState.propertySocialAction.rateProperty.rateCountryRegionCity
        )
      ]
    : useSelector(
        (reduxState: RootState) =>
          reduxState.propertySocialAction.addPost.postCountryRegionCityArr
      );

  const { containerStyle, inputContainerStyle, loadingContainer, loadingStyle } =
    selectPropertyStyle(APP_SCREEN_HEIGHT * 0.8);

  const setSearchTermDebounced = useDebouncedCallback(value => {
    setSearchTerm(value);
    onSearchCb(value);
    if (value.length < 3) {
      setProperties([]);
      setIsLoading(false);
      return;
    }

    let countries: string[] = [];
    let regions: string[] = [];
    let cities: string[] = [];

    countries =
      postCountryRegionCityArr
        ?.filter(tag => tag.type === "country" || tag._index === "country")
        ?.map(dest => dest.pkey) || [];

    regions =
      postCountryRegionCityArr
        ?.filter(tag => tag.type === "region" || tag._index === "region")
        ?.map(dest => dest.pkey) || [];

    cities =
      postCountryRegionCityArr
        ?.filter(tag => tag.type === "city" || tag._index === "city")
        ?.map(dest => dest.pkey) || [];

    const searchFunction = isRateProperty
      ? searchService.searchPropertiesByTags(
          value,
          countries.map(geoPlace => geoPlace).join(","),
          regions.map(geoPlace => geoPlace).join(","),
          cities.map(geoPlace => geoPlace).join(",")
        )
      : searchService.searchByTags(
          value,
          countries.map(geoPlace => geoPlace).join(","),
          regions.map(geoPlace => geoPlace).join(","),
          cities.map(geoPlace => geoPlace).join(",")
        );

    searchFunction
      .then(res => {
        onSearchSuccessCb(value);
        setProperties(
          res.items.filter(
            (tag, index, array) => array.findIndex(k => k.pkey === tag.pkey) === index
          )
        );
      })
      .catch(error => {
        onSearchFailedCb(value);
        generalErrorHandler(
          `Error: ${
            isRateProperty ? "searchPropertiesByTags" : "searchByTags"
          } --SelectProperty.tsx-- term=${value} ${error}`
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
    setIsNextDisabled(selectedProperties.length <= 0);
  }, [selectedProperties.length, setIsNextDisabled]);

  useEffect(() => {
    if (PLATFORM === "android") {
      return;
    }
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSelectProperty = (property: PropertyResponseType) => {
    const { pkey = "" } = property;
    const index = selectedProperties.findIndex(item => {
      return item.pkey === pkey;
    });
    if (index > -1) {
      const tempSelectedProperties = Array.from(selectedProperties);
      tempSelectedProperties.splice(index, 1);
      setSelectedProperties(tempSelectedProperties);
      onPropertyRemovedCb(property);
    } else {
      setSelectedProperties(
        multiSelect ? oldValue => oldValue.concat(property) : [property]
      );
      if (!multiSelect) {
        Keyboard.dismiss();
      }
      onPropertyAddedCb(property);
    }
  };

  const handleLocationInputChanged = (value: string) => {
    setIsLoading(true);
    setSearchTermDebounced(value);
  };

  const bottomPadding = {
    paddingBottom:
      PLATFORM === "ios" && isKeyboardVisible
        ? keyboardHeight - PAGER_STEPS_FOOTER - insets.bottom
        : 0
  };

  return (
    <View style={containerStyle} collapsable={false}>
      <View style={inputContainerStyle}>
        <TextInput
          defaultValue={searchTerm}
          onChangeText={handleLocationInputChanged}
          label={t("search_for_all")}
        />
        <View style={bottomPadding}>
          {!isRateProperty &&
            postCountryRegionCityArr
              ?.filter(item => {
                return !selectedProperties?.find(dest => dest.pkey === item.pkey);
              })
              .map(item => {
                const { pkey = "", isTemp = false } = item;
                if (isTemp) {
                  return <View key={`temp_${pkey}`} />;
                }
                return (
                  <PropertyMiniCard
                    key={pkey}
                    hasRating={false}
                    selected={false}
                    setSelectionCb={handleSelectProperty}
                    item={item}
                  />
                );
              })}
          {selectedProperties?.map(item => {
            const { pkey = "" } = item;
            return (
              <PropertyMiniCard
                key={pkey}
                hasRating={false}
                selected
                setSelectionCb={handleSelectProperty}
                item={item}
              />
            );
          })}
          {properties
            .filter(item => {
              return !selectedProperties?.find(dest => dest.slug === item.slug);
            })
            .map(item => {
              const { pkey = "" } = item;
              const isSelected =
                selectedProperties.findIndex(property => {
                  return property.pkey === pkey;
                }) > -1;
              return (
                <PropertyMiniCard
                  key={pkey}
                  hasRating={false}
                  selected={isSelected}
                  setSelectionCb={handleSelectProperty}
                  item={item}
                />
              );
            })}
        </View>
        {isLoading && (
          <View style={loadingContainer}>
            <LottieActivityIndicator style={loadingStyle} />
          </View>
        )}
        {properties.length <= 0 && postCountryRegionCityArr?.length === 0 && !isLoading && (
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
export default SelectProperty;
