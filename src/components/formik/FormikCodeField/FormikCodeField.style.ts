import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  codeContainerStyle: ViewStyle;
  codeInputStyle: TextStyle;
};
const formikCodeFieldStyle = (
  colors: ReactNativePaper.ThemeColors,
  language?: string
): style =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: language === "ar" ? "row-reverse" : "row",
      alignSelf: "center",
      justifyContent: "space-between",
      width: "80%"
    },
    codeContainerStyle: {
      flex: 1,
      marginHorizontal: scale(4)
    },
    codeInputStyle: {
      textAlign: "center",
      backgroundColor: colors.background
    }
  });

export default formikCodeFieldStyle;
