import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const myOrdersStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    safeAreaViewStyles: {
      backgroundColor: colors.grayBackground,
      flex: 1
    },
    separatorItemStyle: {
      marginBottom: verticalScale(15)
    },
    flatlistContainerStyle: {
      marginTop: verticalScale(25),
      paddingBottom: verticalScale(40),
      paddingHorizontal: scale(15)
    }
  });

export default myOrdersStyles;
