import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale } from "~/utils/";

const viewReceiptsContentStyle = (
  colors: ReactNativePaper.ThemeColors,
  isLoading: boolean
) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      paddingBottom: !isLoading ? verticalScale(20) : 0
    },
    titleContainerStyle: {
      borderBottomWidth: 1,
      paddingBottom: 8,
      borderColor: colors.lightGray
    },
    bodyContainerStyle: {
      alignSelf: "center",
      width: APP_SCREEN_WIDTH * 0.9,
      alignItems: "center",
      paddingTop: 10
    },
    backArrowStyle: {
      position: "absolute",
      left: 10,
      top: -10
    },
    loadingStyle: {
      height: scale(100),
      width: scale(100)
    }
  });

export default viewReceiptsContentStyle;
