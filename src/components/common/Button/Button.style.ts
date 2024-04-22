import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  label: TextStyle;
  subtitleStyle: TextStyle;
  loaderStyle: ViewStyle;
  textWrapperStyle: ViewStyle;
  iconStyle: ViewStyle;
  RNPButtonStyle: ViewStyle;
  RNPButtonDisabledStyle: ViewStyle;
};

const buttonStyle = (
  colors: ReactNativePaper.ThemeColors,
  iconLeft?: number,
  hasSubtitle?: boolean
): style =>
  StyleSheet.create({
    label: {
      fontSize: RFValue(14),
      lineHeight: RFValue(16),
      textAlign: "center"
    },
    subtitleStyle: {
      fontSize: RFValue(12),
      lineHeight: RFValue(14),
      textAlign: "center"
    },
    iconStyle: {
      position: "absolute",
      left: iconLeft || 0
    },
    loaderStyle: {
      marginHorizontal: scale(8)
    },
    textWrapperStyle: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: hasSubtitle ? "column" : "row"
    },
    RNPButtonStyle: {
      borderWidth: 1,
      shadowColor: colors.black,
      paddingHorizontal: scale(18),
      backgroundColor: colors.primary,
      paddingVertical: verticalScale(8)
    },
    RNPButtonDisabledStyle: {
      backgroundColor: "rgba(211, 211, 211, 1)"
    }
  });

export default buttonStyle;
