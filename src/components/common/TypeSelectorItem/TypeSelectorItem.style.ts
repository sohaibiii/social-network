import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type style = {
  itemStyle: ViewStyle;
  containerStyle: ViewStyle;
  imageStyle: ImageStyle;
  titleStyle: TextStyle;
};

const typeSelectorItemStyle = (
  colors: ReactNativePaper.ThemeColors,
  checked?: boolean
): style =>
  StyleSheet.create({
    itemStyle: {
      justifyContent: "space-between",
      flexDirection: "row",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: checked ? colors.primary_blue : colors.lightGray,
      backgroundColor: checked ? colors.lightishGray : colors.surface,
      width: "100%",
      alignItems: "center",
      paddingVertical: verticalScale(8),
      paddingHorizontal: scale(4)
    },
    containerStyle: {
      flex: 1,
      marginHorizontal: 18,
      marginVertical: verticalScale(8),
      alignItems: "center"
    },
    imageStyle: {
      height: 40,
      borderRadius: 10,
      width: 40
    },
    titleStyle: {
      color: checked ? colors.primary_blue : colors.gray
    }
  });

export default typeSelectorItemStyle;
