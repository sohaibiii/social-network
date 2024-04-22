import React, { useCallback } from "react";
import { View, Keyboard, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import styles from "./SearchCityModalContent.styles";
import { SearchCityModalContentType } from "./SearchCityModalContent.types";

import { RootState } from "~/redux/store";

import { modalizeRef } from "~/components/";
import { CText, PropertyMiniCard } from "~/components/common";
import { setSearchCountryCityRegionTerm } from "~/redux/reducers/countyCityRegion.reducer";
import { AppStackRoutesCityCountryRegionProps } from "~/router/AppStackRoutes/AppStackRoutes.type";
import { logEvent, NAVIGATE_TO_CITY_COUNTRY_REGION } from "~/services/";

const SearchCityModalContent = (props: SearchCityModalContentType): JSX.Element => {
  const { regionWithCities } = props;

  const { t } = useTranslation();
  const navigation = useNavigation<AppStackRoutesCityCountryRegionProps["navigation"]>();

  const dispatch = useDispatch();

  const language = useSelector((state: RootState) => state.settings.language || "ar");
  const searchCountryCityRegionTerm = useSelector(
    (state: RootState) => state.countryCityRegion.searchCountryCityRegionTerm || ""
  );

  const handlePropertyCallback = useCallback(
    async item => {
      const { type, slug, title } = item;
      modalizeRef.current?.close();
      Keyboard.dismiss();
      dispatch(setSearchCountryCityRegionTerm({ searchCountryCityRegionTerm: "" }));
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        source: "search_city_modal",
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
    [language, navigation, dispatch]
  );

  const filteredDestinations = regionWithCities?.filter(
    dest =>
      dest?.title?.ar
        ?.toLowerCase()
        ?.includes(searchCountryCityRegionTerm.toLowerCase()) ||
      dest?.title?.en?.toLowerCase()?.includes(searchCountryCityRegionTerm.toLowerCase())
  );

  const handleKeyExtractor = (item: any, index: number) => `${item.pkey}-${index}`;

  const handleRenderItem = ({ item, index }) => {
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
  };
  const handleListEmptyComponent = () => {
    return (
      <CText fontSize={14} textAlign="center" style={noResultTextStyle}>
        {t("no_results_found")}
      </CText>
    );
  };
  const { containerStyle, noResultTextStyle } = styles;

  return (
    <View style={containerStyle}>
      <FlatList
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        data={filteredDestinations}
        ListEmptyComponent={handleListEmptyComponent}
      />
    </View>
  );
};

export default SearchCityModalContent;
