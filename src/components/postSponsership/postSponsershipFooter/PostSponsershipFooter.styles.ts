import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale } from "~/utils/";

type PostSponsershipFooterStyle = {
  tagButtonStyle: ViewStyle;
  tagButtonLabelStyle: TextStyle;
  tagButtonWrapperStyle: ViewStyle;
  sponsershipFooterWrapper: ViewStyle;
  footerSectionStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): PostSponsershipFooterStyle =>
  StyleSheet.create({
    tagButtonStyle: { borderColor: theme.colors.text, width: "100%" },
    tagButtonLabelStyle: {
      fontSize: RFValue(11),
      fontWeight: "400",
      lineHeight: RFValue(13),
      textTransform: "capitalize"
    },
    tagButtonWrapperStyle: {
      flex: 2.5,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 5
    },
    sponsershipFooterWrapper: {
      backgroundColor: theme.colors.grayFacebookBg,
      flexDirection: "row",
      width: "100%",
      flexWrap: "wrap",
      height: verticalScale(55),
      paddingHorizontal: 10
    },
    footerSectionStyle: {
      flex: 6,
      justifyContent: "space-evenly"
    }
  });

export default styles;
