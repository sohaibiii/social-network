import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

type PropertyCardStyleType = {
  cardWrapperStyle: ViewStyle;
  imageOverlayStyle: ViewStyle;
  coverImageStyle: ImageStyle;
  favoriteIconStyle: ViewStyle;
  ratingWrapperStyle: ViewStyle;
  locationWrapperStyle: ViewStyle;
  cardContentStyle: ViewStyle;
  propertyPrimaryTextStyle: TextStyle;
  propertySecondaryTextStyle: TextStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  width: number,
  aspectRatio: number
): PropertyCardStyleType =>
  StyleSheet.create({
    cardWrapperStyle: {
      width: width,
      overflow: "hidden",
      marginLeft: 3,
      marginRight: 3
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
    coverImageStyle: { width: width, aspectRatio: aspectRatio, borderRadius: 5 },
    favoriteIconStyle: { position: "absolute", top: 10, right: 10, zIndex: 2 },
    ratingWrapperStyle: {
      alignItems: "flex-start",
      marginBottom: verticalScale(5),
      marginTop: verticalScale(3)
    },
    locationWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 5
    },
    cardContentStyle: { paddingLeft: 5, paddingVertical: 4 },
    propertyPrimaryTextStyle: {
      marginBottom: 3,
      marginTop: 3
    },
    propertySecondaryTextStyle: { marginLeft: 5, flexShrink: 1 }
  });

export default styles;
