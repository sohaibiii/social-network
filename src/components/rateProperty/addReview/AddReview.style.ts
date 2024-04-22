import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const addReviewStyle = (height: number) =>
  StyleSheet.create({
    containerStyle: {
      alignItems: "center",
      padding: scale(12),
      justifyContent: "space-between",
      minHeight: height,
      flex: 1
    },
    inputContainerStyle: {
      width: "100%"
    },
    descriptionInputStyle: {
      textAlignVertical: "top",
      marginTop: 10
    },
    contentContainerStyle: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
    },
    scrollViewStyle: {
      alignSelf: "center",
      height: verticalScale(340),
      marginHorizontal: scale(20)
    }
  });

export default addReviewStyle;
