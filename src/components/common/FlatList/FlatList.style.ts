import { StyleSheet, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { moderateScale } from "~/utils/responsivityUtil";

type style = {
  root: ViewStyle;
  listEmptyComponentContainer: ViewStyle;
  listEmptyComponentText: ViewStyle;
  flatListContainerStyle: ViewStyle;
  listFooterComponentStyle: ViewStyle;
};

const style = (theme: ReactNativePaper.Theme, backgroundColor?: string): style =>
  StyleSheet.create({
    root: {
      width: "100%",
      height: "100%",
      paddingBottom: moderateScale(30),
      backgroundColor
    },
    listEmptyComponentContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: moderateScale(30)
    },
    listEmptyComponentText: {
      color: theme.colors.text,
      fontSize: RFValue(16),
      marginLeft: moderateScale(10)
    },
    flatListContainerStyle: {
      flexGrow: 1
    },
    listFooterComponentStyle: {
      flex: 1,
      justifyContent: "center",
      marginBottom: moderateScale(10)
    }
  });

export default style;
