import { ImageStyle, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const favouriteItemsStyles = (colors: ReactNativePaper.ThemeColors) => {
  return StyleSheet.create({
    flatListStyle: { padding: moderateScale(5) },
    root: {
      flexDirection: "row",
      marginBottom: 10,
      borderRadius: 5,
      borderWidth: 0.2,
      borderColor: colors.gray,
      justifyContent: "space-between"
    },
    itemRightContainer: { flex: 1, flexDirection: "row" },
    itemImageStyle: {
      height: verticalScale(80),
      width: scale(120),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      marginRight: moderateScale(5)
    },
    itemContent: { flex: 1, alignItems: "flex-start", justifyContent: "space-evenly" },
    itemLocationStyle: { flexDirection: "row" },
    headerButtonStyle: {
      width: scale(75),
      borderRadius: scale(15),
      paddingVertical: moderateScale(5)
    },
    buttonLabelStyle: {
      fontSize: RFValue(12),
      color: colors.white
    },
    menuDeleteItemStyle: { color: colors.error },
    optionsContainer: { paddingVertical: moderateScale(5) },
    flexStyle: { flex: 1 },
    editNameInputStyle: {
      height: verticalScale(45),
      lineHeight: 45
    },
    dialogTitleStyle: { color: colors.primary },
    ratingStyle: { marginTop: 0 },
    headerRightContainer: { flexDirection: "row", alignItems: "center" },
    headerRightIconContainer: {
      borderWidth: 0.8,
      borderRadius: 30,
      padding: 2,
      marginRight: moderateScale(5)
    }
  });
};
export default favouriteItemsStyles;
