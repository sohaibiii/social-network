import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale } from "~/utils/";

const styles = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      justifyContent: "space-around"
    },
    row: {
      alignItems: "center",
      justifyContent: "center"
    },
    primaryTextStyle: {
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.primary,
      fontSize: RFValue(45)
    },
    shareButtonStyle: {
      textAlign: "center",
      paddingHorizontal: 24,
      marginTop: 20,
      maxHeight: verticalScale(40)
    },
    shareButtonTextStyle: {
      fontFamily: theme.fonts.light.fontFamily,
      fontSize: RFValue(12),
      color: "white"
    },
    paragraphStyle: {
      fontSize: RFValue(14),
      fontFamily: theme.fonts.light.fontFamily
    }
  });
export default styles;
