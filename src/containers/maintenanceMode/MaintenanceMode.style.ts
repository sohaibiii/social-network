import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const styles = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center"
    },
    secondaryTextStyle: {
      textAlign: "center",
      fontFamily: theme.fonts.light.fontFamily,
      fontSize: RFValue(12),
      marginHorizontal: 24
    },
    primaryTextStyle: {
      marginVertical: 20,
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.text,
      fontSize: RFValue(13)
    }
  });
export default styles;
