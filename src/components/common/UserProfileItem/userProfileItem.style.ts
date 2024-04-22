import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { ImageStyle } from "react-native-fast-image";

import { scale, verticalScale } from "~/utils/responsivityUtil";

interface style {
  root: ViewStyle;
  usernameStyle: ViewStyle;
  profileImageStyle: StyleProp<ImageStyle>;
  verifiedIconStyle: ViewStyle;
  rahhalStyle: ViewStyle;
  avatarLabelStyle: ViewStyle;
}

const userProfileStyle = (
  colors: ReactNativePaper.ThemeColors,
  width?: number,
  height?: number
): style =>
  StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center"
    },
    profileImageStyle: {
      width: scale(width || 40),
      height: scale(height || 40),
      borderRadius: scale(90)
    },
    avatarLabelStyle: {
      width: scale(width || 40),
      height: scale(height || 40),
      borderRadius: scale(90),
      color: colors.white,
      lineHeight: scale(34)
    },
    usernameStyle: {
      flex: 1,
      color: colors.text,
      marginLeft: scale(5)
    },
    verifiedIconStyle: {
      marginTop: verticalScale(3),
      marginLeft: scale(3)
    },
    rahhalStyle: {
      position: "absolute",
      width: "100%",
      height: "100%",
      bottom: -15
    }
  });

export default userProfileStyle;
