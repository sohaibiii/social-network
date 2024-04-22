import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const confirmContentStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center"
    },
    buttonsContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      marginHorizontal: scale(8)
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10)
    },
    confirmTextStyle: { color: colors.white },
    cancelTextStyle: {
      textAlign: "center",
      textDecorationLine: "underline"
    },
    textContainerStyle: {
      alignItems: "center",
      marginVertical: verticalScale(16)
    },
    backArrowStyle: {
      position: "absolute",
      left: 10,
      top: -10
    },
    descriptionTextStyle: {
      marginTop: 4
    },
    flex: {
      flex: 1
    }
  });

export default confirmContentStyle;
