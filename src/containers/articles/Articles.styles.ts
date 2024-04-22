import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { verticalScale, moderateScale } from "~/utils/responsivityUtil";

const style = (theme: ReactNativePaper.Theme): any =>
  StyleSheet.create({
    safeareviewStyle: { flex: 1, backgroundColor: theme.colors.grayBackground },
    containerStyle: { marginHorizontal: 5, marginBottom: 5 },
    badgeStyle: {
      marginLeft: 3,
      backgroundColor: theme.colors.primary_blue,
      paddingHorizontal: moderateScale(10),
      marginTop: 3,
      fontSize: RFValue(11),
      lineHeight: RFValue(14)
    },
    badgeWrapperStyle: {
      flexDirection: "row",
      paddingVertical: 10,
      marginLeft: 10,
      flexWrap: "wrap"
    },
    cardCoverStyle: { height: verticalScale(110) },
    cardStyle: { flex: 1, borderRadius: 10 },
    cardWrapperStyle: { marginHorizontal: 5, flex: 1, marginVertical: 10 },
    skeletonContainerStyle: {
      flexDirection: "row",
      padding: 5,
      marginTop: 5
    },
    rightSkeletonWrapperStyle: {
      flex: 1,
      borderRadius: 10,
      marginTop: 10
    },
    leftSkeletonWrapperStyle: {
      flex: 1,
      marginLeft: 5,
      borderRadius: 10
    },
    applyFilterButtonStyle: {
      textAlign: "center",
      fontFamily: theme.fonts.light.fontFamily,
      fontSize: RFValue(14),
      paddingHorizontal: 24,
      marginTop: 20,
      maxHeight: verticalScale(38),
      width: "50%",
      alignSelf: "center"
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
      fontSize: RFValue(9),
      fontFamily: theme.fonts.thin.fontFamily,
      color: theme.colors.text
    },
    activeCategoryTextStyle: {
      color: theme.colors.white
    },
    activeCategoryWrapperStyle: {
      backgroundColor: theme.colors.primary
    },
    categoriesWrapperStyle: { flexDirection: "row", flexWrap: "wrap" },
    articleTitleStyle: {
      fontSize: RFValue(13),
      fontWeight: "700",
      fontFamily: theme.fonts.regular.fontFamily,
      marginBottom: 5
    },
    articleParagrapghStyle: {
      fontSize: RFValue(12),
      fontFamily: theme.fonts.regular.fontFamily
    },
    resetFilterTextStyle: {
      textDecorationLine: "underline",
      color: theme.colors.primary_blue,
      marginLeft: 10,
      fontSize: RFValue(13)
    }
  });
export default style;
