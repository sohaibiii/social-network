import { StatusBar, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale, scale } from "~/utils/responsivityUtil";
type style = {
  containerStyle: ViewStyle;
  logoStyle: TextStyle;
  headerStyle: TextStyle;
  socialLoginStyle: ViewStyle;
  orSeparatorStyle: ViewStyle;
  separatorStyle: ViewStyle;
  separatorTextStyle: TextStyle;
  socialLoginLabelStyle: TextStyle;
  emailLoginStyle: ViewStyle;
  emailLoginLabelStyle: TextStyle;
  newUserStyle: ViewStyle;
  row: ViewStyle;
  termsPrefixStyle: TextStyle;
  termsOfUserStyle: TextStyle;
};
const preLoginStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      justifyContent: "space-between",
      paddingTop: StatusBar?.currentHeight,
      backgroundColor: colors.background,
      flex: 1
    },
    logoStyle: {
      alignSelf: "center",
      marginVertical: verticalScale(12)
    },
    headerStyle: {
      marginBottom: verticalScale(16),
      textAlign: "center",
      fontSize: RFValue(RFValue(16)),
      color: colors.primary
    },
    socialLoginStyle: {
      alignSelf: "center",
      borderRadius: 50,
      backgroundColor: colors.lightBackground,
      marginVertical: verticalScale(8),
      width: "80%"
    },
    orSeparatorStyle: {
      flexDirection: "row",
      marginVertical: verticalScale(16),
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    separatorStyle: {
      height: 0.5,
      width: "20%",
      backgroundColor: colors.gray
    },
    separatorTextStyle: {
      color: colors.gray,
      fontSize: RFValue(13)
    },
    socialLoginLabelStyle: {
      color: colors.grayReversed,
      fontSize: RFValue(13)
    },
    emailLoginStyle: {
      alignSelf: "center",
      borderRadius: 50,
      backgroundColor: colors.primary,
      marginVertical: verticalScale(8),
      width: "80%"
    },

    emailLoginLabelStyle: {
      color: colors.white,
      fontSize: RFValue(13)
    },
    newUserStyle: {
      marginVertical: verticalScale(8),
      fontSize: RFValue(14),
      color: colors.primary,
      alignSelf: "center"
    },
    row: {
      flexDirection: "row",
      alignSelf: "center"
    },
    termsPrefixStyle: {
      fontSize: RFValue(12),
      marginHorizontal: scale(4),
      color: colors.gray,
      marginBottom: verticalScale(20)
    },
    termsOfUserStyle: {
      marginBottom: verticalScale(4),
      fontSize: RFValue(12),
      color: colors.gray,
      textDecorationLine: "underline"
    }
  });

export default preLoginStyles;
