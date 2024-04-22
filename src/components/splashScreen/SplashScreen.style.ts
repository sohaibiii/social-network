import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const styles = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    bootSplashContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      position: "relative"
    },
    bootsplashWrapperStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    bootSplashLogoStyle: {
      width: "70%"
    },
    additionalTextStyle: {
      top: 100
    },
    sloganWrapperStyle: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute"
    },
    worldLottieStyle: {
      width: "60%",
      marginBottom: 20
    },
    displayFlex: { display: "flex" },
    forceUpdateWrapperStyles: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    forceUpdateProgressBarStyle: { height: 10, marginBottom: 5 },
    forceUpdateProgressBarWrapperStyle: {
      width: "80%",
      marginVertical: verticalScale(15)
    }
  });

export default styles;
