import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { ImageStyle } from "react-native-fast-image";

import { scale, verticalScale, moderateScale } from "~/utils/responsivityUtil";

type style = {
  cardContainer: ViewStyle;
  cardImage: ImageStyle;
  overLapContainer: ViewStyle;
  overLapText: ViewStyle;
  itemTextContainer: ViewStyle;
  customFlatListContainer: ViewStyle;
  itemText: TextStyle;
};

const style = (theme: ReactNativePaper.Theme): style =>
  StyleSheet.create({
    cardContainer: {
      width: scale(160),
      margin: moderateScale(8),
      height: verticalScale(130),
      borderRadius: moderateScale(5),
      // iOS
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(2),
      shadowOffset: {
        height: 0,
        width: 0
      },
      // Android
      elevation: 2,
      backgroundColor: theme.colors.lightBackground
    },
    cardImage: {
      borderTopLeftRadius: moderateScale(5),
      borderTopRightRadius: moderateScale(5),
      height: verticalScale(90),
      width: "100%"
    },
    overLapContainer: {
      flexDirection: "row",
      position: "absolute",
      alignItems: "center",
      justifyContent: "space-between",
      height: verticalScale(24),
      paddingHorizontal: moderateScale(8),
      borderTopEndRadius: moderateScale(8),
      bottom: 0,
      start: 0,
      backgroundColor: theme.colors.primary
    },
    overLapText: {
      marginRight: moderateScale(5),
      lineHeight: 18
    },
    itemTextContainer: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10)
    },
    itemText: {
      textAlign: "center"
    },
    customFlatListContainer: {
      alignItems: "center"
    }
  });

export default style;
