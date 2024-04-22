import { StyleSheet } from "react-native";

import color from "color";
import { RFValue } from "react-native-responsive-fontsize";

import { moderateScale } from "~/utils/";

const calendarStyle = (monthHeight: number) =>
  StyleSheet.create({
    containerStyle: {
      height: monthHeight,
      overflow: "hidden"
    },
    monthNameContainerStyle: {
      flexDirection: "row",
      paddingHorizontal: moderateScale(20),
      marginBottom: moderateScale(10)
    },
    monthNameStyle: {
      flex: 1,
      textAlign: "center"
    },
    monthTextStyle: { marginTop: moderateScale(20), marginBottom: moderateScale(10) }
  });

export const monthStyle = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    flex: 1
  }
});

export const dayStyle = (colors: ReactNativePaper.ThemeColors, isThemeDark: boolean) =>
  StyleSheet.create({
    nothingContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: "transparent"
    },
    endContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: colors.primary_reversed
    },
    startingContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: colors.primary_reversed
    },
    startingWithEndContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: colors.primary_reversed
    },
    endingContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: colors.primary_reversed
    },
    betweenContainerStyle: {
      marginTop: 4,
      flex: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: isThemeDark
        ? color(colors.primary_reversed).darken(0.5).rgb().string()
        : color(colors.primary_reversed).alpha(0.2).rgb().string()
    },
    disabledTextStyle: {
      color: color(colors.black).alpha(0.5).rgb().string(),
      textAlign: "center",
      padding: 5,
      fontSize: RFValue(12),
      lineHeight: RFValue(28)
    },
    emptyDay: {
      marginTop: 4,
      flex: 1
    },
    dayTextStyle: {
      textAlign: "center",
      color: colors.black,
      padding: 5,
      fontSize: RFValue(12),
      lineHeight: RFValue(28)
    },
    selectedDayTextStyle: {
      textAlign: "center",
      color: colors.black,
      padding: 5,
      fontSize: RFValue(12),
      lineHeight: RFValue(28)
    },
    startSelectedDayTextStyle: {
      textAlign: "center",
      color: colors.white,
      padding: 5,
      fontSize: RFValue(12),
      lineHeight: RFValue(28)
    },
    endSelectedDayTextStyle: {
      textAlign: "center",
      color: colors.white,
      padding: 5,
      fontSize: RFValue(12),
      lineHeight: RFValue(28)
    }
  });

export default calendarStyle;
