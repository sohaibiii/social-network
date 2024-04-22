import { StyleSheet, ViewStyle } from "react-native";

type HashtagStyleType = {
  loaderWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): HashtagStyleType =>
  StyleSheet.create({
    loaderWrapperStyle: { marginTop: 10, justifyContent: "center", alignItems: "center" }
  });

export default styles;
