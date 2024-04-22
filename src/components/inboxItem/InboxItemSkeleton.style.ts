import { StyleSheet } from "react-native";

import { scale, verticalScale, moderateScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  nameContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },
  titleStyle: {
    borderRadius: 4,
    marginLeft: 10,
    marginTop: 10,
    width: scale(100),
    height: verticalScale(24),
    alignSelf: "flex-start"
  },
  checkboxStyle: {
    borderRadius: 4,
    marginLeft: 10,
    marginTop: verticalScale(26),
    width: verticalScale(22),
    height: verticalScale(22),
    alignSelf: "flex-start"
  },
  flex: {
    flex: 1
  },
  bottomBar: {
    borderRadius: 4,
    height: verticalScale(18),
    width: "95%",
    marginLeft: 10,
    marginTop: verticalScale(4)
  },
  badgeStyle: {
    lineHeight: 16,
    paddingHorizontal: moderateScale(10),
    width: scale(70),
    height: verticalScale(20),
    borderRadius: 4,
    paddingVertical: 10,
    marginRight: 10,
    marginTop: 10
  }
});

export default styles;
