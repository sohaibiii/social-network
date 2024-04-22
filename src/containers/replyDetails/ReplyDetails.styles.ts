import { StyleSheet, ViewStyle } from "react-native";

import { moderateScale } from "~/utils/";

type ReplyDetailsStyle = {
  emptyCommentsWrapperStyle: ViewStyle;
  containerStyle: ViewStyle;
  profileImageWrapperStyle: ViewStyle;
  rahhalStyle: ViewStyle;
  profileImageStyle: ViewStyle;
  rahhalProfileImageStyle: ViewStyle;
  flexGrow: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): ReplyDetailsStyle =>
  StyleSheet.create({
    containerStyle: { flex: 1 },
    emptyCommentsWrapperStyle: { justifyContent: "center", alignItems: "center" },
    profileImageWrapperStyle: { marginRight: 5 },
    rahhalStyle: {
      position: "absolute",
      width: "100%",
      height: "100%",
      bottom: -20,
      left: 3
    },
    profileImageStyle: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20)
    },
    rahhalProfileImageStyle: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20),
      borderWidth: 3,
      borderColor: theme.colors.primary
    },
    flexGrow: { flex: 1 }
  });

export default styles;
