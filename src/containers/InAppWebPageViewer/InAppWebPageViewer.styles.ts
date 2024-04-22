import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { moderateScale, verticalScale } from "~/utils/";

type style = {
  headerContainerStyle: ViewStyle;
  backButtonStyle: ViewStyle;
  androidContainer: ViewStyle;
  iOSContainer: ViewStyle;
  titleStyle: TextStyle;
};

const styles = (colors: ReactNativePaper.ThemeColors, insets: EdgeInsets): style =>
  StyleSheet.create({
    headerContainerStyle: {
      backgroundColor: colors.primary
    },
    androidContainer: {
      flex: 1,
      marginTop: insets.top
    },
    iOSContainer: {
      flex: 1
    },
    titleStyle: {
      marginVertical: verticalScale(12),
      marginHorizontal: moderateScale(40)
    },
    backButtonStyle: {
      position: "absolute",
      top: 4,
      left: 0
    }
  });

export default styles;
