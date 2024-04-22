import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";
type style = {
  textInput: TextStyle;
  helperText: TextStyle;
  textInputContainer: ViewStyle;
  eyeIconStyle: ViewStyle;
  rightIconStyle: ViewStyle;
};

const textInputStyle = (rightIcon: string): style =>
  StyleSheet.create({
    textInput: {
      fontSize: 14
    },
    helperText: {
      lineHeight: 14
    },
    textInputContainer: {
      width: "100%"
    },
    rightIconStyle: {
      display: rightIcon ? "flex" : "none"
    },
    eyeIconStyle: {
      position: "absolute",
      right: 20,
      top: verticalScale(24),
      margin: "auto",
      justifyContent: "center"
    }
  });

export default textInputStyle;
