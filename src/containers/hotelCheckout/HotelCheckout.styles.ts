import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale, moderateScale } from "~/utils/responsivityUtil";

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
  nameStyle: ViewStyle;
  overlayWrapperStyle: ViewStyle;
  whiteLabel: TextStyle;
  flexStyle: ViewStyle;
};

const hotelCheckoutStyles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number
): style =>
  StyleSheet.create({
    containerStyle: {
      height: "100%",
      paddingHorizontal: scale(12),
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingTop: verticalScale(10),
      marginTop: -verticalScale(12),
      backgroundColor: theme.colors.background,
      overflow: "hidden"
    },
    submitButtonStyle: {
      marginTop: verticalScale(8),
      backgroundColor: theme.colors.primary_blue,
      marginBottom: insets.bottom,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      minHeight: moderateScale(44),
      width: "100%",
      flexDirection: "row"
    },
    nameStyle: {
      marginBottom: verticalScale(6)
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
    overlayWrapperStyle: {
      backgroundColor: "rgba(7,7,7,0.3)",
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 1
    },
    flexStyle: { flex: 1 }
  });

export default hotelCheckoutStyles;
