import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

const hotelsListCardStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      marginBottom: verticalScale(10),
      height: moderateScale(100),
      borderRadius: 10,
      flexDirection: "row",
      backgroundColor: colors.surface
    },
    centeredRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    flex: { flex: 1 },
    spacingStyle: {
      height: "100%",
      width: 1,
      backgroundColor: colors.lightishGray
    },
    capitalizedText: { textTransform: "capitalize" },
    imageContainerStyle: {
      height: moderateScale(100),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      width: moderateScale(90),
      overflow: "hidden"
    },
    imageStyle: {
      width: "100%",
      height: "100%"
    },
    hotelDetailsStyle: {
      flex: 1,
      height: moderateScale(80),
      justifyContent: "space-evenly",
      paddingHorizontal: scale(8)
    },
    hotelDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    row: {
      flexDirection: "row"
    },
    ratingBarStyle: {
      alignSelf: "flex-start"
    },
    startingPriceContainerStyle: {
      width: moderateScale(80),
      marginHorizontal: 4
    },
    boldTextStyle: {
      marginTop: 8,
      fontWeight: "bold"
    }
  });

export default hotelsListCardStyle;
