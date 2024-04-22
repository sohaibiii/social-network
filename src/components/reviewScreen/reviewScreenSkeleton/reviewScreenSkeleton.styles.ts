import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const reviewScreenSkeletonStyle = StyleSheet.create({
  root: { flexDirection: "row", padding: 10 },
  imageStyle: { height: 40, width: 40, marginRight: 10, borderRadius: 50 },
  flexStyle: { flex: 1 },
  headerContainer: { flexDirection: "row", width: "100%" },
  titleStyle: { width: 150, height: 15, marginBottom: 5, borderRadius: 10 },
  starsStyle: { width: 50, height: 15, borderRadius: 10, alignSelf: "flex-end" },
  reviewStyle1: { width: 120, height: 15, borderRadius: 10 },
  reviewStyle2: {
    width: "100%",
    height: verticalScale(120),
    marginTop: 10,
    borderRadius: 10
  }
});

export default reviewScreenSkeletonStyle;
