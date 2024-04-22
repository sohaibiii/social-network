import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";

import typesSelectorStyle from "./FiltersSelectorItem.style";
import { FiltersSelectorItemProps } from "./FiltersSelectorItem.types";

import { CText } from "~/components/";

const FiltersSelectorItem = ({
  title,
  children,
  checked = false,
  onCheckedCb = () => undefined,
  accentColor = ""
}: FiltersSelectorItemProps): JSX.Element => {
  const handleOnPress = () => {
    onCheckedCb(!checked);
  };

  const { colors } = useTheme();

  const { itemStyle, containerStyle, titleStyle } = typesSelectorStyle(
    colors,
    checked,
    accentColor
  );

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={handleOnPress} style={itemStyle}>
        <CText fontSize={12} lineHeight={17} style={titleStyle}>
          {title}
        </CText>
        {children}
      </TouchableOpacity>
    </View>
  );
};
export default FiltersSelectorItem;
