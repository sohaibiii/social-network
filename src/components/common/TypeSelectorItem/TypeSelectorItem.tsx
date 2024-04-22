import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { Text, useTheme } from "react-native-paper";

import typesSelectorStyle from "./TypeSelectorItem.style";
import { PropertyTypeItemProps } from "./TypeSelectorItem.types";

import IMAGES from "~/assets/images";

const TypeSelectorItem = ({
  item,
  title,
  initialValue = false,
  onCheckedCb = () => undefined
}: PropertyTypeItemProps): JSX.Element => {
  const [checked, setChecked] = useState(initialValue);

  const handleOnPress = () => {
    onCheckedCb(!checked, item);
    setChecked(isChecked => !isChecked);
  };

  const { colors } = useTheme();

  const { itemStyle, containerStyle, imageStyle, titleStyle } = typesSelectorStyle(
    colors,
    checked
  );

  return (
    <View key={item.id} style={containerStyle}>
      <TouchableOpacity onPress={handleOnPress} style={itemStyle}>
        <Text style={titleStyle}>{title}</Text>
        {/*<Image source={IMAGES.rahhal_person} style={imageStyle} />*/}
      </TouchableOpacity>
    </View>
  );
};
export default TypeSelectorItem;
