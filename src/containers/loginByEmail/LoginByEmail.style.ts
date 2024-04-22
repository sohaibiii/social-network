import { StatusBar, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale, scale } from "~/utils/responsivityUtil";
type style = {
  root: ViewStyle;
  containerStyle: ViewStyle;
  logoStyle: TextStyle;
  headerStyle: TextStyle;
  textInputField: ViewStyle;
  textInputContainerField: ViewStyle;
  orSeparatorStyle: ViewStyle;
  separatorStyle: ViewStyle;
  separatorTextStyle: TextStyle;
  socialLoginLabelStyle: TextStyle;
  signInButton: ViewStyle;
  emailLoginLabelStyle: TextStyle;
  newUserStyle: ViewStyle;
  row: ViewStyle;
  termsPrefixStyle: TextStyle;
  termsOfUserStyle: TextStyle;
  errorContainerStyle: ViewStyle;
  errorTextStyle: TextStyle;
  forgotPasswordContainerStyle: ViewStyle;
  forgotPasswordTextStyle: TextStyle;
  forgotPasswordIconStyle: TextStyle;
};
const loginByEmailStyles = (
  colors: ReactNativePaper.ThemeColors,
  language?: string
): style =>
  StyleSheet.create({
    root: { flex: 1 },
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
      fontSize: 16,
      color: colors.primary
    },
    textInputContainerField: {
      alignSelf: "center",
      backgroundColor: colors.background,
      width: "80%"
    },
    textInputField: {
      backgroundColor: colors.background
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
      fontSize: 13
    },
    socialLoginLabelStyle: {
      color: colors.grayReversed,
      fontSize: 13
    },
    signInButton: {
      alignSelf: "center",
      borderRadius: 50,
      backgroundColor: colors.primary,
      marginTop: verticalScale(32),
      width: "80%"
    },

    emailLoginLabelStyle: {
      color: colors.white,
      lineHeight: 16,
      fontSize: 14
    },
    newUserStyle: {
      marginVertical: verticalScale(8),
      fontSize: 14,
      color: colors.primary,
      alignSelf: "center"
    },
    row: {
      flexDirection: "row",
      alignSelf: "center"
    },
    termsPrefixStyle: {
      fontSize: 10,
      marginHorizontal: scale(4),
      color: colors.gray
    },
    termsOfUserStyle: {
      marginBottom: verticalScale(4),
      fontSize: 10,
      color: colors.gray,
      textDecorationLine: "underline"
    },
    errorContainerStyle: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      backgroundColor: "#f5caca"
    },
    errorTextStyle: {
      fontSize: 16,
      textAlign: "center",
      color: colors.error,
      padding: scale(8)
    },
    forgotPasswordContainerStyle: {
      flexDirection: "row",
      alignSelf: "flex-end",
      marginHorizontal: "10%",
      marginTop: verticalScale(6),
      alignItems: "center"
    },
    forgotPasswordTextStyle: {
      fontSize: 11,
      marginHorizontal: 4,
      color: colors.primary,
      lineHeight: 13
    },
    forgotPasswordIconStyle: {
      transform: [{ scaleX: language === "ar" ? -1 : 1 }]
    }
  });

export default loginByEmailStyles;
