import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  safeAreaViewStyle: ViewStyle;
  backIconStyle: ViewStyle;
  stickyHeaderWrapperStyle: ViewStyle;
  stickyHeaderBackIconStyle: ViewStyle;
  parallaxHeaderWrapperStyle: ViewStyle;
  parallaxHeaderTouchableStyle: ViewStyle;
  overlayWrapperStyle: ViewStyle;
  coverImageStyle: ViewStyle;
  containerStyle: ViewStyle;
  checkboxLabelStyle: TextStyle;
  checkboxStyle: ViewStyle;
  checkboxContainerStyle: ViewStyle;
  clickableTermsStyle: ViewStyle;
  bookingDetailsHeaderText: ViewStyle;
  countdownStyle: ViewStyle;
  whiteLabel: TextStyle;
  offerEndsInStyle: TextStyle;
  continueBtnStyle: ViewStyle;
  flexStyle: ViewStyle;
};

const hotelBookingStyles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number
): style =>
  StyleSheet.create({
    containerStyle: {
      paddingHorizontal: scale(12),
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      marginTop: -verticalScale(12),
      paddingTop: verticalScale(10),
      backgroundColor: theme.colors.background,
      overflow: "hidden"
    },
    checkboxStyle: {
      paddingHorizontal: scale(5)
    },
    checkboxContainerStyle: {
      flexDirection: "row",
      marginVertical: verticalScale(4),
      alignItems: "center"
    },
    clickableTermsStyle: {
      alignItems: "center",
      flexWrap: "wrap",
      flex: 1
    },
    bookingDetailsHeaderText: {
      marginEnd: scale(8)
    },
    checkboxLabelStyle: {
      alignSelf: "center",
      textAlign: "left",
      fontSize: RFValue(13),
      lineHeight: RFValue(15)
    },
    safeAreaViewStyle: {
      flex: 1,
      backgroundColor: "transparent"
    },
    backIconStyle: { position: "absolute", left: 0, top: insets.top, zIndex: 1 },
    stickyHeaderWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    stickyHeaderBackIconStyle: { position: "absolute", left: 0, top: 0 },
    countdownStyle: {
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      top: insets.top,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.white,
      paddingVertical: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.bottomSheetOverlay,
      zIndex: 10,
      right: 10,
      alignSelf: "flex-end"
    },
    whiteLabel: {
      color: theme.colors.white
    },
    parallaxHeaderWrapperStyle: {
      flex: 1,
      width: undefined,
      height: undefined
    },
    parallaxHeaderTouchableStyle: {
      flex: 1,
      width: undefined,
      height: undefined
    },
    overlayWrapperStyle: {
      backgroundColor: "rgba(7,7,7,0.3)",
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 1
    },
    coverImageStyle: {
      height: parallaxHeaderHeight,
      width: APP_SCREEN_WIDTH
    },
    offerEndsInStyle: {
      marginEnd: 5
    },
    continueBtnStyle: {
      backgroundColor: theme.colors.primary_blue,
      marginBottom: insets.bottom,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      minHeight: moderateScale(44),
      width: "100%",
      flexDirection: "row"
    },
    flexStyle: {
      flex: 1
    }
  });

export default hotelBookingStyles;
