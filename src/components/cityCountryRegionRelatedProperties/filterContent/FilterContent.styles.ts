import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { verticalScale, scale, moderateScale } from "~/utils/responsivityUtil";

const style = StyleSheet.create({
  containerStyle: {
    marginHorizontal: moderateScale(10)
  },
  applyFilterButtonStyle: (theme: ReactNativePaper.Theme, insets: EdgeInsets) => ({
    textAlign: "center",
    fontFamily: theme.fonts.light.fontFamily,
    fontSize: RFValue(14),
    paddingHorizontal: scale(24),
    marginTop: verticalScale(10),
    maxHeight: verticalScale(30),
    width: "40%",
    alignSelf: "center",
    marginBottom: verticalScale(20) + insets.bottom
  }),
  filterBtnLabelStyle: (theme: ReactNativePaper.Theme) => ({
    lineHeight: 13,
    color: theme.colors.white
  }),
  categoryWrapperStyle: (theme: ReactNativePaper.Theme) => ({
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    margin: 5,
    borderRadius: 3
  }),
  categoryTextStyle: (theme: ReactNativePaper.Theme) => ({
    fontSize: RFValue(12),
    color: theme.colors.text,
    fontWeight: "300"
  }),
  labelTextStyle: (theme: ReactNativePaper.Theme) => ({
    fontSize: RFValue(12),
    color: theme.colors.text,
    fontWeight: "300"
  }),
  activeCategoryTextStyle: (theme: ReactNativePaper.Theme) => ({
    color: theme.colors.white
  }),
  activeCategoryWrapperStyle: (theme: ReactNativePaper.Theme) => ({
    backgroundColor: theme.colors.primary
  }),
  categoriesWrapperStyle: { flexDirection: "row", flexWrap: "wrap" },
  subtitleTextStyle: {
    fontSize: RFValue(13),
    marginBottom: verticalScale(12),
    marginTop: 10
  }
});
export default style;
