import React, { FC, memo } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import { useTheme } from "react-native-paper";

import mapCategoriesStyle from "./mapPropertyTypesFilters.styles";
import { MapPropertyTypesFiltersProps } from "./mapPropertyTypesFilters.types";

import { CText } from "~/components/";
import { isRTL } from "~/constants/variables";
import { IMapCategories } from "~/containers/surroundingLandmarks/surroundingLandmarks.types";

const MapPropertyTypesFilters: FC<MapPropertyTypesFiltersProps> = props => {
  const { activeCategory, categories = [], onCategoryPress } = props;
  const { colors } = useTheme();

  const getCategoryName = (title: { ar: string; en: string }) =>
    isRTL ? title.ar : title.en;

  const { root, contentContainerStyle } = mapCategoriesStyle;

  const CategoryItem = ({ item }: { item: IMapCategories }) => {
    const itemStyle = [
      root,
      {
        backgroundColor: item.id === activeCategory ? colors.primary : colors.background
      }
    ];
    const categoryNameColor = item.id === activeCategory ? "white" : "black";

    const handleCategoryPress = () => {
      onCategoryPress && onCategoryPress(item.id);
    };

    return (
      <TouchableOpacity
        onPress={handleCategoryPress}
        activeOpacity={0.8}
        style={itemStyle}
      >
        <CText fontSize={13} fontFamily="light" color={categoryNameColor}>
          {getCategoryName(item.title)}
        </CText>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={contentContainerStyle}
    >
      {categories.length &&
        categories?.map(item => <CategoryItem key={item.id} item={item} />)}
    </ScrollView>
  );
};

export default memo(MapPropertyTypesFilters);
