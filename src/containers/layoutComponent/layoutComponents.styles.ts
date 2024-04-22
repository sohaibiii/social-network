import { StyleSheet, ViewStyle } from "react-native";

type style = {
  containerStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    containerStyle: {
      backgroundColor: theme.colors.background
    }
  });

export default styles;
