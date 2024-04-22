import { StatusBar, StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { FONTS } from "~/theme/fonts";

const styles = StyleSheet.create({
  dividerStyle: (colors: ReactNativePaper.ThemeColors) => ({
    height: StatusBar?.currentHeight,
    backgroundColor: colors.background
  }),
  containerStyle: (colors: ReactNativePaper.ThemeColors) => ({
    paddingEnd: 20,
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    elevation: 0,
    borderBottomColor: colors.grayEE
  }),
  titleContainerStyle: {
    marginLeft: 0,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: -1
  },
  titleStyle: {
    alignSelf: "center",
    fontFamily: FONTS?.regular,
    fontSize: RFValue(15)
  },
  titleLeftStyle: {
    alignSelf: "flex-start",
    fontFamily: FONTS?.regular,
    fontSize: RFValue(15),
    marginLeft: 45
  },
  elevationWrapperStyle: (colors: ReactNativePaper.ThemeColors) => ({
    backgroundColor: colors.background,
    width: "100%",
    height: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5
  }),
  headerWrapperStyle: { overflow: "hidden", paddingBottom: 0 }
});
export default styles;
