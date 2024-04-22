import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const typesSelectorStyle = StyleSheet.create({
  mainContainer: {
    minHeight: verticalScale(500)
  },
  lottieLoaderStyle: {
    alignSelf: "center",
    width: scale(150),
    height: scale(150)
  }
});

export default typesSelectorStyle;
