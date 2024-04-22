import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import { scale } from "~/utils/";

const postDetailsInputStyle = (height: number) =>
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
    autoCompleteContainerStyle: {
      height: "100%",
      marginHorizontal: scale(10)
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
      height: APP_SCREEN_HEIGHT * 0.9,
      marginHorizontal: 20
    }
  });

export default postDetailsInputStyle;
