import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

const style = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    safeareviewStyle: { flex: 1, backgroundColor: theme.colors.background },
    userPreferencesRowStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10
    },
    settingsWrapperStyle: {
      backgroundColor: theme.colors.lightBackground,
      paddingLeft: scale(20)
    },
    containerStyle: { padding: 25 },
    saveBtnStyle: {
      marginTop: verticalScale(25),
      marginBottom: verticalScale(10),
      marginRight: scale(20)
    },
    privacySettingsWrapperStyle: {
      backgroundColor: theme.colors.lightBackground,
      marginTop: verticalScale(30),
      paddingHorizontal: scale(20)
    },
    subTitleStyle: { marginBottom: 20, fontSize: RFValue(14) },
    privacyBtnStyle: {
      width: "100%",
      marginBottom: 10,
      backgroundColor: theme.colors.lightBackground,
      borderWidth: 1,
      borderColor: theme.colors.primary
    },
    privacyBtnLabelStyle: {
      color: theme.colors.primary
    },
    whiteLabel: {
      color: "white"
    },
    switchStyle: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
    }
  });
export default style;
