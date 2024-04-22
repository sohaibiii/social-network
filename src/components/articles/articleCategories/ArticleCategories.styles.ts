import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale, scale, moderateScale } from "~/utils/responsivityUtil";

const style = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    containerStyle: {
      marginHorizontal: moderateScale(20)
    },
    applyFilterButtonStyle: {
      textAlign: "center",
      fontFamily: theme.fonts.light.fontFamily,
      fontSize: RFValue(14),
      paddingHorizontal: scale(24),
      marginVertical: verticalScale(10),
      maxHeight: verticalScale(30),
      width: "40%",
      alignSelf: "center"
    },
    filterBtnLabelStyle: {
      lineHeight: 13,
      color: theme.colors.white
    },
    categoryWrapperStyle: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      margin: 5,
      borderRadius: 3
    },
    categoryTextStyle: {
      fontSize: RFValue(11),
      color: theme.colors.text
    },
    activeCategoryTextStyle: {
      color: theme.colors.white
    },
    activeCategoryWrapperStyle: {
      backgroundColor: theme.colors.primary
    },
    categoriesWrapperStyle: { flexDirection: "row", flexWrap: "wrap" },
    subtitleTextStyle: {
      fontSize: RFValue(12),
      marginBottom: 15
    }
  });
export default style;
