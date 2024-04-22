import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  textContainerStyle: ViewStyle;
  propertyImageStyle: ImageStyle;
  ratingBarStyle: ViewStyle;
  titleTextStyle: TextStyle;
  titleWrapperStyle: ViewStyle;
};

export const propertyMiniCardStyle = (
  selected: boolean,
  colors: ReactNativePaper.ThemeColors,
  type: string
): style =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      borderRadius: 5,
      borderWidth: 1,
      marginVertical: 4,
      backgroundColor:
        type === DestinationsType.REGION
          ? "rgba(189, 195, 199, 0.15)"
          : selected
          ? colors.lightishGray
          : colors.surface,
      borderColor: selected ? colors.primary_blue : colors.lightGray,
      alignItems: "center",
      overflow: "hidden"
    },
    textContainerStyle: {
      flex: 1,
      justifyContent: "space-evenly",
      paddingVertical: verticalScale(6),
      height: verticalScale(64),
      marginStart: scale(5)
    },
    propertyImageStyle: {
      height: verticalScale(64),
      width: scale(80),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      marginRight: moderateScale(5)
    },
    ratingBarStyle: {
      alignSelf: "flex-start"
    },
    titleTextStyle: {
      color: type === DestinationsType.REGION ? colors.black : colors.text
    },
    titleWrapperStyle: {
      flexDirection: "row"
    }
  });
