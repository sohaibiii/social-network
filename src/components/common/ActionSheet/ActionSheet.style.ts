import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  dividerLine: ViewStyle;
  row: ViewStyle;
  optionsContainer: ViewStyle;
  actionSheetContainer: ViewStyle;
  titleText: TextStyle;
  optionText: TextStyle;
};

const actionSheetStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      backgroundColor: colors.background,
      width: "100%",
      alignItems: "center"
    },
    actionSheetContainer: {
      alignSelf: "flex-start",
      width: "100%"
    },
    optionsContainer: {
      padding: scale(8)
    },
    dividerLine: {
      height: 0.5,
      alignSelf: "stretch",
      width: "100%",
      backgroundColor: colors.gray
    },
    titleText: {
      fontSize: RFValue(12),
      marginVertical: verticalScale(12),
      paddingHorizontal: scale(8)
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    optionText: {
      marginStart: scale(10),
      fontSize: RFValue(14),
      marginBottom: verticalScale(8)
    }
  });

export default actionSheetStyle;
