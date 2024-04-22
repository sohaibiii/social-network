import React, { FC, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { Divider, useTheme } from "react-native-paper";
import { useThrottledCallback } from "use-debounce";

import mapFilterModalStyles from "./mapFilterModal.styles";
import { IFilterValues, MapFilterModalProps } from "./mapFilterModal.types";

import {
  RadioGroup,
  RadioButton,
  PriceDollars,
  Button,
  CText,
  modalizeRef,
  RatingBar
} from "~/components/";
import { isRTL } from "~/constants/variables";
import { logEvent, SURROUNDING_LANDMARKS_SAVE_FILTERS } from "~/services/";
import { translate } from "~/translations/swTranslator";

const MapFilterModal: FC<MapFilterModalProps> = props => {
  const { filters, isHotel, currentFilterValues, onSave = () => undefined } = props;

  const [isLoading, setIsLoading] = useState(false);
  const priceRadioProps = [
    { value: 0 },
    {
      value: 4
    },
    {
      value: 3
    },
    {
      value: 2
    },
    {
      value: 1
    }
  ];

  const ratingRadioProps = [
    { value: 0 },
    { value: 5 },
    { value: 4 },
    { value: 3 },
    { value: 2 },
    { value: 1 }
  ];

  const isOpenRadioProps = [
    {
      label: translate("any_time"),
      value: 0
    },
    {
      label: translate("open_now"),
      value: 1
    }
  ];

  const { colors } = useTheme();

  const [filterValues, setFilterValues] = useState<IFilterValues>(currentFilterValues);

  const {
    root,
    modalButtonLabelStyle,
    modalButtonStyle,
    dividerStyle,
    filtersContainer,
    filterItemStyle
  } = mapFilterModalStyles(colors);

  useEffect(() => {
    setFilterValues(currentFilterValues);
  }, [currentFilterValues]);

  const onSavePress = useThrottledCallback(
    async () => {
      setIsLoading(true);
      await logEvent(SURROUNDING_LANDMARKS_SAVE_FILTERS, {
        source: "surrounding_landmarks_page",
        filterValues
      });
      onSave && onSave(filterValues);
      modalizeRef.current?.close();
    },
    1000,
    { leading: true, trailing: false }
  );

  const onWorkTimePress = (value: string) => {
    setFilterValues(prev => ({ ...prev, isOpen: value == "1" }));
  };

  const onPriceChange = (value: string) => {
    setFilterValues(prev => ({ ...prev, priceRange: value == "0" ? null : value }));
  };

  const onStarChange = (value: string) => {
    setFilterValues(prev => ({ ...prev, starRating: value == "0" ? null : value }));
  };

  const onFilterItemPress = (idx: string) => {
    if (!filterValues.selectedFilters.includes(idx)) {
      setFilterValues(prev => ({
        ...prev,
        selectedFilters: [...filterValues.selectedFilters, idx]
      }));
    } else {
      setFilterValues(prev => ({
        ...prev,
        selectedFilters: filterValues.selectedFilters.filter(id => id !== idx)
      }));
    }
  };

  return (
    <View style={root}>
      {!isHotel ? (
        <>
          <CText fontSize={16}>{translate("price")}</CText>
          <RadioGroup
            defaultValue={filterValues.priceRange || "0"}
            row
            onToggle={onPriceChange}
          >
            {priceRadioProps.map(({ value }, index) => {
              const label = () =>
                index === 0 ? (
                  <CText fontSize={14} key={index}>
                    {translate("all")}
                  </CText>
                ) : (
                  <PriceDollars
                    maxNumber={priceRadioProps.length - 1}
                    priceRange={priceRadioProps.length - index}
                  />
                );

              return <RadioButton key={index} value={value + ""} label={label} />;
            })}
          </RadioGroup>

          <Divider style={dividerStyle} />
          <CText fontSize={16}>{translate("work_time")}</CText>
          <RadioGroup
            defaultValue={filterValues.isOpen ? "1" : "0"}
            row
            onToggle={onWorkTimePress}
          >
            {isOpenRadioProps.map(({ value, label }, index) => {
              return <RadioButton key={index} value={value + ""} label={label} />;
            })}
          </RadioGroup>

          <Divider style={dividerStyle} />

          <View style={filtersContainer}>
            {filters.length
              ? filters?.map(item => {
                  const itemStyle = [
                    filterItemStyle,
                    {
                      backgroundColor: filterValues.selectedFilters.includes(item.id + "")
                        ? colors.primary
                        : "transparent"
                    }
                  ];

                  const itemTextColor = filterValues.selectedFilters.includes(
                    item.id + ""
                  )
                    ? "white"
                    : "text";
                  const itemName = item.title && item.title[isRTL ? "ar" : "en"];
                  if (!itemName) return;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={itemStyle}
                      onPress={() => onFilterItemPress(item.id + "")}
                    >
                      <CText fontFamily="light" fontSize={13} color={itemTextColor}>
                        {itemName}
                      </CText>
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </>
      ) : (
        <>
          <CText fontSize={16}>{translate("review")}</CText>
          <RadioGroup
            defaultValue={filterValues.starRating || "0"}
            row
            onToggle={onStarChange}
          >
            {ratingRadioProps.map(({ value }, index) => {
              const label = () =>
                index === 0 ? (
                  <CText fontSize={14} key={index}>
                    {translate("all")}
                  </CText>
                ) : (
                  <RatingBar disabled ratingCount={5} defaultValue={value} size={15} />
                );

              return <RadioButton key={index} value={value + ""} label={label} />;
            })}
          </RadioGroup>
        </>
      )}
      <Button
        isLoading={isLoading}
        title={translate("done")}
        labelStyle={modalButtonLabelStyle}
        style={modalButtonStyle}
        onPress={onSavePress}
      />
    </View>
  );
};

export { MapFilterModal };
