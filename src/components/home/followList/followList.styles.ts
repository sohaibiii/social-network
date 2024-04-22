import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_WIDTH } from "~/constants/variables";
import { moderateScale, scale } from "~/utils/responsivityUtil";

type style = {
  root: ViewStyle;
  itemRoot: ViewStyle;
  itemContainer: ViewStyle;
  userNameStyle: ViewStyle;
  verifiedIconStyle: ViewStyle;
  buttonsContainer: ViewStyle;
  buttonLabelStyle: TextStyle;
  followButtonStyle: ViewStyle;
  chatButtonStyle: ViewStyle;
  buttonIconStyle: ViewStyle;
  userInfoStyle: ViewStyle;
  userImageStyle: ViewStyle;
  avatarTextStyle: TextStyle;
};

const influencersStyles = (colors: ReactNativePaper.ThemeColors): style => {
  return StyleSheet.create({
    root: { paddingHorizontal: scale(3) },
    itemRoot: {
      margin: 5,
      borderWidth: 1,
      borderColor: colors.followListBorder,
      borderRadius: 8,
      overflow: "hidden",
      width: APP_SCREEN_WIDTH / 2.5 - 10
    },
    itemContainer: {
      backgroundColor: colors.followListBackground,
      alignItems: "center",
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.followListBorder,
      paddingTop: 10,
      paddingBottom: 7,
      flex: 1
    },
    userNameStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
    verifiedIconStyle: { top: 2 },
    buttonsContainer: {
      flexDirection: "row",
      // justifyContent: "space-around",
      paddingHorizontal: 4,
      paddingVertical: 5
    },
    buttonLabelStyle: {
      color: colors.white,
      marginHorizontal: 0,
      fontSize: RFValue(11)
    },
    followButtonStyle: {
      flex: 1,
      minWidth: scale(60),
      backgroundColor: colors.primary,
      borderRadius: 6,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(4)
    },
    chatButtonStyle: {
      flex: 1,
      minWidth: scale(60),
      backgroundColor: colors.primary,
      borderRadius: 6,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(4),
      marginLeft: 4
    },
    buttonIconStyle: {
      marginRight: 5
      // transform: [{ translateX: 5 }]
    },
    userInfoStyle: { justifyContent: "center", alignItems: "center", flex: 1 },
    userImageStyle: { width: 100, height: 100, borderRadius: 50 },
    avatarTextStyle: { color: "white" }
  });
};
export default influencersStyles;
