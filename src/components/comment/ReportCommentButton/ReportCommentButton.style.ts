import { StyleSheet } from "react-native";

import { scale } from "~/utils/";

const reportCommentButtonStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      borderBottomWidth: 1,
      alignItems: "flex-start",
      borderColor: colors.lightGray,
      width: "100%",
      paddingVertical: 10
    },
    buttonContainerStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: scale(10)
    },
    textContainerStyle: {
      marginStart: 10
    }
  });

export default reportCommentButtonStyle;
