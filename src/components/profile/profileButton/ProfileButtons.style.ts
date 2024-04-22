import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  iconStyle: TextStyle;
  labelStyle: TextStyle;
};

const profileButtonsStyle = (
  colors: ReactNativePaper.ThemeColors,
  highlight: boolean
): style =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      paddingVertical: verticalScale(3),
      alignItems: "center",
      paddingHorizontal: scale(25),
      marginHorizontal: scale(20),
      borderWidth: 2,
      justifyContent: "center",
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderColor: highlight ? colors.accent : colors.white
    },
    iconStyle: {
      marginEnd: 8,
      color: colors.white
    },
    labelStyle: {
      color: colors.white,
      fontSize: RFValue(11),
      lineHeight: verticalScale(13)
    }
  });

export default profileButtonsStyle;
