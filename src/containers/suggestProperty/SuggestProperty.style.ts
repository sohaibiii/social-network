import { StyleSheet, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/";

type style = {
  viewPagerContainerStyle: ViewStyle;
  mapContainerStyle: ViewStyle;
  recaptchaContainerStyle: ViewStyle;
};
const suggestPropertyStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    viewPagerContainerStyle: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.surface
    },
    mapContainerStyle: {
      height: verticalScale(465),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: "hidden"
    },
    recaptchaContainerStyle: {
      display: "none"
    }
  });

export default suggestPropertyStyle;
