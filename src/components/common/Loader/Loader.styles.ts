import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/responsivityUtil";

type style = {
  container: ViewStyle;
  lottieViewStyle: ViewStyle;
  loaderWrapperStyle: ViewStyle;
  lottieWaitTextStyle: TextStyle;
};
const LoaderStyle = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      backgroundColor: "rgba(7,7,7,0.5)",
      width: APP_SCREEN_WIDTH,
      height: APP_SCREEN_HEIGHT - 120,
      zIndex: theme.zIndex.overlay,
      alignSelf: "center",
      justifyContent: "center"
    },
    lottieViewStyle: {
      alignSelf: "center",
      transform: [{ scale: 1.2 }]
    },
    loaderWrapperStyle: {
      width: "100%",
      height: verticalScale(250),
      position: "absolute",
      top: 100
    },
    lottieWaitTextStyle: {
      color: theme.colors.white,
      alignSelf: "center",
      top: 100,
      fontSize: RFValue(22)
    }
  });

export default LoaderStyle;
