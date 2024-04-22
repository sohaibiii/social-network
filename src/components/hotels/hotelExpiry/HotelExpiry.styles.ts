import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

const styles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    topWrapperStyle: {
      backgroundColor: "#d6e5eb",
      alignItems: "center",
      justifyContent: "center",
      height: verticalScale(160),
      borderRadius: 6
    },
    dialogStyles: { borderRadius: 6 },
    sandTimeIconStyle: { height: "70%", width: "100%" },
    textStyles: { textAlign: "center" },
    homeButtonStyle: {
      borderColor: colors.primary_reversed,
      borderWidth: 2,
      marginBottom: 10
    },
    homeButtonLabelStyle: { color: colors.primary_reversed },
    dialogActionsWrapperStyle: { alignItems: "center", justifyContent: "center" }
  });

export default styles;
