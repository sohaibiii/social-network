import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  snackBarStyle: ViewStyle;
  toastStyle: ViewStyle;
  snackbarTextStyle: TextStyle;
  toastTextStyle: TextStyle;
};
const snackbarStyle = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    containerStyle: {
      width: "100%",
      alignSelf: "flex-end",
      bottom: 0,
      position: "absolute",
      elevation: 10,
      zIndex: theme.zIndex.snackbar
    },
    snackBarStyle: {
      bottom: verticalScale(25)
    },
    toastStyle: {
      borderRadius: 50,
      opacity: 0.95,
      width: "90%",
      bottom: verticalScale(25),
      alignSelf: "center"
    },
    toastTextStyle: {
      paddingVertical: 0,
      color: "white",
      textAlign: "center"
    },
    snackbarTextStyle: {
      paddingVertical: 0,
      color: "white"
    }
  });

export default snackbarStyle;
