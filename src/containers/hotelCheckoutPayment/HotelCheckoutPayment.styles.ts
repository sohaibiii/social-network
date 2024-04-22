import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";
import { Styles } from "react-native-svg";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH, PLATFORM } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  safeAreaViewStyle: ViewStyle;
  backIconStyle: ViewStyle;
  stickyHeaderWrapperStyle: ViewStyle;
  stickyHeaderBackIconStyle: ViewStyle;
  parallaxHeaderWrapperStyle: ViewStyle;
  parallaxHeaderTouchableStyle: ViewStyle;
  coverImageStyle: ViewStyle;
  containerStyle: ViewStyle;
  submitButtonStyle: ViewStyle;
  whiteLabel: TextStyle;
  titleTextStyle: TextStyle;
  stripeFormStyle: ViewStyle;
  payBtnStyle: ViewStyle;
};

const hotelCheckoutPaymentStyles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number
): style =>
  StyleSheet.create({
    containerStyle: {
      height: "100%",
      minHeight: APP_SCREEN_HEIGHT / 2,
      paddingHorizontal: scale(12),
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingTop: verticalScale(10),
      marginTop: -verticalScale(12),
      backgroundColor: theme.colors.surface,
      overflow: "hidden"
    },
    titleTextStyle: {
      marginBottom: verticalScale(8)
    },
    stripeFormStyle: {
      minHeight: moderateScale(50),
      marginBottom: 10
    },
    submitButtonStyle: {
      marginTop: verticalScale(8)
    },
    safeAreaViewStyle: {
      flex: 1,
      marginBottom: insets.bottom,
      backgroundColor: "transparent"
    },
    backIconStyle: { position: "absolute", left: 0, top: insets.top, zIndex: 1 },
    stickyHeaderWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    stickyHeaderBackIconStyle: { position: "absolute", left: 0, top: 0 },
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
    coverImageStyle: {
      height: parallaxHeaderHeight,
      width: APP_SCREEN_WIDTH
    },
    whiteLabel: {
      color: theme.colors.white
    },
    payBtnStyle: {
      backgroundColor: theme.colors.primary_blue,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      minHeight: moderateScale(44),
      width: "100%",
      flexDirection: "row"
    }
  });

export default hotelCheckoutPaymentStyles;
