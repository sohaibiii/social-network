import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

const confirmationModalStyles = (
  colors: ReactNativePaper.ThemeColors,
  confirmColor?: string
) =>
  StyleSheet.create({
    containerStyle: {
      borderRadius: scale(8),
      backgroundColor: colors.surface
    },
    headerContainerStyle: {
      borderBottomColor: colors.lightGray,
      alignItems: "center",
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingVertical: verticalScale(15)
    },
    closeButtonStyle: {
      zIndex: 1,
      left: 10
    },
    headerTextStyle: {
      fontWeight: "500",
      position: "absolute",
      left: 0,
      right: 0
    },
    descriptionContainerStyle: {
      paddingHorizontal: scale(8),
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(6)
    },
    descriptionTextStyle: {
      paddingHorizontal: scale(8),
      fontWeight: "300"
    },

    actionsContainerStyle: {
      flexDirection: "row",
      padding: scale(8),
      marginBottom: verticalScale(6),
      alignItems: "center",
      justifyContent: "center"
    },
    saveButtonContainerStyle: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center"
    },
    saveButtonTextStyle: {
      color: "white",
      lineHeight: RFValue(14),
      fontSize: RFValue(12)
    },
    saveButtonStyle: {
      paddingHorizontal: 0,
      backgroundColor: confirmColor ? confirmColor : colors.primary_blue,
      borderRadius: scale(8)
    },
    exitButtonContainerStyle: {
      flex: 1
    },
    exitButtonTextStyle: {
      textAlign: "center",
      textDecorationLine: "underline",
      lineHeight: RFValue(16),
      fontSize: RFValue(12)
    }
  });

export default confirmationModalStyles;
