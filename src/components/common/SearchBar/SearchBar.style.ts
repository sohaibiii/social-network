import { StyleSheet, TextStyle, ViewStyle } from "react-native";

type style = {
  container: ViewStyle;
  labelAndIconContainer: ViewStyle;
  labelContainer: ViewStyle;
  labelStyle: TextStyle;
  iconStyle: TextStyle;
};

const searchBarStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    container: {
      backgroundColor: "#eaf8ff",
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary
    },
    labelAndIconContainer: {
      flexDirection: "row",
      flex: 1,
      paddingHorizontal: "10%",
      paddingVertical: 10
    },
    labelContainer: {
      flex: 1,
      marginStart: 10,
      borderBottomWidth: 1,
      borderColor: colors.gray
    },
    labelStyle: {
      color: colors.gray,
      textAlign: "center",
      paddingBottom: 5,
      fontSize: 16,
      fontWeight: "100"
    },
    iconStyle: {
      color: colors.primary
    }
  });

export default searchBarStyle;
