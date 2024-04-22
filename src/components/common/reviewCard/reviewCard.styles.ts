import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const reviewCardStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
      // backgroundColor: colors.grayEE,
      borderRadius: 8,
      paddingTop: 4
    },
    root: {
      flexDirection: "row",
      paddingHorizontal: 10
    },
    bottomSpacing: {
      paddingBottom: verticalScale(16)
    },
    textContainerStyle: { flexDirection: "row", marginHorizontal: 4 },
    userImageContainer: { marginRight: 8 },
    voteContainer: { justifyContent: "center", alignItems: "center", marginTop: 10 },
    flexStyle: { flex: 1 },
    headerContainer: { flexDirection: "row" },
    nameStyle: { marginBottom: 2 },
    ratingStyle: { justifyContent: "flex-start", marginBottom: 4 },
    imagesContainer: {
      flexGrow: 1,
      flexDirection: "row",
      marginVertical: 10,
      paddingHorizontal: 10
    },
    footerImageStyle: {
      width: moderateScale(70),
      height: moderateScale(70),
      borderRadius: 8,
      marginRight: 10
    },
    likeContainer: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 10
    },
    bottomActionContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.lightGray,
      padding: 5,
      marginTop: 5
    },
    likeTextStyle: { marginHorizontal: scale(4) },
    avatarLabelStyle: { color: colors.white, lineHeight: 28 }
  });
export default reviewCardStyle;
