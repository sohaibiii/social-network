import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const propertySocialActionIntroCardStyle = theme =>
  StyleSheet.create({
    buttonStyle: {
      borderRadius: 20
    },
    imageBackgroundStyle: {
      height: verticalScale(140),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#354A54",
      borderRadius: 20
    },
    imageStyle: {
      borderRadius: 20
    },
    loadingOverlay: {
      position: "absolute",
      backgroundColor: theme.colors.overlay,
      zIndex: 1,
      width: "100%",
      height: "100%",
      justifyContent: "center"
    },
    titleContainerStyle: {
      borderRadius: 50,
      borderColor: "#0F3493",
      backgroundColor: theme.colors.primary_blue,
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(16)
    }
  });

export default propertySocialActionIntroCardStyle;
