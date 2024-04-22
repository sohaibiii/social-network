import { StyleSheet } from "react-native";

import { scale, verticalScale, moderateScale } from "~/utils/";

const likeCommentShareContainerStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderColor: colors.lightGray,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(8)
    },
    userDetailsContainerStyle: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      maxWidth: "55%"
    },
    userDetailsStyle: { marginStart: 5 },
    likeCommentButtonContainerStyle: {
      flexDirection: "row",
      marginEnd: scale(15),
      alignItems: "center"
    },
    row: {
      flexDirection: "row"
    },
    hoursRowStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5
    },
    userDetailsTextStyle: {
      fontWeight: "300",
      marginHorizontal: scale(4)
    },
    actionsContainerStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    followIconStyle: {
      marginEnd: scale(4)
    },
    followIconContainerStyle: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      padding: scale(4),
      borderRadius: scale(4),
      justifyContent: "center",
      alignItems: "center"
    },
    bottomSpacing: {
      paddingBottom: verticalScale(16)
    },
    bottomSheetButtonTextStyle: {
      color: colors.text
    },
    nameWrapperStyle: { flexDirection: "row", alignItems: "center" },
    verifiecIconStyle: {
      marginRight: 3
    }
  });

export default likeCommentShareContainerStyles;
