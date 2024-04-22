import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

type style = {
  numberStyle: TextStyle;
  labelStyle: TextStyle;
  containerStyle: ViewStyle;
};

const followsViewStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    numberStyle: {
      color: colors.white,
      fontSize: RFValue(25),
      lineHeight: RFValue(29)
    },
    labelStyle: {
      color: colors.white,
      fontSize: RFValue(14),
      lineHeight: RFValue(14)
    },
    containerStyle: {
      alignItems: "center"
    }
  });

export default followsViewStyle;
