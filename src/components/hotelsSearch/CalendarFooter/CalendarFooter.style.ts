import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  buttonContainerStyle: ViewStyle;
  calendarButtonStyle: ViewStyle;
  titleStyle: TextStyle;
  subtitleStyle: TextStyle;
};

const calendarFooterStyles = (
  colors: ReactNativePaper.ThemeColors,
  hasCount: boolean
): style =>
  StyleSheet.create({
    calendarButtonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10),
      borderRadius: 15,
      height: verticalScale(40),
      paddingVertical: !hasCount ? verticalScale(10) : 0,
      backgroundColor: colors.primary_reversed
    },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(6),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(10)
    },
    titleStyle: {
      color: colors.white,
      fontSize: RFValue(12),
      lineHeight: RFValue(19)
    },
    subtitleStyle: {
      color: colors.white,
      fontSize: RFValue(11),
      fontWeight: "300",
      lineHeight: RFValue(13)
    }
  });

export default calendarFooterStyles;
