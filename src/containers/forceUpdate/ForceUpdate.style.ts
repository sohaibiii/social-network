import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale } from "~/utils/";

const style = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      alignItems: "center",
      width: "100%",
      height: "100%",
      justifyContent: "space-between"
    },
    safarwayLogo: { aspectRatio: 3.35, marginTop: verticalScale(40) },
    loadingLottie: {
      flex: 1,
      width: "80%"
    },
    updateTextContainer: {
      paddingTop: 20,
      paddingBottom: 30,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      width: "100%"
    },
    updateTextHeader: {
      textAlign: "center",
      fontFamily: theme.fonts.light.fontFamily,
      marginTop: 20,
      fontSize: RFValue(12),
      marginHorizontal: 24
    },
    updateButton: {
      paddingHorizontal: 10,
      borderRadius: 50
    },
    updateButtonContainer: {
      marginTop: 20
    },
    updateButtonText: {
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.white,
      fontSize: RFValue(12)
    }
  });
export default style;
