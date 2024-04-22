import { StyleSheet, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

type ParallaxHeaderScrollViewTypes = {
  parallaxHeaderStyle: ViewStyle;
  containerStyle: ViewStyle;
  stickyHeaderWrapperStyle: ViewStyle;
  stickyHeaderStyles: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  parallaxHeaderHeight: number,
  insets: EdgeInsets,
  HEADER_HEIGHT: number
): ParallaxHeaderScrollViewTypes =>
  StyleSheet.create({
    parallaxHeaderStyle: {
      backgroundColor: "transparent",
      overflow: "hidden",
      maxHeight: 450,
      height: parallaxHeaderHeight
    },
    containerStyle: {
      backgroundColor: theme.colors.lightGrayBackground,
      flex: 1
    },
    stickyHeaderWrapperStyle: { marginTop: insets.top, flex: 1 },
    stickyHeaderStyles: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: theme.colors.primary,
      height: HEADER_HEIGHT
    }
  });

export default styles;
