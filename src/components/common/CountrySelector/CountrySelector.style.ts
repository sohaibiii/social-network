import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

type style = {
  countryItem: ViewStyle;
  countryTitle: TextStyle;
  flagStyle: ImageStyle;
};

const countrySelectorStyle = (
  colors: ReactNativePaper.ThemeColors,
  selected: boolean
): style =>
  StyleSheet.create({
    countryItem: {
      width: "100%",
      backgroundColor: selected ? colors.primary : colors.background,
      paddingVertical: 10,
      paddingHorizontal: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.gray
    },
    countryTitle: {
      color: selected ? colors.white : colors.text
    },
    flagStyle: {
      width: 32,
      height: 32
    }
  });

export default countrySelectorStyle;
