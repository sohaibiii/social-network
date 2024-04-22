import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale } from "~/utils/";

type style = {
  container: ViewStyle;
  nameContainer: ViewStyle;
  imageContainer: ViewStyle;
  buttonContainerStyle: ViewStyle;
  buttonsContainer: ViewStyle;
  buttonStyle: ViewStyle;
  topBar: TextStyle;
  bottomBar: TextStyle;
};

const userRowStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginTop: verticalScale(20),
      paddingBottom: verticalScale(30),
      alignItems: "center",
      justifyContent: "center"
    },
    nameContainer: {
      marginTop: verticalScale(8),
      alignItems: "center"
    },
    topBar: {
      borderRadius: 4,
      width: scale(150),
      height: verticalScale(24)
    },
    buttonContainerStyle: {
      width: APP_SCREEN_WIDTH / 2,
      alignItems: "center"
    },
    buttonStyle: {
      width: scale(135),
      height: verticalScale(30),
      borderRadius: 100
    },
    bottomBar: {
      borderRadius: 4,
      height: verticalScale(18),
      width: scale(100),
      marginTop: verticalScale(4)
    },
    buttonsContainer:{
      flexDirection: "row",
      marginTop: verticalScale(18),
      justifyContent: "center",
      alignItems: "center"
    },
    imageContainer: {
      width: verticalScale(100),
      height: verticalScale(100),
      borderRadius: verticalScale(100)
    }
  });

export default userRowStyles;
