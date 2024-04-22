import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  headerStyle: ViewStyle;
  flex: ViewStyle;
  headerTextStyle: TextStyle;
  whiteLabel: TextStyle;
  currencySelectorContainer: ViewStyle;
  currencySelectorIcon: ViewStyle;
  markerContainerStyle: ViewStyle;
  mapViewStyle: ViewStyle;
  lottieContainerStyle: ViewStyle;
  lottieLoader: ViewStyle;
  hotelCardStyle: ViewStyle;
};

const hotelsMapViewStyles = (
  colors: ReactNativePaper.ThemeColors,
  topInsets?: number
): style =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    headerStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: topInsets,
      paddingBottom: verticalScale(10)
    },
    headerTextStyle: {
      flex: 1,
      marginHorizontal: scale(8)
    },
    currencySelectorContainer: {
      flexDirection: "row",
      marginEnd: scale(8),
      alignItems: "center"
    },
    currencySelectorIcon: {
      alignSelf: "center"
    },
    markerContainerStyle: {
      borderRadius: 20,
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(5)
    },
    mapViewStyle: {
      height: "100%"
    },
    lottieLoader: {
      height: moderateScale(150),
      width: moderateScale(150)
    },
    lottieContainerStyle: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    whiteLabel: {
      color: colors.white
    },
    footerContainerStyle: {
      marginHorizontal: scale(16),
      paddingBottom: verticalScale(6)
    },
    hotelCardStyle: {
      position: "absolute",
      top: -verticalScale(70),
      left: -moderateScale(260) / 2
    }
  });

export default hotelsMapViewStyles;
