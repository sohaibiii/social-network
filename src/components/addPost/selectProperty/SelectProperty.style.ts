import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const selectPropertyStyle = (height: number) =>
  StyleSheet.create({
    containerStyle: {
      alignItems: "center",
      padding: 12,
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
      marginHorizontal: 20
    },
    loadingContainer: {
      position: "absolute",
      alignSelf: "center",
      top: verticalScale(100)
    },
    loadingStyle: {
      height: scale(200),
      width: scale(200)
    }
  });

export default selectPropertyStyle;
