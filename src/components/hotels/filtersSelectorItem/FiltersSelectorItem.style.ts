import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type style = {
  itemStyle: ViewStyle;
  containerStyle: ViewStyle;
  titleStyle: TextStyle;
};

const filtersSelectorItemStyle = (
  colors: ReactNativePaper.ThemeColors,
  checked?: boolean,
  accentColor?: string
): style =>
  StyleSheet.create({
    itemStyle: {
      justifyContent: "space-between",
      flexDirection: "row",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: accentColor || colors.primary,
      backgroundColor: checked ? accentColor || colors.primary : colors.surface,
      alignItems: "center",
      paddingVertical: verticalScale(8),
      paddingHorizontal: scale(4)
    },
    containerStyle: {
      marginHorizontal: 5,
      marginTop: verticalScale(8),
      alignItems: "center"
    },
    titleStyle: {
      color: checked ? colors.white : colors.gray
    }
  });

export default filtersSelectorItemStyle;
