import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale, moderateScale } from "~/utils/responsivityUtil";

type style = {
  row: ViewStyle;
  defaultContainerStyle: ViewStyle;
  seenContainerStyle: ViewStyle;
  selectedContainerStyle: ViewStyle;
  darkSelectedContainerStyle: ViewStyle;
  userContainerStyle: ViewStyle;
  contentStyle: ViewStyle;
  checkBoxStyle: ViewStyle;
  titleStyle: TextStyle;
};

const style = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    row: {
      flexDirection: "row"
    },
    defaultContainerStyle: {
      width: "100%",
      paddingVertical: verticalScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingEnd: moderateScale(16),
      paddingStart: moderateScale(4),
      backgroundColor: colors.primaryBackground
    },
    selectedContainerStyle: {
      width: "100%",
      paddingVertical: verticalScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingEnd: moderateScale(16),
      paddingStart: moderateScale(4),
      backgroundColor: colors.primary_blue_medium
    },
    darkSelectedContainerStyle: {
      width: "100%",
      paddingVertical: verticalScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingEnd: moderateScale(16),
      paddingStart: moderateScale(4),
      backgroundColor: colors.surface
    },
    seenContainerStyle: {
      width: "100%",
      paddingVertical: verticalScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingEnd: moderateScale(16),
      paddingStart: moderateScale(4),
      backgroundColor: colors.grayBackground
    },
    userContainerStyle: {
      flex: 1,
      marginStart: 4
    },
    checkBoxStyle: { paddingHorizontal: 0, paddingVertical: 0 },
    titleStyle: {
      flex: 1,
      marginEnd: moderateScale(12),
      marginStart: moderateScale(4),
      marginBottom: verticalScale(6)
    },
    contentStyle: {
      justifyContent: "space-between",
      flexDirection: "row"
    }
  });

export default style;
