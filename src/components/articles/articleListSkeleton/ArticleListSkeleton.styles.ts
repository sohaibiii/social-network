import { StyleSheet } from "react-native";

import { scale, verticalScale, moderateScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  container: (colors: ReactNativePaper.ThemeColors) => ({
    width: "100%",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    paddingBottom: 20
  }),
  nameContainer: {
    marginVertical: verticalScale(8),
    alignItems: "flex-start",
    paddingHorizontal: 10
  },
  topBar: {
    borderRadius: 4,
    width: scale(250),
    height: verticalScale(24),
    alignSelf: "flex-start"
  },

  bottomBar: {
    borderRadius: 4,
    height: verticalScale(18),
    width: "95%",
    marginLeft: 10,
    marginTop: verticalScale(4)
  },

  imageContainer: {
    width: "100%",
    height: verticalScale(100),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  badgeStyle: {
    lineHeight: 16,
    paddingHorizontal: moderateScale(10),
    width: 88,
    height: 23,
    borderRadius: 20,
    paddingVertical: 10,
    marginLeft: 10,
    marginTop: 10
  }
});

export default styles;
