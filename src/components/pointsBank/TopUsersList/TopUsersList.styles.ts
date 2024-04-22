import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale } from "~/utils/responsivityUtil";

type style = {
  root: ViewStyle;
  serialNumberStyle: TextStyle;
  prizeStyle: ViewStyle;
  pointsContainer: ViewStyle;
  pointsStyle: ViewStyle;
  buttonStyle: ViewStyle;
  buttonLabelStyle: TextStyle;
};

const topUsersStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    root: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomColor: colors.gray,
      borderBottomWidth: scale(0.2),
      padding: 10
    },
    serialNumberStyle: {
      color: colors.text,
      marginRight: 5,
      minWidth: scale(20)
    },
    prizeStyle: { height: scale(35), width: scale(35), marginLeft: scale(5) },
    pointsContainer: {
      flexDirection: "row",
      alignItems: "center"
    },
    pointsStyle: {
      color: colors.text,
      marginEnd: scale(5)
    },
    buttonStyle: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      width: scale(95),
      paddingHorizontal: scale(8),
      borderRadius: scale(15)
    },
    buttonLabelStyle: { marginHorizontal: 5 }
  });
export default topUsersStyle;
