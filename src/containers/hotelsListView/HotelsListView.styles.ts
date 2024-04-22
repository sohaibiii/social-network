import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  headerStyle: ViewStyle;
  flex: ViewStyle;
  contentContainerStyle: ViewStyle;
  iconStyle: ViewStyle;
  iconTextContainer: ViewStyle;
  iconTextWithFlexContainer: ViewStyle;
  filtersContainer: ViewStyle;
  headerTextStyle: TextStyle;
  calendarContentContainerStyle: ViewStyle;
  buttonContainerStyle: ViewStyle;
  flatlistStyle: ViewStyle;
  calendarButtonStyle: ViewStyle;
  calendarContainerStyle: ViewStyle;
  notFoundLottieStyle: ViewStyle;
  whiteLabel: TextStyle;
  settingsSelectorContainer: ViewStyle;
  currencySelectorIcon: ViewStyle;
  footerContainerStyle: ViewStyle;
  loadingTextStyle: TextStyle;
  loadingStyle: ViewStyle;
  loadingContainerStyle: ViewStyle;
  loadingBackgroundStyle: ViewStyle;
  buttonsWrapperStyle: ViewStyle;
  buttonsContainerStyle: ViewStyle;
  filtersTextStyle: TextStyle;
  titleStyle: TextStyle;
  filtersSpacingStyle: ViewStyle;
  progressContainerStyle: ViewStyle;
  greyBackgroundStyle: ViewStyle;
  progressStyle: ViewStyle;
};

const hotelsListViewStyles = (
  colors: ReactNativePaper.ThemeColors,
  insets: EdgeInsets,
  isThemeDark: boolean
): style =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    greyBackgroundStyle: { backgroundColor: colors.grayEE },
    whiteLabel: { color: colors.white },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(8)
    },
    calendarButtonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10)
    },
    calendarContainerStyle: {
      height: APP_SCREEN_HEIGHT * 0.7
    },
    scrollViewStyle: {
      alignSelf: "center",
      marginBottom: verticalScale(10),
      marginHorizontal: scale(16)
    },
    headerStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: insets?.top,
      paddingBottom: verticalScale(10)
    },
    flatlistStyle: {
      backgroundColor: colors.grayEE
    },
    contentContainerStyle: {
      borderRadius: 10,
      backgroundColor: colors.grayEE,
      paddingTop: 8,
      marginTop: 5,
      paddingHorizontal: scale(8),
      paddingBottom: insets.bottom + moderateScale(40)
    },
    calendarContentContainerStyle: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
    },
    iconStyle: {
      marginHorizontal: scale(8)
    },
    headerTextStyle: {
      flex: 1,
      marginHorizontal: scale(8)
    },
    iconTextContainer: {
      backgroundColor: colors.primary_reversed,
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginHorizontal: 2,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    iconTextWithFlexContainer: {
      backgroundColor: colors.primary_reversed,
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginHorizontal: 2,
      flex: 1,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    filtersContainer: {
      flexDirection: "row",
      paddingBottom: 5,
      marginHorizontal: 4
    },
    notFoundLottieStyle: {
      height: scale(200),
      width: "100%",
      alignSelf: "center"
    },
    settingsSelectorContainer: {
      flexDirection: "row",
      marginHorizontal: moderateScale(8),
      alignItems: "center"
    },
    currencySelectorIcon: {
      alignSelf: "center"
    },
    footerContainerStyle: {
      marginHorizontal: scale(16),
      paddingBottom: verticalScale(6)
    },
    loadingStyle: {
      zIndex: 10,
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      width: "100%",
      height: "100%"
    },
    loadingTextStyle: {
      position: "absolute",
      height: moderateScale(36),
      alignSelf: "center",
      width: "100%",
      zIndex: 20,
      top: 8
    },
    loadingContainerStyle: {
      marginHorizontal: 8,
      borderRadius: 4,
      marginVertical: 10,
      overflow: "hidden"
    },
    loadingBackgroundStyle: { height: moderateScale(36), width: "100%", zIndex: 20 },
    filtersTextStyle: { marginStart: 5 },
    progressContainerStyle: {
      position: "absolute",
      width: "100%",
      zIndex: 5,
      height: moderateScale(36)
    },
    progressStyle: {
      height: moderateScale(36)
    },
    buttonsContainerStyle: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: colors.primaryBackground,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.grayEE,
      borderRadius: 50,
      paddingHorizontal: 10
    },
    buttonsWrapperStyle: {
      position: "absolute",
      bottom: insets?.bottom + moderateScale(10),
      width: APP_SCREEN_WIDTH,
      justifyContent: "center",
      shadowOpacity: 0.4,
      shadowRadius: 3,
      shadowColor: "#000",
      shadowOffset: {
        height: 0,
        width: 0
      },
      elevation: 4,
      alignItems: "center",
      flexDirection: "row"
    },
    filtersSpacingStyle: {
      height: moderateScale(36),
      marginHorizontal: 10,
      backgroundColor: colors.borderLightGrayBorder,
      width: 1
    },
    titleStyle: { flex: 1, marginEnd: scale(20) },
    buttonStyle: {
      backgroundColor: colors.primary_blue,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      minHeight: moderateScale(44),
      width: "100%",
      flexDirection: "row",
      marginTop: 10
    }
  });

export default hotelsListViewStyles;
