import { StyleSheet } from "react-native";

import { scale, verticalScale, moderateScale } from "~/utils/";

const styles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    rahhalStyle: {
      position: "absolute",
      width: "100%",
      height: "100%",
      bottom: -moderateScale(10),
      left: -5
    },
    profileImageStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(18)
    },
    rahhalProfileImageStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(18),
      borderWidth: 3,
      borderColor: colors.primary
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 26 },
    nameWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginLeft: 10
    },
    verifiecIconStyle: {
      marginRight: 3
    },
    followIconStyle: {
      marginEnd: scale(4)
    },
    containerStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 10
    },
    iconStyle: {
      marginHorizontal: scale(4),
      color: colors.primary
    },
    selectedIconStyle: {
      marginHorizontal: scale(4),
      color: colors.accent
    },
    verticalPadding: {
      paddingVertical: 4
    }
  });

export default styles;
