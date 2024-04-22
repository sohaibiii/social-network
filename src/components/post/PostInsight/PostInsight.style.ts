import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const likeCommentShareContainerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8)
  },
  centeredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  viewsContainerStyle: {
    marginStart: scale(40),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  insightTextStyle: {
    marginStart: 4,
    fontWeight: "300"
  }
});

export default likeCommentShareContainerStyles;
