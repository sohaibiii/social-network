import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, scale } from "~/utils/responsivityUtil";

const reviewCardStyle = (colors: ReactNativePaper.ThemeColors, onlyReview: boolean) =>
  StyleSheet.create({
    containerStyle: {
      borderWidth: 1,
      width: onlyReview ? APP_SCREEN_WIDTH - 20 : APP_SCREEN_WIDTH * 0.8,
      borderRadius: 8,
      marginHorizontal: 10,
      borderColor: colors.grayBB,
      paddingEnd: 10,
      flexDirection: "row",
      flexGrow: 0
    },
    imageContainerStyle: { height: "100%" },
    dataContainerStyle: { flex: 1, paddingTop: 4 },
    row: { flexDirection: "row", alignItems: "center" },
    userDetailsContainer: { flexDirection: "row", flex: 1, marginBottom: 10 },
    nameAndDateStyle: { marginStart: 6, flex: 1 },
    nameStyle: { marginBottom: 2 },
    ratingStyle: { justifyContent: "flex-start", marginBottom: 4 },
    dividerStyle: { width: scale(12) },
    footerImageStyle: {
      flex: 1,
      width: moderateScale(90),
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      marginRight: 10
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 28 },
    profileImageStyle: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(40)
    }
  });
export default reviewCardStyle;
