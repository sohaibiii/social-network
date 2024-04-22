import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type style = {
  itemStyle: ViewStyle;
  submitStyle: ViewStyle;
  containerStyle: ViewStyle;
  buttonContainerStyle: ViewStyle;
  whiteLabel: TextStyle;
};

const roomFiltersContentStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    itemStyle: {
      flexDirection: "row",
      flexWrap: "wrap"
    },
    submitStyle: {
      marginHorizontal: scale(10)
    },
    containerStyle: {
      marginHorizontal: 5,
      marginTop: verticalScale(8),
      alignItems: "center"
    },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(8)
    },
    whiteLabel: {
      color: colors.white
    }
  });

export default roomFiltersContentStyle;
