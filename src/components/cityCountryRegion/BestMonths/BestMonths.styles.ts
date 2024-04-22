import { StyleSheet, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

type DestinationStyleType = {
  containerStyle: ViewStyle;
  monthWrapperStyle: ViewStyle;
  monthInfoWrapperStyle: ViewStyle;
  monthInfoInnerWrapperStyle: ViewStyle;
  monthWrapperActiveStyle: ViewStyle;
  monthInfoItemStyle: ViewStyle;
  monthInfoActiveItemStyle: ViewStyle;
  bestTimeWrapperStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): DestinationStyleType =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      marginBottom: 10
    },
    bestTimeWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: verticalScale(10),
      marginHorizontal: scale(8)
    },
    contentContainerStyle: {
      paddingHorizontal: scale(10)
    },
    monthWrapperStyle: {
      width: (APP_SCREEN_WIDTH - scale(16)) / 3.5,
      marginBottom: 10,
      marginRight: 5,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.primary_blue_medium
    },
    monthWrapperActiveStyle: {
      width: scale(80),
      marginBottom: 10,
      marginRight: 5,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.primary_blue
    },
    monthInfoWrapperStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center"
    },
    monthInfoInnerWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10
    },
    monthInfoItemStyle: {
      width: 10,
      height: 10,
      marginRight: 5,
      borderRadius: 10,
      backgroundColor: theme.colors.primary_blue_medium
    },
    monthInfoActiveItemStyle: {
      width: 10,
      height: 10,
      marginRight: 5,
      borderRadius: 50,
      backgroundColor: theme.colors.primary_blue
    }
  });

export default styles;
