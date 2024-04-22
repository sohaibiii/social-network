import { StatusBar, StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

const carouselMapItemStyle = StyleSheet.create({
  root: (colors: ReactNativePaper.ThemeColors) => ({
    height: moderateScale(110),
    backgroundColor: colors?.lightBackground,
    borderRadius: 5,
    padding: 5,
    flexDirection: "row"
  }),
  containerStyle: {
    marginVertical: verticalScale(10),
    width: APP_SCREEN_WIDTH - scale(70)
  },
  imageStyle: { height: "100%", width: 100, borderRadius: 5 },
  container: { marginLeft: moderateScale(8), flex: 1 },
  nameContainer: { flexDirection: "row" },
  flexStyle: { flex: 1 },
  ratingStyle: {
    justifyContent: "flex-start",
    marginTop: moderateScale(3)
  },
  loaderStyle: {
    flex: 1,
    justifyContent: "center",
    marginBottom: moderateScale(10)
  },
  contentContainerStyle: {
    minHeight: APP_SCREEN_HEIGHT / 3,
    paddingHorizontal: 10
  },
  modalStyle: {
    bottom: 0,
    width: "100%",
    justifyContent: "flex-end",
    margin: 0,
    marginTop: APP_SCREEN_HEIGHT * 0.25,
    alignSelf: "flex-end",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  }
});
export default carouselMapItemStyle;
