import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import {moderateScale} from "~/utils/";

const styles = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1
    },
    paragraphSecondStyle: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(13)
    },
    shareButtonStyle: {
      textAlign: "center",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(14),
      paddingHorizontal: 24,
      marginTop: 20
    },
    titleStyle: {
      fontSize: RFValue(20),
      fontFamily: theme.fonts.regular.fontFamily,
      marginBottom: 20
    },
    paragraphStyle: {
      fontSize: RFValue(13)
    },
    conditionWrapperStyle: { justifyContent: "flex-end", marginTop: 50 },
    wrapperStyle: { paddingVertical: 50, paddingHorizontal: 25 },
    aboutRahhalWrapperStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%"
    },
    titleWrapperStyle: {
      flex: 3
    },
    verificationImageStyle: { width: moderateScale(120), height: moderateScale(140) },
    badgeStyle: {
      marginLeft: 10,
      paddingHorizontal: 10,
      backgroundColor: "#ffc107",
      lineHeight: 25
    },
    verifyStatusWrapperStyle: { flexDirection: "row", alignItems: "center" },
    imageContainerStyle: { width: 115, height: 115 }
  });
export default styles;
