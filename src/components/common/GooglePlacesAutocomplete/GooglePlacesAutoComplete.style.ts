import { StyleSheet } from "react-native";

import { moderateScale, verticalScale } from "~/utils/";

const googlePlacesAutocompleteStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    googlePlacesRowContainer: {
      flexDirection: "row",
      marginVertical: 4,
      alignItems: "center",
      justifyContent: "center"
    },
    googlePlacesRowIconStyle: {
      marginEnd: 12,
      borderRadius: 100,
      padding: 10,
      backgroundColor: colors.lightGray
    },
    currentLocationButtonStyle: {
      alignItems: "center",
      flexDirection: "row",
      margin: 10,
      zIndex: 30
    },
    clearButtonStyle: {
      position: "absolute",
      top: 12,
      zIndex: 20,
      right: 8
    },
    emptyContainerStyle: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center"
    },
    topMargin: {
      marginTop: verticalScale(20)
    },
    centerStyle: {
      alignItems: "center"
    }
  });

const googlePlacesStyles = (
  colors: ReactNativePaper.ThemeColors,
  fonts: ReactNativePaper.ThemeFonts
) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    textInputContainer: {
      width: "100%",
      zIndex: 20,
      marginBottom: verticalScale(12),
      color: colors.text
    },
    topMargin: {
      marginTop: verticalScale(20)
    },
    centerStyle: {
      position: "absolute",
      backgroundColor: colors.background,
      width: "100%",
      zIndex: 10,
      height: "100%",
      alignItems: "center",
      paddingTop: moderateScale(30)
    },
    emptyContainerStyle: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginTop: verticalScale(12)
    },
    initialTextContainerStyle: {
      alignItems: "center",
      paddingHorizontal: moderateScale(30),
      position: "absolute",
      height: moderateScale(300),
      backgroundColor: colors.background,
      width: "100%",
      zIndex: 50
    },
    textInput: {
      borderWidth: 1,
      width: "100%",
      borderColor: "#c1c1c1",
      color: colors.text,
      fontFamily: fonts.light.fontFamily,
      paddingEnd: moderateScale(34),
      paddingVertical: 8,
      borderRadius: 50,
      paddingStart: 10,
      textAlign: "right"
    },
    description: {
      color: colors.text,
      fontFamily: fonts.light.fontFamily
    },
    predefinedPlacesDescription: {
      color: "#1faadb"
    },
    row: {
      paddingVertical: 10,
      backgroundColor: colors.background
    },
    googlePlacesRowContainer: {
      flexDirection: "row",
      marginVertical: 4,
      alignItems: "center",
      justifyContent: "center"
    },
    googlePlacesRowIconStyle: {
      marginEnd: 12,
      borderRadius: 100,
      padding: 10,
      backgroundColor: colors.lightGray
    }
  });

export { googlePlacesAutocompleteStyle, googlePlacesStyles };
