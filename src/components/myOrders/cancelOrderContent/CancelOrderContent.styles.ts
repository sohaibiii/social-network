import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/";

const cancelOrderContentStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1
    },
    titleContainerStyle: {
      borderBottomWidth: 1,
      paddingBottom: 8,
      borderColor: colors.lightGray
    },
    bodyContainerStyle: {
      alignSelf: "center",
      width: APP_SCREEN_WIDTH * 0.7,
      height: verticalScale(70),
      justifyContent: "center",
      alignItems: "center"
    },
    cancellationChargeStyle: {
      color: colors.danger_red,
      marginTop: 10
    },
    actionButtonsContainerStyle: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 10
    },
    actionButtonStyle: {
      height: verticalScale(30),
      width: verticalScale(100),
      marginBottom: verticalScale(15),
      marginHorizontal: verticalScale(5)
    },
    cancelButtonStyle: {
      backgroundColor: colors.danger_red
    },
    backButtonStyle: {
      backgroundColor: colors.background,
      borderColor: colors.grayBB,
      borderWidth: 1
    },
    actionButtonTextStyle: {
      color: colors.white,
      fontSize: RFValue(12),
      lineHeight: RFValue(14)
    },
    backButtonTextStyle: {
      fontSize: RFValue(12),
      lineHeight: RFValue(14)
    },
    backArrowStyle: {
      position: "absolute",
      left: 10,
      top: -10
    }
  });

export default cancelOrderContentStyle;
