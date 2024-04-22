import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const notificationsStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    listEmptyComponentContainer: {
      width: "100%",
      marginTop: verticalScale(50),
      alignItems: "center"
    },
    rowContainer: {
      width: "100%",
      marginBottom: moderateScale(15),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(10)
    },
    badgeStyle: {
      position: "absolute",
      width: scale(24),
      aspectRatio: 1,
      start: scale(38),
      top: scale(30),
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    },
    notificationContent: {
      width: scale(290),
      justifyContent: "space-between",
      flexDirection: "row"
    },
    timeTextStyle: { marginRight: 8 },
    userContainer: { flex: 1, marginLeft: moderateScale(14) },
    usernameStyle: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%"
    },
    userVerifyStyle: {
      marginTop: verticalScale(1.5),
      marginEnd: scale(2)
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 36 }
  });
export default notificationsStyles;
