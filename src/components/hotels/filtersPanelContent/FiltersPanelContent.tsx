import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import filtersPanelContentStyles from "./FiltersPanelContent.styles";
import { FiltersPanelContentProps } from "./FiltersPanelContent.types";

import { RootState } from "~/redux/store";

import { CText, RatingBar, RadioButton } from "~/components/";
import {
  FormikMultiSlider,
  FormikRadioGroup,
  FormikTextInput
} from "~/components/formik";
import { FiltersSearch } from "~/components/hotels/filtersSearch";
import { FormikFiltersSelector } from "~/components/hotels/formik/FormikFiltersSelector";
import { FilterSelectorType } from "~/components/hotels/formik/FormikFiltersSelector/FormikFiltersSelector.types";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH, CURRENT_ENVIRONMENT } from "~/constants/";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { EnvironmentTypes } from "~/types/common";
import { scale } from "~/utils/";

const FiltersPanelContent = (props: FiltersPanelContentProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    onBackPressedCb = () => undefined,
    latitude,
    longitude,
    setValue,
    control,
    hasAllFilters = true,
    orderValue
  } = props;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const {
    containerStyle,
    filtersRowStyle,
    filtersSelectorContainer,
    row,
    radioButtonStyle,
    radioButtonGroup,
    filtersColStyle,
    markerStyle,
    selectedStyle,
    trackStyle
  } = useMemo(() => filtersPanelContentStyles(colors), [colors]);

  const { HotelsServiceArray, HotelsRoomTypesArray, HotelsCategoryTypesArray } =
    CURRENT_ENVIRONMENT === EnvironmentTypes.STAGE
      ? require("~/constants/hotels.stage")
      : CURRENT_ENVIRONMENT === EnvironmentTypes.PRODUCTION
      ? require("~/constants/hotels.production")
      : require("~/constants/hotels.dev");

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const [isHotelsFacilitiesVisible, setIsHotelsFacilitiesVisible] = useState(false);

  const roomTypes = useMemo(() => {
    return HotelsRoomTypesArray?.map(item => ({
      name: t(`hotels.board.${item}`),
      id: item
    }));
  }, [HotelsRoomTypesArray, t]);

  const HotelsCategoryTypesArrayTranslatted = useMemo(
    () => HotelsCategoryTypesArray?.map(item => ({ ...item, name: t(item.key) })),
    [HotelsCategoryTypesArray, t]
  );

  const HotelsServiceArrayTranslatted = useMemo(
    () => HotelsServiceArray?.map(item => ({ ...item, name: t(item.key) })),
    [HotelsServiceArray, t]
  );

  const filteredHotelFacilities = isHotelsFacilitiesVisible
    ? HotelsServiceArrayTranslatted
    : HotelsServiceArrayTranslatted?.slice(0, 15);

  const ratings = [1, 2, 3, 4, 5].map(item => ({ name: `${item}`, id: item }));

  const ORDER_FILTER_VALUES = [
    { label: t("hotels.sort_2"), value: "1" },
    { label: t("hotels.sort_3"), value: "2" },
    { label: t("hotels.sort_4"), value: "3" },
    { label: t("hotels.sort_5"), value: "4" },
    { label: t("hotels.sort_7"), value: "5" },
    { label: t("hotels.sort_8"), value: "6" }
  ];

  const toggleHotelsFacilities = () => {
    setIsHotelsFacilitiesVisible(old => !old);
  };

  const onHotelPressedCb = (hotel: any) => {
    onBackPressedCb();
    setValue("name", hotel?.name);
  };

  const showSearchSheet = () => {
    dispatch(
      showBottomSheet({
        Content: () => (
          <FiltersSearch
            latitude={latitude}
            longitude={longitude}
            onHotelPressedCb={onHotelPressedCb}
            onBackPressedCb={onBackPressedCb}
          />
        ),
        props: {
          modalHeight: APP_SCREEN_HEIGHT * 0.8,
          modalBackgroundColor: colors.background,
          flatListProps: null,
          HeaderComponent: null
        }
      })
    );
  };

  const handleRenderRatings = (item: FilterSelectorType) => (
    <RatingBar disabled size={scale(15)} defaultValue={item.id} ratingCount={5} />
  );

  const handleClearSearch = () => {
    setValue("name", "");
  };

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={containerStyle}>
      {hasAllFilters && (
        <View style={filtersSelectorContainer}>
          <CText fontSize={14} lineHeight={19}>
            {t("hotels.order")}
          </CText>
          <View style={radioButtonGroup}>
            <FormikRadioGroup
              horizontal={false}
              name="order"
              control={control}
              defaultValue={`${orderValue}`}
            >
              {ORDER_FILTER_VALUES.map(item => {
                const getRadioButtonLabel = (isChecked: boolean) => (
                  <CText
                    fontSize={12}
                    lineHeight={17}
                    color={isChecked ? "text" : "gray"}
                  >
                    {item.label}
                  </CText>
                );

                return (
                  <RadioButton
                    containerStyle={radioButtonStyle}
                    color={colors.primary_reversed}
                    uncheckedColor={colors.primary_reversed}
                    key={item.value}
                    value={item.value}
                    label={getRadioButtonLabel}
                  />
                );
              })}
            </FormikRadioGroup>
          </View>
        </View>
      )}
      <View style={filtersSelectorContainer}>
        <CText fontSize={14} lineHeight={19}>
          {t("hotels.hotelName")}
        </CText>
        <FormikTextInput
          control={control}
          name={"name"}
          rightIcon={"close"}
          rightIconColor={colors.primary_reversed}
          rightIconOnPressCb={handleClearSearch}
          selectionColor={colors.primary_reversed}
          activeOutlineColor={colors.primary_reversed}
        />
      </View>
      <CText fontSize={14} lineHeight={19}>
        {t("hotels.type")}
      </CText>
      <View style={filtersRowStyle}>
        <FormikFiltersSelector
          data={HotelsCategoryTypesArrayTranslatted}
          control={control}
          isMultiSelect
          name={"type"}
          accentColor={colors.primary_reversed}
        />
      </View>
      <CText fontSize={14} lineHeight={19}>
        {t("hotels.hotelCategory")}
      </CText>
      <View style={filtersRowStyle}>
        <FormikFiltersSelector
          data={ratings}
          control={control}
          isMultiSelect
          renderItem={handleRenderRatings}
          name={"category"}
          accentColor={colors.primary_reversed}
        />
      </View>
      <CText fontSize={14} lineHeight={19}>
        {t("hotels.board_basis")}
      </CText>
      <View style={filtersRowStyle}>
        <FormikFiltersSelector
          isMultiSelect
          data={roomTypes}
          control={control}
          name={"basis"}
          accentColor={colors.primary_reversed}
        />
      </View>
      <FormikMultiSlider
        containerStyle={filtersColStyle}
        name={"price"}
        control={control}
        topLabel={(value: number[]) =>
          `${t("hotels.price")} (${value[0]}-${value[1]}) ${t("USD")}`
        }
        defaultValue={[1, 5000]}
        trackStyle={trackStyle}
        markerStyle={markerStyle}
        selectedStyle={selectedStyle}
        sliderLength={APP_SCREEN_WIDTH / 1.5}
        markerOffsetY={4}
        min={1}
        max={5000}
      />
      <View style={filtersSelectorContainer}>
        <CText fontSize={14} lineHeight={19}>
          {t("hotels.hotelServices")}
        </CText>
        <View style={row}>
          <FormikFiltersSelector
            data={filteredHotelFacilities}
            control={control}
            isMultiSelect
            name={"hotel_facilities"}
            accentColor={colors.primary_reversed}
          />
        </View>
        <TouchableOpacity onPress={toggleHotelsFacilities}>
          <CText fontSize={12} color={"primary_reversed"}>
            {t(isHotelsFacilitiesVisible ? "less" : "more")}
          </CText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FiltersPanelContent;
