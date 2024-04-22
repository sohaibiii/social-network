import { StyleSheet } from "react-native";

import color from "color";

import { scale, verticalScale } from "~/utils/";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "flex-start",
      paddingTop: 10
    },
    rightWrapperStyle: { flex: 3 },
    iconWrapperStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: scale(30)
    },
    rowWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10
    },
    titleWrapper: { flex: 1 },
    dividerStyle: { backgroundColor: color("#000").alpha(0.15).rgb().string() },
    callTextStyle: { marginBottom: 5 }
  });

export default styles;
