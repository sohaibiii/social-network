import { StyleSheet, ViewStyle, TextStyle } from "react-native";

type ProgressBarType = {
  timeWrapper: ViewStyle;
  timeLeft: TextStyle;
  timeRight: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme): ProgressBarType =>
  StyleSheet.create({
    timeWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15
    },
    timeLeft: {
      color: theme.colors.white
    },
    timeRight: {
      color: theme.colors.white
    }
  });

export default styles;
