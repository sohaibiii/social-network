import React from "react";
import { View } from "react-native";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import typesSelectorStyle from "./RoomFiltersContent.style";
import { RoomFiltersContentProps } from "./RoomFiltersContent.types";

import { Button, CText } from "~/components/";
import { FormikFiltersSelectorItem } from "~/components/hotels";

const RoomFiltersContent = (props: RoomFiltersContentProps): JSX.Element => {
  const {
    filterOptions = [],
    onFilter = () => undefined,
    selectedRoomFilters = []
  } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm({ mode: "onSubmit" });

  const { itemStyle, containerStyle, buttonContainerStyle, submitStyle, whiteLabel } =
    typesSelectorStyle(colors);
  const handleClicked = data => {
    const filteredData = Object.keys(data).filter(function (key) {
      return data[key];
    });
    onFilter(filteredData);
  };

  return (
    <View style={containerStyle}>
      <CText>{t("hotels.roomFilters.title")}</CText>
      <View style={itemStyle}>
        {filterOptions.map(item => {
          const isSelected = selectedRoomFilters.includes(item.name);
          return (
            <FormikFiltersSelectorItem
              defaultValue={isSelected}
              control={control}
              name={item.name}
              key={item.name}
              title={t(`hotels.roomFilters.${item.name}`)}
            />
          );
        })}
      </View>
      <View style={buttonContainerStyle}>
        <Button
          style={submitStyle}
          onPress={handleSubmit(handleClicked)}
          labelStyle={whiteLabel}
          title={t("done")}
        />
      </View>
    </View>
  );
};
export default RoomFiltersContent;
