import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale } from "~/utils/responsivityUtil";

type style = {
  userProfileImageStyle: ViewStyle;
  avatarLabelStyle: TextStyle;
  avatarActiveStyle: ViewStyle;
  avatarStyle: ViewStyle;
};
const FooterStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    userProfileImageStyle: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(28) / 2,
      overflow: "hidden"
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 20 },
    avatarActiveStyle: { backgroundColor: colors.primary_blue },
    avatarStyle: { backgroundColor: colors.gray }
  });

export default FooterStyle;
