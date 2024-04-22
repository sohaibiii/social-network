import { StyleSheet, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  buttonStyle: ViewStyle;
  iconStyle: ViewStyle;
};

const hashtagCardStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: colors.grayBB
    },
    buttonStyle: {
      flex: 1,
      paddingVertical: verticalScale(8)
    },
    iconStyle: {
      backgroundColor: colors.primary,
      borderRadius: 50,
      padding: scale(5),
      marginEnd: scale(5)
    }
  });

export default hashtagCardStyle;
