import { StyleSheet, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type style = {
  sliderItemWrapperStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    sliderItemWrapperStyle: {
      height: verticalScale(70),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor,
      marginBottom: 10,
      backgroundColor: theme.colors.sliderItemBackground
    }
  });

export default styles;
