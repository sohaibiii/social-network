import { StyleSheet } from "react-native";

import { moderateScale, verticalScale } from "~/utils/";

const countryAndStateSelectorStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: { width: "100%", marginTop: verticalScale(10) },
    cardStyle: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 5,
      padding: 5,
      borderColor: "#BBBBBB",
      borderWidth: 1
    },
    flagsIconStyle: { height: 30, marginHorizontal: 4, width: 30 },
    countryItemSelected: {
      width: "100%",
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.gray
    },
    countryItemUnselected: {
      width: "100%",
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.gray
    },
    countryTitleSelected: {
      color: colors.white
    },
    countryTitleUnselected: {
      color: colors.text
    },
    flagStyle: {
      width: moderateScale(32),
      height: moderateScale(32)
    }
  });

export default countryAndStateSelectorStyle;
