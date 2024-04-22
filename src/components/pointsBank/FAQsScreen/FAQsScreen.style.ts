import { StyleSheet, ViewStyle } from "react-native";

type style = {
  root: ViewStyle;
};

const style = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    root: { flex: 1, paddingBottom: 10, backgroundColor: colors.background }
  });

export default style;
