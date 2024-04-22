import { ImageStyle, StyleSheet, ViewStyle } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale } from "~/utils/responsivityUtil";

type PostStyleType = {
  containerStyle: ViewStyle;
  imageStyle: ImageStyle;
  ratingAndNameContainerStyle: ViewStyle;
  favouriteIconStyle: ViewStyle;
};

const tagsCardStyles = (
  colors: ReactNativePaper.ThemeColors,
  containerHeight: number,
  imageWidth: number,
  tagsLength: number
): PostStyleType =>
  StyleSheet.create({
    containerStyle: {
      flexDirection: "row",
      marginEnd: scale(12),
      borderRadius: 5,
      overflow: "hidden",
      backgroundColor: colors.lightishGray,
      borderWidth: 1,
      borderColor: colors.lightGray,
      alignItems: "center",
      width: tagsLength === 1 ? APP_SCREEN_WIDTH - 20 : APP_SCREEN_WIDTH * 0.6,
      height: containerHeight,
      minHeight: 50
    },
    lastTagContainerStyle: {
      marginEnd: 0
    },
    imageStyle: {
      width: imageWidth,
      height: "100%"
    },
    ratingAndNameContainerStyle: {
      flex: 1,
      marginStart: scale(10),
      alignItems: "flex-start",
      justifyContent: "space-around",
      height: "100%"
    },
    favouriteIconStyle: {
      alignSelf: "flex-start",
      margin: scale(4)
    }
  });

export default tagsCardStyles;
