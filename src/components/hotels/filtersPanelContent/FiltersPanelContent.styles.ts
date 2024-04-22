import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const filtersPanelContentStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      marginTop: verticalScale(8),
      marginHorizontal: scale(16)
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap"
    },
    namesContainer: {
      marginTop: verticalScale(6),
      flexDirection: "row"
    },
    firstNameContainerStyle: {
      flex: 1,
      marginBottom: verticalScale(6),
      marginEnd: 3
    },
    lastNameContainerStyle: {
      flex: 1,
      marginBottom: verticalScale(6),
      marginStart: 3
    },
    filtersRowStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      borderBottomWidth: 1,
      borderColor: colors.grayBB,
      marginBottom: verticalScale(8),
      paddingBottom: verticalScale(8)
    },
    filtersColStyle: {
      borderBottomWidth: 1,
      borderColor: colors.grayBB,
      alignItems: "center",
      marginBottom: verticalScale(8),
      paddingBottom: verticalScale(8)
    },
    markerStyle: {
      height: scale(20),
      width: scale(20),
      borderRadius: 50,
      backgroundColor: colors.white,
      borderWidth: 0.5,
      borderColor: "grey"
    },
    trackStyle: {
      height: verticalScale(6),
      backgroundColor: "lightgray",
      width: "100%",
      borderRadius: 7
    },
    filtersSelectorContainer: {
      borderBottomWidth: 1,
      borderColor: colors.grayBB,
      marginBottom: verticalScale(8),
      paddingBottom: verticalScale(8)
    },
    selectedStyle: {
      backgroundColor: colors.primary_reversed
    },
    radioButtonGroup: {
      marginTop: verticalScale(8)
    },
    radioButtonStyle: {
      marginBottom: 0
    }
  });

export default filtersPanelContentStyles;
