import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale } from "~/utils/responsivityUtil";

type DestinationStyleType = {
  wrapperStyle: ViewStyle;
  titleTextStyle: TextStyle;
  monthWrapperStyle: ViewStyle;
  monthActiveWrapperStyle: ViewStyle;
  bottomViewWrapperStyle: ViewStyle;
  pagerViewStyles: ViewStyle;
  descriptionWrapperStyle: ViewStyle;
  flex: ViewStyle;
  noMarginStart: ViewStyle;
  noMarginEnd: ViewStyle;
  descriptionStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme, width: number): DestinationStyleType =>
  StyleSheet.create({
    flex: { flex: 1 },
    wrapperStyle: { minHeight: verticalScale(450) },
    titleTextStyle: { marginBottom: verticalScale(8), marginTop: verticalScale(4) },
    monthWrapperStyle: {
      paddingVertical: 4,
      backgroundColor: theme.colors.grayEE,
      marginHorizontal: 1,
      width: width,
      justifyContent: "center",
      alignItems: "center"
    },
    monthActiveWrapperStyle: {
      backgroundColor: theme.colors.primary_blue
    },
    descriptionStyle: {
      lineHeight: RFValue(18)
    },
    bottomViewWrapperStyle: { flex: 1 },
    pagerViewStyles: { flex: 1 },
    descriptionWrapperStyle: { padding: 8 },
    noMarginStart: {
      marginStart: 0
    },
    noMarginEnd: {
      marginEnd: 0
    }
  });

export default styles;
