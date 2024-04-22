import { StyleSheet, ViewStyle } from "react-native";

import { moderateScale } from "~/utils/";

type style = {
  flatListContainer: ViewStyle;
  flatListStyle: ViewStyle;
  backgroundStyle: ViewStyle;
};

const countrySelectorContentStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    flatListContainer: { width: "100%", marginTop: 8, padding: moderateScale(5) },
    flatListStyle: {
      height: "80%",
      width: "100%"
    },
    backgroundStyle: {
      backgroundColor: colors.background
    }
  });

export default countrySelectorContentStyle;
