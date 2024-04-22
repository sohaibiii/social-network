import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

const hotelsListCardSkeletonStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      height: moderateScale(100),
      marginBottom: verticalScale(10),
      borderRadius: 10,
      padding: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
      backgroundColor: colors.surface
    },
    imageStyle: {
      height: moderateScale(100),
      width: moderateScale(90),
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      marginEnd: 8
    },
    hotelDetailsStyle: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingHorizontal: scale(8),
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
    },
    firstTextSkeleton: {
      marginTop: moderateScale(10),
      width: scale(150),
      height: verticalScale(19),
      marginBottom: verticalScale(4),
      borderRadius: 5
    },
    secondTextSkeleton: {
      width: scale(140),
      height: verticalScale(14),
      marginBottom: verticalScale(4),
      borderRadius: 5
    },
    thirdTextSkeleton: {
      width: scale(120),
      height: verticalScale(14),
      borderRadius: 5
    }
  });

export default hotelsListCardSkeletonStyle;
