import React, { useCallback, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import countryAndStateSelectorStyle from "./CountryAndStateSelector.style";
import {
  CountryAndStateSelectorTypes,
  TripsGuardDestination
} from "./CountryAndStateSelector.types";

import { RootState } from "~/redux/store";

import FLAGS from "~/assets/images/flags";
import { modalizeRef, CText } from "~/components/";
import { CountrySelectorContent } from "~/components/common/CountrySelectorContent";
import { ListSelectorItem } from "~/components/common/ListSelector/ListSelector.types";
import { APP_SCREEN_HEIGHT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { setCountryTerm } from "~/redux/reducers/countyCityRegion.reducer";

const CountryAndStateSelector = (props: CountryAndStateSelectorTypes): JSX.Element => {
  const { colors } = useTheme();

  const {
    defaultValue = undefined,
    handleItemSelectedCb = () => undefined,
    prefixText = "",
    isPassport = false
  } = props;

  const dispatch = useDispatch();

  const tripsGuardDestination = useSelector(
    (state: RootState) => state.tripsGuard.destinations,
    shallowEqual
  );

  const tripsGuardFiltered = isPassport
    ? tripsGuardDestination.filter(
        country => !country.key?.toLowerCase().includes("us state")
      )
    : tripsGuardDestination;
  const [selection, setSelection] = useState(defaultValue);

  const {
    flagsIconStyle,
    cardStyle,
    containerStyle,
    countryItemSelected,
    countryItemUnselected,
    flagStyle,
    countryTitleSelected,
    countryTitleUnselected
  } = countryAndStateSelectorStyle(colors);

  const hideSheet = () => {
    modalizeRef.current?.close();
  };

  const handleSelected = useCallback((country: TripsGuardDestination) => {
    setSelection(country);
    hideSheet();
  }, []);

  const handleItemSelected = (item: TripsGuardDestination) => {
    handleSelected(item);
    handleItemSelectedCb(item);
  };

  const handleRenderItem = useCallback(
    ({ item }) => {
      const selected = item.name === selection;
      const { name = "", code = "PS" } = item;

      return (
        <TouchableOpacity
          onPress={() => handleItemSelected(item)}
          style={selected ? countryItemSelected : countryItemUnselected}
        >
          <Text style={selected ? countryTitleSelected : countryTitleUnselected}>
            {name}
          </Text>
          <Image source={FLAGS[code]} style={flagStyle} />
        </TouchableOpacity>
      );
    },
    [
      countryItemSelected,
      countryItemUnselected,
      countryTitleSelected,
      countryTitleUnselected,
      flagStyle,
      handleItemSelected,
      selection
    ]
  );

  const keyExtractor = (item: ListSelectorItem) => {
    return item?.key.toString();
  };

  const showSheet = useCallback(() => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <CountrySelectorContent
            handleRenderItem={handleRenderItem}
            countries={tripsGuardFiltered}
            keyExtractor={keyExtractor}
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
  }, [dispatch, handleRenderItem, tripsGuardFiltered]);

  if (tripsGuardFiltered?.length === 0) {
    return <View />;
  }

  return (
    <TouchableOpacity style={containerStyle} onPress={showSheet}>
      <View style={cardStyle}>
        {!!selection?.code && (
          <Image source={FLAGS[selection?.code]} style={flagsIconStyle} />
        )}
        <CText fontSize={16} fontFamily="light">
          {` ${prefixText} `}
        </CText>
        {selection?.name && <CText fontSize={16}>{` ${selection?.name} `}</CText>}
      </View>
    </TouchableOpacity>
  );
};
export default CountryAndStateSelector;
