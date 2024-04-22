import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale } from "~/utils/";

type style = {
  closeButtonContainerStyle: ViewStyle;
  flex: ViewStyle;
  pagerViewTitleStyle: TextStyle;
};
const pagerViewStepsStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    closeButtonContainerStyle: {
      position: "absolute",
      borderRadius: 50,
      padding: 2,
      alignItems: "center",
      zIndex: 20,
      elevation: 20,
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.2)",
      width: scale(24),
      height: scale(24),
      top: 10,
      left: 15
    },
    flex: {
      flex: 1
    },
    pagerViewTitleStyle: {
      top: -40,
      fontSize: 20,
      color: colors.white,
      marginHorizontal: 20
    }
  });

export default pagerViewStepsStyle;
