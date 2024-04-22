import { StatusBar, StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const searchStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(8),
      paddingTop: StatusBar?.currentHeight
    },
    contentContainerStyle: {
      paddingTop: verticalScale(4),
      paddingHorizontal: scale(8)
    },
    flex: {
      flex: 1
    },
    destinationStyle: {
      borderRadius: 10,
      margin: 10,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: colors.grayBB
    },
    iconStyle: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      marginTop: verticalScale(30),
      padding: scale(5),
      marginEnd: scale(5)
    },
    clearTextStyle: {
      position: "absolute",
      right: 14,
      top: 14,
      zIndex: 1
    },
    notFoundStyle: {
      alignItems: "center",
      marginTop: verticalScale(18)
    },
    containerStyle: {
      paddingBottom: verticalScale(8)
    },
    loadingStyle: {
      height: moderateScale(200),
      width: moderateScale(200),
      alignSelf: "center"
    },
    searchContainerStyle: {
      marginEnd: scale(8),
      flex: 1
    },
    rowStyle: { flexDirection: "row", alignItems: "center" },
    buttonsContainer: {
      marginHorizontal: scale(4),
      marginTop: 8
    },
    shadowStyle: {
      height: verticalScale(8),
      zIndex: 1,
      width: "100%",
      position: "absolute",
      bottom: -verticalScale(8)
    }
  });

export const searchScopeStyles = (
  colors: ReactNativePaper.ThemeColors,
  selected: boolean
) =>
  StyleSheet.create({
    containerStyle: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      paddingVertical: 10,
      flexGrow: 1,
      backgroundColor: selected ? colors.primary : colors.white,
      borderWidth: 1,
      borderColor: selected ? colors.primary : colors.grayBB,
      marginHorizontal: scale(4)
    }
  });

export default searchStyles;
