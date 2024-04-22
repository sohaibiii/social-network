import { StyleSheet } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const inboxStyles = (colors: ReactNativePaper.ThemeColors, insets: EdgeInsets) =>
  StyleSheet.create({
    listEmptyComponentContainer: {
      width: "100%",
      marginTop: verticalScale(50),
      alignItems: "center"
    },
    flex: {
      flex: 1
    },
    zIndexStyle: {
      zIndex: 20,
      position: "absolute"
    },
    containerStyle: {
      paddingTop: insets.top + verticalScale(8),
      flex: 1,
      backgroundColor: colors.lightBackground
    },
    headerActionsStyle: {
      shadowRadius: 3.0,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      paddingTop: insets.top,
      position: "absolute",
      width: APP_SCREEN_WIDTH,
      zIndex: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.lightBackground
    },
    emailButtonStyle: {
      flexDirection: "row",
      marginStart: moderateScale(10)
    },
    actionButtonStyle: {
      marginEnd: moderateScale(10)
    },
    headerStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
      marginTop: 4
    },
    backButtonStyle: {
      position: "relative",
      zIndex: 10,
      top: 0,
      marginEnd: -moderateScale(44),
      left: 0,
      margin: 0
    },
    searchInputStyle: {
      color: colors.text,
      paddingStart: moderateScale(30),
      paddingEnd: moderateScale(40),
      flex: 1,
      paddingVertical: moderateScale(8),
      borderRadius: 50,
      borderColor: colors.grayBB,
      borderWidth: 1
    },
    filtersButtonStyle: {
      position: "absolute",
      zIndex: 10,
      right: 10,
      margin: 0
    },
    selectAllButtonStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 6,
      marginTop: verticalScale(10)
    },
    inboxContainerStyle: {
      marginStart: 4,
      marginBottom: verticalScale(8),
      flexDirection: "row",
      alignItems: "center"
    },
    inboxTextContainerStyle: {
      marginStart: 8,
      marginTop: 4,
      borderRadius: 10,
      paddingHorizontal: 5,
      justifyContent: "center",
      backgroundColor: colors.lightGray
    },
    inboxTextStyle: {
      padding: 2,
      textTransform: "capitalize"
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    noHorizontalPadding: {
      paddingHorizontal: 0
    },
    headerActionsMargin: {
      margin: moderateScale(12)
    },
    typeFilterContainerStyle: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 10
    },
    radioButtonLabelStyle: {
      textTransform: "capitalize"
    },
    loadingStyle: {
      paddingBottom: verticalScale(40)
    }
  });
export default inboxStyles;
