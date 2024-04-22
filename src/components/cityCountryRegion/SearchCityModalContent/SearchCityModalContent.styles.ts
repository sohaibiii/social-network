import { StatusBar, StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: APP_SCREEN_HEIGHT * 0.6 - StatusBar?.currentHeight,
    paddingHorizontal: scale(8)
  },
  noResultTextStyle: { marginTop: verticalScale(40) }
});

export default styles;
