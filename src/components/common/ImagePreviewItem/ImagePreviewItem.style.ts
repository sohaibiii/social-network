import { ImageStyle, StyleSheet, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type style = {
  container: ViewStyle;
  closeOverlayStyle: ViewStyle;
  closeIconStyle: ViewStyle;
  progressiveImageStyle: ImageStyle;
};

const userRowStyles = (colors: ReactNativePaper.ThemeColors, size: number): style =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(12),
      borderWidth: 1,
      marginEnd: scale(16),
      borderColor: colors.gray,
      height: size,
      borderRadius: 10
    },
    closeOverlayStyle: {
      position: "absolute",
      backgroundColor: "rgba(0,0,0,0.53)",
      height: scale(15),
      zIndex: 99,
      width: "100%",
      justifyContent: "center",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    closeIconStyle: {
      paddingHorizontal: scale(2)
    },
    progressiveImageStyle: {
      width: size,
      borderColor: colors.gray,
      height: "100%",
      borderRadius: 10
    }
  });

export default userRowStyles;
