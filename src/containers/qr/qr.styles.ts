import { StyleSheet } from "react-native";

import { verticalScale, scale } from "~/utils/";

export const qrStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    tabBarLabelStyle: {
      fontFamily: theme.fonts.regular.fontFamily
    },
    tabBarIndicatorStyle: {
      backgroundColor: theme.colors.primary_blue
    },
    tabBarStyle: {
      backgroundColor: theme.colors.primary
    },
    appBarHeader: {
      backgroundColor: theme.colors.surface
    },
    appBarContentStyle: {
      color: theme.colors.text
    },
    flexGrow: {
      flex: 1
    },
    bottomButtonWrapperStyle: {
      justifyContent: "flex-end",
      alignItems: "center",
      marginVertical: verticalScale(20)
    },
    bottomSpacerStyle: {
      marginBottom: verticalScale(20)
    },
    userProfileWrapperStyle: {
      position: "absolute",
      top: -verticalScale(40),
      margin: "auto",
      width: "100%",
      alignItems: "center"
    },
    mainWrapperStyle: {
      backgroundColor: theme.colors.surface,
      marginTop: verticalScale(45),
      width: "80%",
      alignSelf: "center",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "space-around",
      position: "relative",
      paddingVertical: verticalScale(30),
      shadowColor: "gray",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.5,
      shadowRadius: 1,
      elevation: 1
    },
    topWrapperStyle: {
      alignItems: "center",
      justifyContent: "flex-end"
    },
    instructionTextStyle: {
      marginTop: 20,
      paddingHorizontal: 50
    },
    shareButtonStyle: {
      width: "60%"
    },
    usernameStyle: {
      fontSize: 20,
      textAlign: "center"
    },
    centerText: {
      textAlign: "center"
    },
    userProfileStyle: {
      width: scale(70),
      height: scale(70),
      borderRadius: scale(70) / 2
    }
  });
