import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import styles from "./FilterContent.styles";

import { RootState } from "~/redux/store";

import { CText, PriceDollars, RadioButton, RadioGroup } from "~/components/common";
import { Button, modalizeRef } from "~/components/common";
import { scale } from "~/utils/";

const FilterContent = props => {
  const { categories = [], filters = {}, onApplyFilterCb = () => {} } = props;
  const { price_range, is_open } = filters;

  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const language = useSelector((state: RootState) => state.settings.language) || "ar";

  const [activeFilter, setActiveFilter] = useState(filters);

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

  const handleApplyFilter = () => {
    onApplyFilterCb(activeFilter);
    modalizeRef.current?.close();
  };

  const onPriceChange = (value: string) => {
    setActiveFilter(filter => ({ ...filter, price_range: value === "0" ? null : value }));
  };

  const onOpenChange = (value: string) => {
    setActiveFilter(filter => ({ ...filter, is_open: value === "0" ? null : true }));
  };

  const handleArticleCategoryPressed = (isActive: boolean, title: string, id: number) => {
    setActiveFilter(oldActiveFilters => ({
      ...oldActiveFilters,
      filters: isActive
        ? oldActiveFilters.filters.filter(category => category.id !== id)
        : oldActiveFilters.filters.concat([{ id, title }])
    }));
  };

  const {
    containerStyle,
    applyFilterButtonStyle,
    categoryWrapperStyle,
    categoryTextStyle,
    categoriesWrapperStyle,
    activeCategoryWrapperStyle,
    activeCategoryTextStyle,
    subtitleTextStyle,
    filterBtnLabelStyle,
    labelTextStyle
  } = styles;

  return (
    <View style={containerStyle}>
      {priceRadioProps.length > 0 && (
        <>
          <CText style={subtitleTextStyle}>{t("price")}</CText>
          <RadioGroup defaultValue={price_range ?? "0"} row onToggle={onPriceChange}>
            {priceRadioProps.map(({ value }, index) => {
              const label = () =>
                index === 0 ? (
                  <CText style={labelTextStyle(theme)} key={index}>
                    {t("all")}
                  </CText>
                ) : (
                  <PriceDollars
                    spacing={scale(4)}
                    maxNumber={priceRadioProps.length - 1}
                    priceRange={priceRadioProps.length - index}
                  />
                );

              return <RadioButton key={index} value={value + ""} label={label} />;
            })}
          </RadioGroup>
          <Divider />
        </>
      )}
      <CText style={subtitleTextStyle}>{t("work_time")}</CText>
      <RadioGroup defaultValue={is_open ? "1" : "0"} row onToggle={onOpenChange}>
        <RadioButton value={"0"} label={t("all")} labelStyle={labelTextStyle(theme)} />
        <RadioButton
          value={"1"}
          label={t("open_now")}
          labelStyle={labelTextStyle(theme)}
        />
      </RadioGroup>
      {categories.length > 0 && (
        <>
          <Divider />
          <CText style={subtitleTextStyle}>{t("pick_article_categories")}</CText>
          <View style={categoriesWrapperStyle}>
            {categories?.map(({ title, id }, index) => {
              const isActive = !!activeFilter?.filters?.find(
                category => category.id === id
              );

              const categoryWrapperStyles = [
                categoryWrapperStyle(theme),
                isActive ? activeCategoryWrapperStyle(theme) : {}
              ];
              const categoryTextStyles = [
                categoryTextStyle(theme),
                isActive ? activeCategoryTextStyle(theme) : {}
              ];

              return (
                <TouchableOpacity
                  key={`${id}-${index}`}
                  style={categoryWrapperStyles}
                  onPress={() => handleArticleCategoryPressed(isActive, title, id)}
                >
                  <CText style={categoryTextStyles}>{title[language]}</CText>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <Button
        mode="contained"
        title={t("apply")}
        labelStyle={filterBtnLabelStyle(theme)}
        onPress={handleApplyFilter}
        style={applyFilterButtonStyle(theme, insets)}
      />
    </View>
  );
};

export default FilterContent;
