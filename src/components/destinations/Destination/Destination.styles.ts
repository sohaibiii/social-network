import { StyleSheet, ViewStyle, ImageStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type DestinationStyleType = {
  destinationWrapperStyle: ViewStyle;
  imageOverlayStyle: ViewStyle;
  titleViewWrapperStyle: ViewStyle;
  destinationImageStyle: ImageStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  width: number,
  aspectRatio: number
): DestinationStyleType =>
  StyleSheet.create({
    destinationWrapperStyle: {
      marginHorizontal: 4,
      width: width,
      position: "relative",
      borderRadius: 5,
      overflow: "hidden"
    },
    imageOverlayStyle: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#000000",
      opacity: 0.25,
      zIndex: 1,
      borderRadius: 5
    },
    titleViewWrapperStyle: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      marginHorizontal: 4,
      bottom: verticalScale(8),
      justifyContent: "flex-end",
      alignItems: "center",
      zIndex: 2
    },
    destinationImageStyle: { width: width, aspectRatio: aspectRatio }
  });

export default styles;
