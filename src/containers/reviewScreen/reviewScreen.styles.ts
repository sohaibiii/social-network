import { StyleSheet } from "react-native";

const reviewScreenStyle = (colors: ReactNativePaper.ThemeColors, isReviewed?: boolean) =>
  StyleSheet.create({
    root: { paddingVertical: 10 },
    summaryStyle: { padding: 10 },
    buttonContainer: {
      borderRadius: 25,
      backgroundColor: isReviewed ? "rgba(211, 211, 211, 1)" : colors.primary,
      paddingHorizontal: 25,
      paddingVertical: 6
    }
  });

export default reviewScreenStyle;
