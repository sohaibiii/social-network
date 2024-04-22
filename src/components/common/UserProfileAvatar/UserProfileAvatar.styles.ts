import { StyleSheet } from "react-native";

import { moderateScale, scale } from "~/utils/responsivityUtil";

const styles = (theme, isRahhal) =>
  StyleSheet.create({
    profileImageStyle: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20),
      borderWidth: isRahhal ? 3 : 0,
      borderColor: theme.colors.primary
    },
    avatarLabelStyle: { color: theme.colors.white, lineHeight: 28 },
    rahhalStyle: {
      position: "absolute",
      top: moderateScale(10),
      width: scale(20),
      height: scale(25),
      bottom: 0,
      left: -5
    }
  });

export default styles;
