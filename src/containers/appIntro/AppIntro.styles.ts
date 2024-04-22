import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  safeareaviewStyle: ViewStyle;
  iconStyle: ViewStyle;
  flexGrow: ViewStyle;
  titleStyle: TextStyle;
  paragraphStyle: TextStyle;
  wrapperStyle: ViewStyle;
  activeDotStyle: ViewStyle;
  continueButtonStyle: ViewStyle;
  continueLabelStyle: TextStyle;
  languageItemStyle: ViewStyle;
  flagWrapperStyle: ViewStyle;
  flagIconStyle: ViewStyle;
  selectLanguageWrapperStyle: ViewStyle;
  languageItemSelectedStyle: ViewStyle;
  topWrapperStyle: ViewStyle;
  skipTextStyle: TextStyle;
  fullIconStyle: ViewStyle;
  headerTextWrapperStyle: ViewStyle;
  welcomeTextStyle: TextStyle;
  logoStyle: ViewStyle;
  selectLanguageTextStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    safeareaviewStyle: { flex: 1, backgroundColor: theme.colors.background },
    fullIconStyle: {
      width: "100%",
      height: "100%"
    },
    iconStyle: {
      width: "80%",
      height: "80%",
      marginTop: "10%"
    },
    flexGrow: { flex: 1 },
    titleStyle: {
      marginTop: verticalScale(15),
      marginBottom: verticalScale(25),
      marginHorizontal: scale(20)
    },
    paragraphStyle: {
      marginHorizontal: scale(10)
    },
    wrapperStyle: { flex: 1, alignItems: "center" },
    topWrapperStyle: {
      flex: 1,
      alignItems: "center",
      position: "relative"
    },
    activeDotStyle: { backgroundColor: theme.colors.primary },
    continueLabelStyle: {
      lineHeight: RFValue(23),
      color: theme.colors.white,
      fontSize: RFValue(18)
    },
    continueButtonStyle: {
      textAlign: "center",
      fontFamily: theme.fonts.light.fontFamily,
      paddingHorizontal: scale(24),
      height: verticalScale(45),
      width: "100%",
      alignSelf: "center",
      borderRadius: 10
    },
    languageItemStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.lightGray,
      paddingHorizontal: 10,
      height: verticalScale(45)
    },
    languageItemSelectedStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.primary,
      paddingHorizontal: 10,
      height: verticalScale(45)
    },
    flagWrapperStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    flagIconStyle: {
      width: 30,
      height: 30,
      marginRight: 10
    },
    selectLanguageWrapperStyle: {
      backgroundColor: theme.colors.background,
      width: "100%",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: APP_SCREEN_HEIGHT / 1.5 + 30,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: verticalScale(20),
      paddingHorizontal: verticalScale(20),
      justifyContent: "space-evenly"
    },
    skipTextStyle: { marginTop: verticalScale(40) },
    headerTextWrapperStyle: {
      position: "absolute",
      top: APP_SCREEN_HEIGHT / 6,
      left: APP_SCREEN_WIDTH / 4,
      right: 0
    },
    welcomeTextStyle: { width: 200 },
    logoStyle: { width: 200, height: 100 },
    selectLanguageTextStyle: { marginRight: scale(50), marginBottom: 10 }
  });

export default styles;
