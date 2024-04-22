import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

type style = {
  cardStyle: ViewStyle;
  cardRowStyle: ViewStyle;
  nameContainer: ViewStyle;
  imageContainer: ViewStyle;
  topBar: TextStyle;
  bottomBar: TextStyle;
  iconStyle: TextStyle;
  selectedIconStyle: TextStyle;
  userIconStyle: TextStyle;
};

const userRowStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    cardStyle: {
      height: scale(60),
      marginVertical: verticalScale(4),
      backgroundColor: colors.surface,
      paddingHorizontal: scale(8)
    },
    cardRowStyle: {
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    nameContainer: {
      flex: 1,
      marginHorizontal: scale(8)
    },
    topBar: {
      borderRadius: 4,
      height: verticalScale(18)
    },
    bottomBar: {
      borderRadius: 4,
      height: verticalScale(18),
      marginTop: verticalScale(4)
    },
    iconStyle: {
      marginHorizontal: scale(4),
      color: colors.primary
    },
    selectedIconStyle: {
      marginHorizontal: scale(4),
      color: colors.accent
    },
    userIconStyle: {
      color: colors.primary
    },
    imageContainer: {
      width: moderateScale(45),
      height: moderateScale(45),
      borderRadius: 50
    }
  });

export default userRowStyles;
