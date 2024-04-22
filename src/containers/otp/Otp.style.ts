import { StatusBar, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale, scale } from "~/utils/responsivityUtil";
type style = {
  containerStyle: ViewStyle;
  logoStyle: TextStyle;
  headerStyle: TextStyle;
  textInputField: ViewStyle;
  textInputContainerField: ViewStyle;
  resetPasswordButton: ViewStyle;
  resetPasswordLabel: TextStyle;
  row: ViewStyle;
  termsPrefixStyle: TextStyle;
  termsOfUserStyle: TextStyle;
  codeSentContainerStyle: ViewStyle;
  codeSentTextStyle: TextStyle;
  noCodeSentTextStyle: TextStyle;
  errorContainerStyle: ViewStyle;
  errorTextStyle: TextStyle;
  resendCodeTextStyle: TextStyle;
  countdownLabelStyle: TextStyle;
};
const forgotPasswordStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      justifyContent: "space-between",
      paddingTop: StatusBar?.currentHeight,
      backgroundColor: colors.background,
      flex: 1
    },
    codeInputField: {
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
    resetPasswordButton: {
      alignSelf: "center",
      borderRadius: 50,
      backgroundColor: colors.primary,
      marginTop: verticalScale(32),
      width: "80%"
    },
    resetPasswordLabel: {
      color: colors.white,
      lineHeight: 16,
      fontSize: 14
    },
    row: {
      flexDirection: "row",
      alignSelf: "center",
      alignItems: "center"
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
    codeSentContainerStyle: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      marginVertical: verticalScale(4),
      padding: scale(14),
      backgroundColor: colors.surface
    },
    codeSentTextStyle: {
      textAlign: "center",
      color: colors.gray,
      marginBottom: verticalScale(4),
      padding: scale(4)
    },
    noCodeSentTextStyle: {
      textAlign: "center",
      color: colors.gray,
      fontSize: 14
    },
    errorContainerStyle: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      backgroundColor: colors.error
    },
    errorTextStyle: {
      fontSize: 16,
      textAlign: "center",
      color: colors.white,
      padding: scale(8)
    },
    resendCodeTextStyle: {
      textAlign: "center",
      color: colors.primary,
      fontSize: 14
    },
    countdownLabelStyle: {
      textAlign: "center",
      color: colors.primary,
      fontSize: 14
    }
  });

export default forgotPasswordStyle;
