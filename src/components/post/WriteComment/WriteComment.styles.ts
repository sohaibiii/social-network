import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { isRTL } from "~/constants/";
import { moderateScale } from "~/utils/";

type WriteCommentType = {
  profileImageWrapperStyle: ViewStyle;
  profileImageStyle: ViewStyle;
  containerStyle: ViewStyle;
  textInputWrapperStyle: ViewStyle;
  sendIconStyle: ViewStyle;
  replyWrapperStyles: ViewStyle;
  closeReplyWrapperStyle: ViewStyle;
  writeCommentWrapperStyle: ViewStyle;
  commentTextInputStyle: ViewStyle;
  replyOnCommentTextStyle: TextStyle;
  originalCommentorWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): WriteCommentType =>
  StyleSheet.create({
    profileImageWrapperStyle: { marginRight: 5 },
    profileImageStyle: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20)
    },
    containerStyle: {
      backgroundColor: theme.colors.sliderItemBackground,

      borderTopWidth: 1,
      borderColor: theme.colors.lightGray
    },
    textInputWrapperStyle: { paddingHorizontal: 5 },
    sendIconStyle: { marginRight: 15 },
    replyWrapperStyles: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5
    },
    closeReplyWrapperStyle: { flex: 1, alignItems: "flex-end" },
    writeCommentWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 5,
      paddingLeft: 10
    },
    commentTextInputStyle: {
      paddingVertical: 0,
      maxHeight: moderateScale(80),
      textAlign: isRTL ? "right" : "left",
      borderRadius: 30,
      paddingHorizontal: 15,
      marginVertical: 5
    },
    replyOnCommentTextStyle: { marginRight: 10, paddingLeft: 10 },
    originalCommentorWrapperStyle: {
      backgroundColor: theme.colors.lightBackground,
      marginVertical: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center"
    }
  });

export default styles;
