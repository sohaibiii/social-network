import { StyleSheet, StatusBar } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const styles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      paddingHorizontal: scale(8),
      backgroundColor: colors.primaryBackground
    },
    noResultTextStyle: { marginTop: verticalScale(40) },
    searchHeaderWrapperStyle: { paddingHorizontal: scale(8), marginBottom: 10 },
    searchTitleTextStyle: {
      flex: 1
    },
    closeIconStyle: {
      marginRight: scale(8)
    },
    headerWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: verticalScale(4),
      backgroundColor: colors.primaryBackground,
      marginTop: StatusBar?.currentHeight
    }
  });

export default styles;
