import { ImageStyle, StyleSheet, ViewStyle } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  textContainerStyle: ViewStyle;
  imageStyle: ImageStyle;
};

export const countryAndRegionCardStyle = (
  selected: boolean,
  colors: ReactNativePaper.ThemeColors
): style =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      borderRadius: 5,
      borderWidth: 1,
      marginVertical: 10,
      backgroundColor: selected ? colors.lightishGray : colors.surface,
      borderColor: selected ? colors.primary_blue : colors.lightGray,
      alignItems: "center"
    },
    textContainerStyle: { marginStart: scale(8) },
    imageStyle: {
      height: verticalScale(60),
      width: scale(80),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      marginRight: moderateScale(5)
    }
  });
