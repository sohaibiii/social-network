import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/variables";
import { scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  wheelContainer: ViewStyle;
  spinWheelStyle: ViewStyle;
  spinWheelTextStyle: ViewStyle;
  wheelWinnerContainer: ViewStyle;
  winnerTextStyle: ViewStyle;
  wheelTextStyle: TextStyle;
  wheelWrapperStyle: ViewStyle;
};

const WheelStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    wheelContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative"
    },
    wheelWrapperStyle: {
      transform: [{ scale: 0.8 }],
      alignSelf: "center",
      width: APP_SCREEN_WIDTH,
      height: verticalScale(450)
    },
    spinWheelStyle: {
      position: "absolute",
      top: scale(52),
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center"
    },
    spinWheelTextStyle: {
      padding: scale(15),
      backgroundColor: colors.primary,
      borderRadius: scale(20)
    },
    wheelWinnerContainer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      top: scale(25)
    },
    winnerTextStyle: {
      padding: scale(15),
      backgroundColor: colors.primary,
      borderRadius: scale(20)
    },
    wheelTextStyle: { textAlign: "center" }
  });
export default WheelStyles;
