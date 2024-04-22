import { StyleSheet } from "react-native";

import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  hourDetailsRowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: verticalScale(6),
    marginBottom: verticalScale(6)
  },
  daysStyle: {
    textTransform: "capitalize"
  },
  weekdayRowWrapper: { flex: 2, paddingLeft: moderateScale(50) },
  hoursRowWrapper: { flex: 3, paddingLeft: moderateScale(20) },
  cardWrapperStyle: { paddingHorizontal: 10, flex: 1 },
  hoursSummaryWrapperStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  arrowIconStyle: { paddingLeft: 10 },
  covidHoursParagraph: { marginTop: 10 },
  titleTextStyle: { marginBottom: verticalScale(20) }
});

export default styles;
