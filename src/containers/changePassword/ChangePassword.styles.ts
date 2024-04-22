import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

export const changePasswordStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    appBarHeader: {
      backgroundColor: colors.surface
    },
    appBarText: {
      color: colors.text
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      flex: 1
    },
    textInputContainerStyle: {
      marginTop: verticalScale(5)
    },
    updateProfileButton: {
      marginTop: verticalScale(12),
      borderRadius: 50
    },
    whiteLabel: {
      color: colors.white
    }
  });
