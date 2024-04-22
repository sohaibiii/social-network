import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import {scale, verticalScale} from "~/utils/";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginTop: APP_SCREEN_HEIGHT / 5
    },
    primaryTextStyle: {
      marginVertical: verticalScale(18),
      fontFamily: theme.fonts.medium.fontFamily,
      color: theme.colors.text
    },
    buttonContainer: { flexDirection: "row", marginHorizontal: scale(18) },
    labelStyle: { color: "white" },
    buttonStyle: { flexGrow: 1, backgroundColor: theme.colors.primary_blue }
  });
export default styles;
