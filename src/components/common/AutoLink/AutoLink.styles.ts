import { StyleSheet } from "react-native";

const autoLinkStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    autoLink: {
      textAlign: "left"
    },
    linkStyle: { color: colors.primary }
  });

export default autoLinkStyles;
