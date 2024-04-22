import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale } from "~/utils/";

const styles = StyleSheet.create({
  iconContainerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  heartIconStyle: { marginRight: scale(8) },
  bellWrapperStyle: { position: "relative" },
  badgeStyle: {
    position: "absolute",
    fontSize: RFValue(9),
    lineHeight: RFValue(12),
    top: -3,
    left: -3
  }
});

export default styles;
