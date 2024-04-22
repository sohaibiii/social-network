import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { FULL_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";

type style = {
  container: ViewStyle;
  titleStyle: TextStyle;
  descriptionStyle: TextStyle;
};
const overlayLoaderStyle = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      height: FULL_SCREEN_HEIGHT,
      width: APP_SCREEN_WIDTH,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      zIndex: theme.zIndex.overlay
    },
    titleStyle: {
      fontSize: 20,
      marginTop: 20,
      marginBottom: 8
    },
    descriptionStyle: {
      fontSize: 16
    }
  });

export default overlayLoaderStyle;
