import { StyleSheet, ViewStyle } from "react-native";

type style = {
  sliderItemWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    sliderItemWrapperStyle: {
      borderTopWidth: 1,
      borderRadius: 8,
      overflow: "hidden",
      borderBottomWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor,
      backgroundColor: theme.colors.sliderItemBackground
    }
  });

export default styles;
