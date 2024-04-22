import { StyleSheet, TextStyle, ImageStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  cardStyle: ViewStyle;
  row: ViewStyle;
  calendarRow: ViewStyle;
  flex: ViewStyle;
  calendarSeparatorStyle: ViewStyle;
  iconStyle: ViewStyle;
  buttonStyle: ViewStyle;
  disabledButtonStyle: ViewStyle;
  bookingDetailsContainerStyle: ViewStyle;
  rowSpaceBetween: ViewStyle;
  backArrowStyle: ViewStyle;
  backgroundImageStyle: ImageStyle;
  titleTextStyle: TextStyle;
  contentContainerStyle: ViewStyle;
  buttonContainerStyle: ViewStyle;
  scrollViewStyle: ViewStyle;
  calendarButtonStyle: ViewStyle;
  calendarContainerStyle: ViewStyle;
  searchTextStyle: TextStyle;
  whiteLabel: TextStyle;
  dateStyle: TextStyle;
  headerStyle: ViewStyle;
};

const hotelsSearchStyles = (
  colors: ReactNativePaper.ThemeColors,
  isThemeDark: boolean,
  insets: EdgeInsets
): style =>
  StyleSheet.create({
    containerStyle: { justifyContent: "center", marginHorizontal: scale(20), flex: 1 },
    searchTextStyle: { flexShrink: 1, marginEnd: scale(10) },
    cardStyle: {
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      borderRadius: 6,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      height: verticalScale(40),
      shadowOpacity: 0.2,
      shadowRadius: 1.84
    },
    calendarButtonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10)
    },
    calendarContainerStyle: {
      height: APP_SCREEN_HEIGHT * 0.7
    },
    contentContainerStyle: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
    },
    scrollViewStyle: {
      alignSelf: "center",
      marginBottom: verticalScale(10),
      marginHorizontal: scale(16)
    },
    backgroundImageStyle: {
      opacity: isThemeDark ? 0.5 : 1
    },
    titleTextStyle: { marginBottom: verticalScale(20) },
    backArrowStyle: { position: "absolute", zIndex: 10, left: 0 },
    buttonStyle: {
      flexDirection: "row",
      borderRadius: 6,
      backgroundColor: colors.primary_blue,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      minHeight: moderateScale(44)
    },
    disabledButtonStyle: {
      flexDirection: "row",
      borderRadius: 6,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center"
    },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(8)
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    calendarRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    dateStyle: { flexGrow: 0, flexShrink: 1 },
    flex: { flex: 1 },
    calendarSeparatorStyle: {
      position: "absolute",
      left: "50%",
      width: 1,
      height: "80%",
      backgroundColor: colors.gray
    },
    iconStyle: {
      marginHorizontal: scale(10)
    },
    bookingDetailsContainerStyle: {
      backgroundColor: colors.surface,
      marginBottom: 12,
      paddingVertical: 12,
      borderRadius: 6,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      height: verticalScale(40),
      shadowOpacity: 0.2,
      shadowRadius: 1.84,
      flexDirection: "row",
      alignItems: "center"
    },
    whiteLabel: { color: colors.white },
    rowSpaceBetween: { flexDirection: "row", justifyContent: "space-between" },
    headerStyle: { marginTop: insets.top + verticalScale(6), justifyContent: "center" }
  });

export default hotelsSearchStyles;
