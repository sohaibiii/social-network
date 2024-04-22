import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { PAGER_STEPS_FOOTER } from "~/constants/";
import { verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  progressBackgroundStyle: ViewStyle;
  progressStyle: ViewStyle;
  backButtonStyle: ViewStyle;
  nextButtonStyle: ViewStyle;
  disabledNextButtonStyle: ViewStyle;
  nextButtonContainerStyle: ViewStyle;
  backButtonTextStyle: TextStyle;
  nextButtonTextStyle: TextStyle;
  buttonsContainerStyle: ViewStyle;
};

const footerStyles = (
  colors: ReactNativePaper.ThemeColors,
  insets: EdgeInsets,
  currentPage: number
): style =>
  StyleSheet.create({
    containerStyle: {
      height: PAGER_STEPS_FOOTER + insets.bottom
    },
    progressBackgroundStyle: {
      height: 2,
      width: "100%",
      position: "absolute",
      backgroundColor: colors.lightGray
    },
    progressStyle: {
      zIndex: 10,
      height: 2,
      backgroundColor: colors.primary_blue
    },
    backButtonStyle: { width: "40%" },
    backButtonTextStyle: { textDecorationLine: "underline" },
    nextButtonStyle: {
      width: 80,
      paddingLeft: 0,
      backgroundColor: colors.primary_blue,
      paddingRight: 0,
      flexGrow: 0,
      alignSelf: "flex-end"
    },
    disabledNextButtonStyle: {
      width: 80,
      paddingLeft: 0,
      backgroundColor: colors.gray,
      paddingRight: 0,
      flexGrow: 0,
      alignSelf: "flex-end"
    },
    nextButtonTextStyle: {
      color: colors.white,
      fontSize: RFValue(12)
    },
    nextButtonContainerStyle: {
      width: "40%",
      marginStart: currentPage > 0 ? 0 : "50%",
      alignItems: "flex-end"
    },
    buttonsContainerStyle: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: colors.lightishGray,
      marginVertical: verticalScale(8),
      alignItems: "center"
    }
  });

export default footerStyles;
