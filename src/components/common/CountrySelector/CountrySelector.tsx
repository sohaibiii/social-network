import React, { useCallback, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { CountrySelectorContent } from "../CountrySelectorContent";

import { CountrySelectorTypes } from "./CountrySelector.types";

import countryService from "~/apiServices/country";
import { Country } from "~/apiServices/country/country.types";
import FLAGS from "~/assets/images/flags";
import { modalizeRef, TextInput } from "~/components/";
import countrySelectorStyle from "~/components/common/CountrySelector/CountrySelector.style";
import listSelectorStyle from "~/components/common/ListSelector/ListSelector.style";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setCountryTerm } from "~/redux/reducers/countyCityRegion.reducer";
import { translate } from "~/translations/";
import { generalErrorHandler } from "~/utils/";

const CountrySelector = (props: CountrySelectorTypes): JSX.Element => {
  const { colors } = useTheme();

  const {
    defaultValue = { name: "Palestine", code: "PS" },
    handleItemSelectedCb = () => undefined,
    error = "",
    onPressCb = () => undefined
  } = props;

  const [countries, setCountries] = useState<Country[]>([]);
  useEffect(() => {
    countryService
      .getCountriesCodes()
      .then(data => {
        setCountries(data);
      })
      .catch(error => {
        generalErrorHandler(`Error: getCountriesCodes --CountrySelector.tsx-- ${error}`);
      });
  }, []);

  const renderCountryItem = useCallback(
    (item: Country, selected: boolean, handleSelected: (_name: string) => void) => {
      const { countryItem, flagStyle, countryTitle } = countrySelectorStyle(
        colors,
        selected
      );

      const { name = "", code = "PS" } = item;

      const handleItemSelected = () => {
        handleSelected(name);
        handleItemSelectedCb(item);
      };

      return (
        <TouchableOpacity onPress={handleItemSelected} style={countryItem}>
          <Text style={countryTitle}>{name}</Text>
          <Image source={FLAGS[code]} style={flagStyle} />
        </TouchableOpacity>
      );
    },
    [colors, handleItemSelectedCb]
  );

  const [selection, setSelection] = useState(defaultValue?.name);

  const dispatch = useDispatch();

  const { containerStyle } = listSelectorStyle(colors);

  const hideSheet = () => {
    modalizeRef.current?.close();
  };

  const handleSelected = useCallback((name: string) => {
    setSelection(name);
    hideSheet();
  }, []);

  const handleRenderItem = useCallback(
    ({ item }) => renderCountryItem(item, item.name === selection, handleSelected),
    [handleSelected, renderCountryItem, selection]
  );

  const showSheet = useCallback(() => {
    onPressCb();
    dispatch(
      showBottomSheet({
        Content: () => (
          <CountrySelectorContent
            handleRenderItem={handleRenderItem}
            countries={countries}
          />
        ),
        props: {
          modalHeight: APP_SCREEN_HEIGHT * 0.8,
          onClose: () => {
            dispatch(setCountryTerm({ searchCountryTerm: "" }));
          }
        }
      })
    );
  }, [dispatch, handleRenderItem, countries]);

  if (countries?.length === 0) {
    return <View />;
  }

  return (
    <View testID={""} style={containerStyle}>
      <TouchableOpacity onPress={showSheet}>
        <View pointerEvents="none">
          <TextInput
            value={selection}
            label={translate("country_profile")}
            error={error?.message}
            errorVisible={false}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CountrySelector;
