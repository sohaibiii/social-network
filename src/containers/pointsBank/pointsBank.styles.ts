import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  imageBackgroundStyle: ViewStyle;
  imageContentStyle: ViewStyle;
  currentPointsStyle: ViewStyle;
  pointsContainerStyle: ViewStyle;
  totalPointsStyle: ViewStyle;
  fortuneButtonStyle: ViewStyle;
  buttonStyle: ViewStyle;
  buttonLabelStyle: TextStyle;
  labelStyle: TextStyle;
  indicatorStyle: ViewStyle;
  tabBarStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
  padding: ViewStyle;
  tabBarFooter: ViewStyle;
  selectedTabBarFooter: ViewStyle;
  flex: ViewStyle;
};

const pointsBankStyles = (theme: ReactNativePaper.Theme): style => {
  const { colors, fonts } = theme;

  return StyleSheet.create({
    imageBackgroundStyle: { height: verticalScale(150) },
    imageContentStyle: { flex: 1, alignItems: "center", justifyContent: "center" },
    currentPointsStyle: { backgroundColor: colors.background },
    pointsContainerStyle: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: scale(130),
      marginTop: moderateScale(5),
      paddingTop: moderateScale(5)
    },
    totalPointsStyle: {
      backgroundColor: colors.surface,
      marginTop: 10,
      alignSelf: "center",
      borderRadius: 10,
      padding: 5
    },
    fortuneButtonStyle: {
      position: "absolute",
      bottom: 60,
      right: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      elevation: 8
    },
    buttonStyle: { borderRadius: scale(15) },
    buttonLabelStyle: { fontSize: RFValue(10), color: colors.white },
    labelStyle: {
      color: colors.text,
      textAlign: "center",
      textTransform: "none",
      fontFamily: fonts.regular.fontFamily
    },
    indicatorStyle: { backgroundColor: colors.primary },
    tabBarStyle: { backgroundColor: colors.background },

    contentContainerStyle: { alignItems: "flex-end" },
    padding: { padding: moderateScale(10) },
    tabBarFooter: {
      marginTop: verticalScale(10),
      backgroundColor: colors.lightGray,
      height: 2
    },
    selectedTabBarFooter: {
      marginTop: verticalScale(10),
      backgroundColor: colors.primary,
      height: 2
    },
    flex: {
      flex: 1
    }
  });
};
export default pointsBankStyles;
