import { StyleSheet, ViewStyle } from "react-native";

type PostDetailsStyle = {
  emptyCommentsWrapperStyle: ViewStyle;
  containerStyle: ViewStyle;
  keyboardAvoidingViewStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): PostDetailsStyle =>
  StyleSheet.create({
    containerStyle: { flex: 1, backgroundColor: theme.colors.sliderItemBackground },
    emptyCommentsWrapperStyle: { justifyContent: "center", alignItems: "center" },
    keyboardAvoidingViewStyle: { flex: 1 },
    contentContainerStyle: { paddingBottom: 10 }
  });

export default styles;
