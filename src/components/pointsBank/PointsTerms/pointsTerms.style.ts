import { StyleSheet, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  root: ViewStyle;
  headerText: ViewStyle;
  pointsStyle: ViewStyle;
  termItemContainer: ViewStyle;
  textStyle: ViewStyle;
  pointsTextStyle: ViewStyle;
  noteStyle: ViewStyle;
};

const style = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    root: { padding: scale(15) },
    headerText: { flexDirection: "row", alignItems: "center" },
    pointsStyle: {
      flexDirection: "row",
      marginStart: scale(5)
    },
    termItemContainer: {
      borderBottomWidth: scale(0.5),
      borderColor: theme.colors.gray,
      paddingBottom: verticalScale(10),
      marginBottom: verticalScale(10)
    },
    textStyle: {
      marginStart: scale(5),
      marginBottom: scale(5),
      color: theme.colors.text
    },
    pointsTextStyle: {
      marginEnd: scale(5),
      color: theme.colors.text
    },
    noteStyle: {
      marginStart: scale(5),
      width: scale(320),
      color: theme.colors.text
    }
  });

export default style;
