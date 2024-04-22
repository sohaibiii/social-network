import { StyleSheet, ViewStyle } from "react-native";

import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  containerStyle: ViewStyle;
  flatListContainer: ViewStyle;
  flatListStyle: ViewStyle;
  backgroundStyle: ViewStyle;
};

const listSelectorStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: { width: "100%", marginTop: verticalScale(10) },
    flatListContainer: {
      flexGrow: 1,
      padding: moderateScale(10)
    },
    flatListStyle: {
      height: "80%",
      width: "100%"
    },
    backgroundStyle: {
      backgroundColor: colors.background,
      padding: moderateScale(5)
    }
  });

export default listSelectorStyle;
