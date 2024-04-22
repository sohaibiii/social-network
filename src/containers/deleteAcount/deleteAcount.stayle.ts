import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { scale, verticalScale } from "~/utils/";

type DestinationsStyleType = {
  container: ViewStyle;
  heading: TextStyle;
  buttonStyle: ViewStyle;
  text: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme): DestinationsStyleType =>
  StyleSheet.create({
    container: {
      margin: scale(20)
    },
    heading: {
      fontSize: scale(20),
      fontWeight: "bold",
    },
    buttonStyle: {
      marginTop: verticalScale(20),
      backgroundColor: theme.colors.primary
    },
    text: {
      fontSize: scale(16),
      textAlign: "justify",
      marginBottom: verticalScale(20)
    }
  });

export default styles;