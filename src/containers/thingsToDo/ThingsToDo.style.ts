import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const thingsToDoStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(8)
  },
  itemStyle: {
    paddingHorizontal: scale(8)
  },
  notFoundStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(20),
    marginTop: verticalScale(18)
  },
  loadingStyle: {
    marginTop: "25%",
    height: moderateScale(100),
    width: moderateScale(100),
    alignSelf: "center"
  },
  marginTop: {
    marginTop: verticalScale(15)
  },
  rowStyle: {
    flexDirection: "row",
    marginTop: verticalScale(20)
  },
  whiteLabel: {
    color: "white"
  },
  buttonStyle: {},
  margin: { margin: scale(6), paddingBottom: 10, alignSelf: "center" }
});

export default thingsToDoStyles;
