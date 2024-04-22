import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type StyleType = {
  containerStyle: ViewStyle;
  mapViewStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): StyleType =>
  StyleSheet.create({
    containerStyle: {
      height: verticalScale(80),
      borderRadius: 10,
      overflow: "hidden",
      marginHorizontal: 20
    },
    mapViewStyle: { width: "100%", height: "100%" }
  });

export default styles;
