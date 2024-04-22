import { StyleSheet } from "react-native";

import { moderateScale, scale } from "~/utils/responsivityUtil";

const mapDirectionsStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1 },
    optionsContainer: {
      flexDirection: "row",
      paddingBottom: moderateScale(24),
      padding: 10,
      backgroundColor: colors.background
    },
    optionStyle: {
      flex: 1,
      marginHorizontal: 2,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: scale(5),
      padding: scale(5),
      backgroundColor: colors.background
    }
  });
export default mapDirectionsStyles;
