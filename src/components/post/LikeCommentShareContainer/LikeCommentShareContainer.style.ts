import { StyleSheet, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type PostStyleType = {
  container: ViewStyle;
  likeCommentTextStyle: ViewStyle;
  likeCommentContainerStyle: ViewStyle;
  likeCommentButtonContainerStyle: ViewStyle;
  emptyCommentsWrapperStyle: ViewStyle;
};

const likeCommentShareContainerStyles = (
  colors: ReactNativePaper.ThemeColors
): PostStyleType =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(10),
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.borderLightGrayBorder
    },
    likeCommentContainerStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    likeCommentButtonContainerStyle: {
      flexDirection: "row",
      marginEnd: scale(15),
      alignItems: "center"
    },

    likeCommentTextStyle: {
      marginHorizontal: scale(4),
      paddingVertical: verticalScale(4)
    },
    emptyCommentsWrapperStyle: { justifyContent: "center", alignItems: "center" }
  });

export default likeCommentShareContainerStyles;
