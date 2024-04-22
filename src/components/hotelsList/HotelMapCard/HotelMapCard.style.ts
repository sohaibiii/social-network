import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

const hotelMapCardStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      height: moderateScale(70),
      width: moderateScale(260),
      borderRadius: 10,
      flex: 1,
      flexGrow: 1,
      flexDirection: "row",
      backgroundColor: colors.surface
    },
    flex: {
      flex: 1
    },
    centeredRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    imageStyle: {
      height: moderateScale(70),
      borderRadius: 5,
      width: moderateScale(70)
    },
    hotelDetailsStyle: {
      flex: 1,
      height: moderateScale(70),
      justifyContent: "space-evenly",
      paddingHorizontal: scale(8)
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    ratingBarStyle: {
      alignSelf: "flex-start"
    },
    startingPriceContainerStyle: {
      width: moderateScale(60),
      marginHorizontal: 4
    },
    boldTextStyle: {
      marginTop: 2,
      fontWeight: "bold"
    },
    spacingStyle: {
      height: "100%",
      width: 1,
      backgroundColor: colors.lightishGray
    },
    capitalizedTextStyle: { textTransform: "capitalize" }
  });

export default hotelMapCardStyle;
