import { StyleSheet } from "react-native";

import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const reviewSummaryStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    root: {
      width: "100%",
      backgroundColor: colors.lightBackground,
      alignItems: "center",
      paddingVertical: moderateScale(10),
      borderRadius: 10
    },
    ratingContainer: {
      backgroundColor: colors.lightGrayBackground,
      padding: 10,
      paddingHorizontal: 20,
      borderRadius: 50,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    },
    ratingStyle: { marginRight: 10 },
    totalRatingStyle: { marginVertical: verticalScale(15) },
    ratingRowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateScale(10)
    },
    ratingBarContainer: {
      width: 200,
      backgroundColor: colors.lightGrayBackground,
      borderRadius: 50,
      marginHorizontal: 10,
      height: moderateScale(13)
    },
    activeRatingBar: {
      flex: 1,
      backgroundColor: colors.orange,
      borderRadius: 50,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3
    }
  });

export default reviewSummaryStyle;
