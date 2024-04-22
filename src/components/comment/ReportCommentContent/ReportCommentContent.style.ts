import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/";

const reportCommentContentStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center"
    },
    textInputStyle: {
      alignSelf: "center",
      width: APP_SCREEN_WIDTH * 0.8,
      height: verticalScale(100)
    },
    radioButtonStyle: {
      width: APP_SCREEN_WIDTH * 0.8
    },
    submitButtonStyle: {
      height: verticalScale(40),
      marginVertical: verticalScale(10)
    },
    backArrowStyle: {
      position: "absolute",
      left: 10,
      top: -10
    },
    titleContainerStyle: {
      borderBottomWidth: 1,
      paddingBottom: 8,
      borderColor: colors.lightGray
    },
    submitButtonTextStyle: {
      color: colors.white
    }
  });

export default reportCommentContentStyle;
