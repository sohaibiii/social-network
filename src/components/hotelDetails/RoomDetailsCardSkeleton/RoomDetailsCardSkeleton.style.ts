import { StyleSheet } from "react-native";

import { moderateScale, scale, verticalScale } from "~/utils/";

const roomDetailsCardSkeletonStyle = StyleSheet.create({
  containerStyle: { marginBottom: 10, padding: 12 },
  firstTextSkeleton: {
    width: scale(120),
    height: verticalScale(24),
    marginBottom: verticalScale(4),
    borderRadius: 5
  },
  secondTextSkeleton: {
    width: scale(200),
    height: verticalScale(14),
    marginBottom: verticalScale(4),
    borderRadius: 5
  },
  thirdTextSkeleton: {
    width: scale(170),
    height: verticalScale(14),
    marginBottom: verticalScale(4),
    borderRadius: 5
  },
  row: {
    flexDirection: "row"
  },
  imageSkeleton: {
    height: moderateScale(80),
    width: moderateScale(80),
    marginEnd: 10,
    borderRadius: 10
  }
});
export default roomDetailsCardSkeletonStyle;
