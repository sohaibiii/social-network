import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/";

const cancellationPolicyContentStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      borderRadius: 20,
      alignItems: "center",
      minHeight: APP_SCREEN_HEIGHT / 3,
      padding: moderateScale(15),
      backgroundColor: colors.background
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      flexWrap: "wrap"
    },
    sectionStyle: {
      marginStart: scale(4),
      marginVertical: verticalScale(8)
    },
    iconStyle: {
      marginEnd: scale(5)
    },
    loadingStyle: {
      height: scale(100),
      width: scale(100)
    }
  });

export default cancellationPolicyContentStyles;
