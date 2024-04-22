import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

const styles = StyleSheet.create({
  articleScrollViewStyle: { paddingHorizontal: 10 },
  propertyScrollViewStyle: {
    // paddingHorizontal: 4
    paddingHorizontal: 6
  },
  row: { flexDirection: "row" },
  pointsBankBtnStyle: { marginBottom: verticalScale(10) }
});

export default styles;
