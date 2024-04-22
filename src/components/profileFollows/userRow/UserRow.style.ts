import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  cardStyle: ViewStyle;
  cardRowStyle: ViewStyle;
  nameContainer: ViewStyle;
  nameVerifiedContainer: ViewStyle;
  nameStyle: TextStyle;
  iconStyle: TextStyle;
  selectedIconStyle: TextStyle;
  avatarLabelStyle: TextStyle;
};

const userRowStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    cardStyle: {
      height: scale(60),
      marginVertical: verticalScale(4),
      paddingHorizontal: scale(8),
      flexGrow: 0,
      flexShrink: 0
    },
    cardRowStyle: {
      height: "100%",
      flexDirection: "row",
      alignSelf: "center",
      alignItems: "center"
    },
    nameContainer: {
      flex: 1,
      marginHorizontal: scale(8)
    },
    nameVerifiedContainer: {
      flexDirection: "row",
      alignItems: "center"
    },
    nameStyle: {
      fontSize: RFValue(15),
      lineHeight: RFValue(17)
    },
    iconStyle: {
      marginHorizontal: scale(4),
      color: colors.primary
    },
    selectedIconStyle: {
      marginHorizontal: scale(4),
      color: colors.accent
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 28 }
  });

export default userRowStyles;
