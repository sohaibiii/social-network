import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const style = (theme: ReactNativePaper.Theme, isThemeDark: boolean | undefined): any =>
  StyleSheet.create({
    safeareviewStyle: { flex: 1, backgroundColor: theme.colors.grayBackground },
    headerSectionStyle: {
      fontSize: RFValue(16),
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 10
    },
    arrowIconStyle: { marginHorizontal: 10 },
    settingIconStyle: {
      marginHorizontal: 10
    },
    svgIconStyle: { color: theme.colors.primary_blue, marginHorizontal: 10 },
    settingItemWrapperStyle: {
      backgroundColor: theme.colors.lightBackground,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: isThemeDark ? "#38424C" : "#F1F1F1",
      paddingVertical: 10,
      paddingHorizontal: 5,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    settingItemLeftWrapperStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    appVersionTextStyle: { textAlign: "center", marginVertical: 20 },
    leftWrapperStyle: { height: "100%", flexDirection: "row", alignItems: "center" }
  });
export default style;
