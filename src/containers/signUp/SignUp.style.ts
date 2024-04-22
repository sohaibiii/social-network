import { StatusBar, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale, scale } from "~/utils/responsivityUtil";
type style = {
  containerStyle: ViewStyle;
  logoStyle: TextStyle;
  headerStyle: TextStyle;
  textInputField: ViewStyle;
  textInputContainerField: ViewStyle;
  firstNameContainerField: ViewStyle;
  lastNameContainerField: ViewStyle;
  orSeparatorStyle: ViewStyle;
  separatorStyle: ViewStyle;
  separatorTextStyle: TextStyle;
  socialLoginLabelStyle: TextStyle;
  signInButton: ViewStyle;
  emailLoginLabelStyle: TextStyle;
  row: ViewStyle;
  namesRow: ViewStyle;
  termsPrefixStyle: TextStyle;
  termsOfUserStyle: TextStyle;
  errorContainerStyle: ViewStyle;
  errorTextStyle: TextStyle;
};
const signUpStyle = (colors: ReactNativePaper.ThemeColors): style =>
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
      fontSize: 16,
      color: colors.primary
    },
    textInputContainerField: {
      alignSelf: "center",
      backgroundColor: colors.background,
      width: "90%"
    },
    firstNameContainerField: {
      backgroundColor: colors.background,
      flex: 1,
      marginEnd: 8,
      alignSelf: "flex-start"
    },
    lastNameContainerField: {
      backgroundColor: colors.background,
      flex: 1,
      marginStart: 8,
      alignSelf: "flex-start"
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
      width: "90%"
    },

    emailLoginLabelStyle: {
      color: colors.white,
      lineHeight: 16,
      fontSize: 14
    },
    row: {
      flexDirection: "row",
      alignSelf: "center"
    },
    namesRow: {
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "space-between",
      width: "90%"
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
    }
  });

export default signUpStyle;
