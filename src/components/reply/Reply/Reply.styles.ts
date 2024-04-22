import { StyleSheet, ImageStyle, ViewStyle, TextStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/variables";
import { scale, verticalScale, moderateScale } from "~/utils/";

type ReplyStyle = {
  userDetailsTextStyle: TextStyle;
  verifiecIconStyle: ViewStyle;
  nameWrapperStyle: ViewStyle;
  likeCommentContainerStyle: ViewStyle;
  likeCommentButtonContainerStyle: ViewStyle;
  likeCommentTextStyle: TextStyle;
  containerStyle: ViewStyle;
  profileImageWrapperStyle: ViewStyle;
  containerWrapperStyle: ViewStyle;
  commentTimeWrapperStyle: ViewStyle;
  actionWrapperStyle: ViewStyle;
  nameMoreWrapperStyle: ViewStyle;
  bottomSpacing: ViewStyle;
  replyWrapperStyle: ViewStyle;
  replyActionWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): ReplyStyle =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(15),
      paddingLeft: 5
    },
    profileImageWrapperStyle: { marginRight: 5 },
    containerWrapperStyle: {
      paddingHorizontal: moderateScale(40) + 5,
      overflow: "hidden",
      paddingTop: 5
    },
    replyWrapperStyle: {
      backgroundColor: theme.colors.followListBorder,
      width: APP_SCREEN_WIDTH * 0.65,
      padding: 10,
      borderRadius: 10
    },
    nameWrapperStyle: { flexDirection: "row", alignItems: "center" },
    verifiecIconStyle: {
      marginRight: 3
    },
    userDetailsTextStyle: {
      fontWeight: "300",
      marginHorizontal: scale(4)
    },
    likeCommentContainerStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    likeCommentButtonContainerStyle: {
      flexDirection: "row",
      marginEnd: scale(15),
      alignItems: "center"
    },

    likeCommentTextStyle: {
      marginLeft: scale(4)
    },
    commentTimeWrapperStyle: {
      alignItems: "flex-end",
      flex: 1
    },
    actionWrapperStyle: {
      flexDirection: "row",
      marginTop: 5,
      width: APP_SCREEN_WIDTH * 0.8,
      flex: 1
    },
    replyActionWrapperStyle: {
      flexDirection: "row",
      marginTop: 5,
      width: APP_SCREEN_WIDTH * 0.65,
      flex: 1
    },
    nameMoreWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    bottomSpacing: {
      paddingBottom: verticalScale(16)
    }
  });

export default styles;
