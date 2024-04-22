import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/";

type style = {
  sliderWrapperStyle: ViewStyle;
  sliderTitleTextStyle: TextStyle;
  sliderItemTextWrapperStyle: ViewStyle;
  featuresWrapperStyle: ViewStyle;
};

const facilitiesListStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    sliderWrapperStyle: {
      paddingBottom: verticalScale(6)
    },
    sliderTitleTextStyle: { marginBottom: 10, paddingTop: 5 },
    sliderItemTextWrapperStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 10,
      paddingHorizontal: 8
    },
    featuresWrapperStyle: { flexDirection: "row", flexWrap: "wrap" }
  });

export default facilitiesListStyle;
