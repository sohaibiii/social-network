import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { moderateScale, scale } from "~/utils/responsivityUtil";

type style = {
  footerRoot: ViewStyle;
  footerButtonLabelStyle: TextStyle;
  headerItemContainer: ViewStyle;
  headerItemRoot: ViewStyle;
  headerIconStyle: ViewStyle;
  radioButtonStyle: ViewStyle;
};

const FavouriteListRowStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    footerRoot: { margin: 20, marginTop: 10, width: scale(270), alignSelf: "center" },
    footerButtonLabelStyle: { color: "white" },
    headerItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.grayEE,
      borderColor: colors.lightGray,
      borderWidth: 1,
      padding: 8,
      borderRadius: 5,
      marginBottom: 10
    },
    headerItemRoot: { padding: 10, paddingTop: 20 },
    headerIconStyle: { marginRight: 5, marginTop: 3 },
    radioButtonStyle: { marginRight: 5 },
    listNameStyle: { flex: 1 },
    handleStyle: {
      height: moderateScale(4),
      width: scale(30),
      backgroundColor: colors.gray,
      alignSelf: "center",
      marginBottom: moderateScale(10),
      borderRadius: 8
    }
  });

export default FavouriteListRowStyles;
