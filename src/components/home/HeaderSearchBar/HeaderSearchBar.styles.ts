import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type HomeStyleType = {
  searchBarWrapperStyle: ViewStyle;
  searchBarStyle: ViewStyle;
  textStyle: TextStyle;
  iconSearchStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): HomeStyleType =>
  StyleSheet.create({
    searchBarStyle: {
      backgroundColor: theme.colors.homepageItemBackground,
      borderColor: theme.colors.grayEE,
      borderWidth: 1,
      alignSelf: "flex-start",
      paddingHorizontal: scale(10),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      borderRadius: 6
    },
    containerStyle: {
      marginHorizontal: "5%",
      marginVertical: verticalScale(10)
    },
    searchBarWrapperStyle: {
      alignItems: "center",
      backgroundColor: "transparent",
      justifyContent: "flex-end"
    },
    textStyle: { flex: 1, paddingVertical: verticalScale(10) },
    iconSearchStyle: { marginRight: scale(20) }
  });

export default styles;
