import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type style = {
  connectionStatusBarStyle: ViewStyle;
  textStyle: TextStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  isConnected: boolean,
  hasBottomSafeArea: boolean
): style =>
  StyleSheet.create({
    connectionStatusBarStyle: {
      alignItems: "center",
      justifyContent: hasBottomSafeArea ? "flex-start" : "center",
      height: verticalScale(40),
      backgroundColor: isConnected ? theme.colors.green : theme.colors.vantablack
    },
    textStyle: {
      color: theme.colors.white
    }
  });

export default styles;
