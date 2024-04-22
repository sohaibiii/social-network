import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

export const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    safeareaStyle: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    secondaryTextStyle: {
      fontSize: RFValue(13),
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: "100"
    },
    primaryTextStyle: {
      fontSize: RFValue(18),
      fontFamily: theme.fonts.thin.fontFamily
    },
    languageIconStyle: { alignSelf: "flex-start", marginVertical: verticalScale(20) },
    contaierView: {
      paddingHorizontal: scale(20)
    },
    languageItemStyle: {
      flexDirection: "row",
      paddingVertical: verticalScale(18),
      borderBottomWidth: 1,
      borderColor: "#d4d7d4",
      flexWrap: "wrap",
      alignItems: "center"
    },
    flagIconStyle: {
      height: verticalScale(15),
      width: verticalScale(15)
    },
    flagWrapperStyle: {
      height: verticalScale(22),
      width: verticalScale(22),
      borderRadius: verticalScale(11),
      backgroundColor: "#d4d7d4",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      alignSelf: "center"
    },
    languagesWrapperStyle: {
      marginTop: verticalScale(20)
    },
    languageCheckboxContainerStyle: {
      flex: 1,
      flexDirection: "row-reverse"
    },
    labelTextStyle: { flex: 1 },
    checkIconStyle: { marginRight: 20 }
  });
