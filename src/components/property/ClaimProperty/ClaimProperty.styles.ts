import { StyleSheet } from "react-native";

const styles = (theme: ReactNativePaper.Theme, isThemeDark: boolean) =>
  StyleSheet.create({
    buttonStyle: {
      backgroundColor: isThemeDark ? theme.colors.primary_blue : theme.colors.white,
      borderRadius: 50,
      borderColor: theme.colors.primary_blue
    },
    buttonLabelStyle: {
      color: isThemeDark ? theme.colors.white : theme.colors.primary_blue,
      fontFamily: theme.fonts.thin.fontFamily
    },
    buttonWrapperStyle: {
      flexDirection: "row",
      marginTop: 10,
      justifyContent: "space-between",
      paddingRight: 10
    },
    containerStyle: {
      backgroundColor: isThemeDark ? theme.colors.grayEE : "rgb(241,247,254)",
      paddingVertical: 10,
      paddingHorizontal: 10
    }
  });

export default styles;
