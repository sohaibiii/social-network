import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const backArrowStyle = StyleSheet.create({
  iconContainerStyle: {
    borderRadius: 50,
    zIndex: 10
  },
  iconStyle: {
    position: "absolute",
    top: verticalScale(6)
  }
});

export default backArrowStyle;
