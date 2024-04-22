import { StyleSheet, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import defaults from "~/constants/defaults";

type style = {
  containerDark: ViewStyle;
  containerLight: ViewStyle;
  tabContainer: ViewStyle;
  slider: ViewStyle;
  buttonsContainer: ViewStyle;
  buttonContainer: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  isThemeDark: boolean,
  bottomSafeAreaInset: number
): style =>
  StyleSheet.create({
    containerLight: {
      shadowOpacity: 0.1,
      shadowRadius: 4.0,
      elevation: 10,
      backgroundColor: theme.colors.background,
      height: defaults.TAB_BAR_HEIGHT + bottomSafeAreaInset
    },
    containerDark: {
      shadowOpacity: 0.1,
      shadowRadius: 4.0,
      elevation: 10,
      borderTopWidth: 1,
      borderTopColor: "#2b2b2b",
      backgroundColor: theme.colors.background,
      height: defaults.TAB_BAR_HEIGHT + bottomSafeAreaInset
    },
    tabContainer: {
      height: defaults.TAB_BAR_HEIGHT,
      shadowOffset: {
        width: 0,
        height: -1
      },
      width: APP_SCREEN_WIDTH,
      position: "absolute",
      top: 0
    },
    slider: {
      height: 3,
      position: "absolute",
      top: 0,
      left: 10,
      backgroundColor: isThemeDark ? theme.colors.primary : theme.colors.primary_blue,
      borderRadius: 10
    },
    buttonsContainer: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center"
    },
    buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    }
  });
export default styles;
