import { StatusBar, StyleSheet } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import defaults from "~/constants/defaults";
import { scale } from "~/utils/responsivityUtil";

const styles = (
  colors: ReactNativePaper.ThemeColors,
  language: string,
  insets: EdgeInsets
) =>
  StyleSheet.create({
    safeareaViewStyle: {
      flex: 0,
      height: StatusBar?.currentHeight,
      backgroundColor: colors.primaryBackground
    },
    spacingStyle: {
      height: defaults.TAB_BAR_HEIGHT + insets.top
    },
    mainContainerStyle: {
      position: "absolute",
      backgroundColor: colors.primaryBackground,
      width: "100%",
      elevation: 4,
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        height: 0,
        width: 0
      }
    },
    containerStyle: {
      flexDirection: "row",
      backgroundColor: colors.primaryBackground,
      paddingHorizontal: scale(10),
      paddingBottom: 5,
      paddingTop: 5,
      height: defaults.TAB_BAR_HEIGHT,
      alignItems: "center"
    },
    searchBarStyle: {
      maxWidth: "95%",
      minHeight: "80%",
      maxHeight: "95%",
      alignSelf: "flex-start",
      backgroundColor: colors.searchBarBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: scale(5),
      borderRadius: 6
    },
    searchBarWrapperStyle: {
      alignItems: "flex-end",
      flex: 4,
      justifyContent: "flex-end"
    },
    textStyle: { flex: 1 },
    iconSearchStyle: { marginRight: scale(10), lineHeight: 17 },
    logoWrapperStyle: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center"
    },
    searchWrapperStyle: {
      flex: 1,
      opacity: 0,
      display: "none",
      flexDirection: "row",
      alignItems: "center"
    },
    searchContainerStyle: { flex: 3 },
    safarwayIconLogoStyle: { marginRight: scale(10) },
    searchWrapperNoOpacityStyle: {
      flex: 1,
      opacity: 0,
      flexDirection: "row",
      alignItems: "center"
    }
  });

export default styles;
