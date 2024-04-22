import { StyleSheet, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-maps";
import { color } from "react-native-reanimated";

import defaults from "~/constants/defaults";
import { verticalScale } from "~/utils/responsivityUtil";

type HeaderShortcutStyleType = {
  containerStyle: ViewStyle;
  tabWrapperStyle: ViewStyle;
};

const styles = (
  colors: ReactNativePaper.ThemeColors,
  insets: EdgeInsets
): HeaderShortcutStyleType =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: verticalScale(10),
      backgroundColor: colors.primaryBackground,
      position: "absolute",
      top: defaults.TAB_BAR_HEIGHT + insets.top,
      borderTopWidth: 1,
      borderColor: colors.sliderItemBorderColor,
      shadowRadius: 4.0,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4
    },
    tabWrapperStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });

export default styles;
