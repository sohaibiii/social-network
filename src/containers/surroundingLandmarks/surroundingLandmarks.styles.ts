import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const landmarksStyle = StyleSheet.create({
  root: { flex: 1 },
  headerContainer: {
    position: "absolute",
    top: verticalScale(90),
    width: "100%"
  },
  askToSearchStyle: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(15),
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: scale(20),
    alignSelf: "center",
    marginTop: verticalScale(10)
  },
  carouselRoot: { position: "absolute", bottom: moderateScale(40) },
  noResultsStyle: {
    backgroundColor: "red",
    alignSelf: "center",
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10
  }
});
export default landmarksStyle;
