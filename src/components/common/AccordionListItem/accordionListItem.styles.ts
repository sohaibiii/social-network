import { StyleSheet } from "react-native";

import { moderateScale } from "~/utils/responsivityUtil";

export const accordionListItemStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    bodyBackground: {
      backgroundColor: "#EFEFEF",
      overflow: "hidden"
    },
    titleContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 1,
      paddingLeft: 1.5,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#EFEFEF"
    },
    bodyContainer: {
      padding: 1,
      paddingLeft: 10,
      paddingBottom: 10,
      position: "absolute",
      bottom: 0
    },
    cardContainerStyle: {
      backgroundColor: colors.background,
      marginBottom: moderateScale(1),
      borderBottomColor: colors.text,
      borderBottomWidth: 0.4,
      justifyContent: "center"
    },
    headerRowStyle: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10
    },
    iconContainerStyle: { flex: 1, flexDirection: "row", alignItems: "center" },
    iconStyle: { marginRight: moderateScale(10) },
    bodyStyle: { backgroundColor: colors.background, overflow: "hidden" }
  });
