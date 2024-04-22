import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/responsivityUtil";

type style = {
  sliderItemWrapperStyle: ViewStyle;
  sliderItemTextWrapperStyle: ViewStyle;
  sliderItemWrapperNoFooterStyle: ViewStyle;
  sliderItemTextWrapperNoFooterStyle: ViewStyle;
  sliderItemWrapperSemiFooterStyle: ViewStyle;
  sliderItemTextWrapperSemiFooterStyle: ViewStyle;
  row: ViewStyle;
  subTitleTextStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    sliderItemWrapperStyle: {
      paddingVertical: verticalScale(6),
      borderTopWidth: 1,
      width: APP_SCREEN_WIDTH,
      borderBottomWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor,
      marginBottom: 10,
      backgroundColor: theme.colors.sliderItemBackground
    },
    sliderItemTextWrapperStyle: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      marginBottom: verticalScale(15),
      marginHorizontal: 10
    },
    sliderItemWrapperNoFooterStyle: {
      borderTopWidth: 1,
      width: APP_SCREEN_WIDTH,
      borderBottomWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor
    },
    sliderItemTextWrapperNoFooterStyle: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: verticalScale(15),
      paddingTop: verticalScale(6),
      paddingHorizontal: 10,
      backgroundColor: theme.colors.sliderItemBackground
    },
    sliderItemWrapperSemiFooterStyle: {
      borderTopWidth: 1,
      width: APP_SCREEN_WIDTH,
      paddingVertical: verticalScale(6),
      borderBottomWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor
    },
    sliderItemTextWrapperSemiFooterStyle: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: verticalScale(15),
      paddingTop: verticalScale(6),
      paddingHorizontal: 10,
      backgroundColor: theme.colors.sliderItemBackground
    },
    row: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    subTitleTextStyle: { marginLeft: 10 }
  });

export default styles;
