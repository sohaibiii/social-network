import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";

import facilitiesCardStyle from "./FacilitiesCard.style";
import { FacilitiesCardProps } from "./FacilitiesCard.types";

import { CText } from "~/components/common";
import { scale } from "~/utils/";

const FacilitiesCard = (props: FacilitiesCardProps): JSX.Element => {
  const {
    icon,
    title,
    cardWidth = scale(200),
    onPress = () => undefined,
    style = {},
    circleStyle = {},
    ...restOfProps
  } = props;

  const { colors } = useTheme();

  const { containerStyle, backgroundStyle } = facilitiesCardStyle(colors, cardWidth);

  const containerStyles = [containerStyle, style];
  const backgroundStyles = [backgroundStyle, circleStyle];

  return (
    <TouchableOpacity onPress={onPress} style={containerStyles} {...restOfProps}>
      <View style={backgroundStyles}>{icon}</View>
      <CText textAlign={"center"} fontSize={12}>
        {title}
      </CText>
    </TouchableOpacity>
  );
};
export default memo(FacilitiesCard);
