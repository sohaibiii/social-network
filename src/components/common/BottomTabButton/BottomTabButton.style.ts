import { StyleSheet, TextStyle, ViewStyle } from "react-native";

type style = {
  labelFocused: TextStyle;
  labelUnfocused: TextStyle;
  buttonContainer: ViewStyle;
  container: ViewStyle;
};
const bottomTabButtonStyle = (
  theme: ReactNativePaper.Theme,
  isThemeDark: boolean
): style =>
  StyleSheet.create({
    labelFocused: {
      color: isThemeDark ? theme.colors.primary : theme.colors.primary_blue
    },
    labelUnfocused: {
      color: theme.colors.gray
    },
    buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    container: {
      alignItems: "center",
      justifyContent: "center"
    }
  });

export default bottomTabButtonStyle;
