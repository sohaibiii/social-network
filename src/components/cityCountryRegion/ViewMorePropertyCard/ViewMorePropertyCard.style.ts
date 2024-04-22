import { StyleSheet, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type PropertyCardStyleType = {
  containerStyle: ViewStyle;
  iconStyle: ViewStyle;
  iconWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme, width: number): PropertyCardStyleType =>
  StyleSheet.create({
    containerStyle: {
      width: width,
      marginTop: verticalScale(12),
      overflow: "hidden",
      alignItems: "center",
      marginLeft: 3,
      marginRight: 3
    },
    iconWrapperStyle: {
      alignSelf: "center",
      borderRadius: 50,
      borderWidth: 1,
      marginBottom: verticalScale(8),
      borderColor: theme.colors.primary,
      alignItems: "center"
    },
    iconStyle: {
      margin: 5
    }
  });

export default styles;
