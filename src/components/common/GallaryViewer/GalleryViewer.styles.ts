import { StatusBar, StyleSheet, ViewStyle } from "react-native";

import { ImageStyle as FastImageStyle } from "react-native-fast-image";
import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH, PLATFORM } from "~/constants/variables";
import { scale, verticalScale } from "~/utils/";

type GalleryStylesTypes = {
  modalStyle: ViewStyle;
  imageGalleryStyle: ViewStyle;
  imageWrapperStyle: ViewStyle;
  containerStyle: ViewStyle;
  imageThumbnailWrapperStyle: ViewStyle;
  imageIndicatorWrapperStyle: ViewStyle;
  imageViewerWrapperStyle: ViewStyle;
  thumbnailStyle: FastImageStyle;
  videoStyle: ViewStyle;
  thumbnailSelectedStyle: FastImageStyle;
  closeWrapperStyle: ViewStyle;
  galleryWrapperStyle: ViewStyle;
  fullWidth: ViewStyle;
  ownerAndSourceStyle: ViewStyle;
  flex: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  height: number,
  THUMB_SIZE: number,
  insets: EdgeInsets
): GalleryStylesTypes =>
  StyleSheet.create({
    modalStyle: {
      backgroundColor: "black",
      flex: 1,
      margin: 0,
      position: "relative",
      paddingBottom: insets.bottom
    },
    flex: { flex: 1 },
    imageGalleryStyle: { width: "100%", height: "100%" },
    imageWrapperStyle: {
      height: APP_SCREEN_HEIGHT,
      width: "100%"
    },
    containerStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      zIndex: 1,
      position: "absolute",
      top: insets.top,
      left: 0,
      right: 0
    },
    imageIndicatorWrapperStyle: {
      justifyContent: "center",
      position: "absolute",
      paddingTop: verticalScale(8)
    },
    imageThumbnailWrapperStyle: { marginTop: verticalScale(6) },
    imageViewerWrapperStyle: {
      alignItems: "center",
      height: height
    },
    thumbnailStyle: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      marginRight: 10,
      borderRadius: 16,
      borderWidth: 0.75,
      borderColor: "white"
    },
    thumbnailSelectedStyle: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      marginRight: 10,
      borderRadius: 16,
      borderWidth: 4,
      borderColor: "orange"
    },
    closeWrapperStyle: {
      position: "absolute",
      right: 10,
      top: 10,
      zIndex: 1
    },
    galleryWrapperStyle: {
      height: APP_SCREEN_HEIGHT * 0.8,
      width: APP_SCREEN_WIDTH
    },
    ownerAndSourceStyle: {
      position: "absolute",
      bottom: verticalScale(12),
      width: APP_SCREEN_WIDTH,
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(4),
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "flex-start"
    },
    fullWidth: { width: "100%" },
    videoStyle: {
      marginTop: PLATFORM === "ios" ? verticalScale(34) : 0
    }
  });

export const landscapeStyles = (
  theme: ReactNativePaper.Theme,
  height: number,
  THUMB_SIZE: number,
  insets: EdgeInsets
): GalleryStylesTypes =>
  StyleSheet.create({
    modalStyle: {
      backgroundColor: "black",
      flex: 0,
      margin: 0,
      position: "relative",
      width: APP_SCREEN_HEIGHT,
      height: APP_SCREEN_WIDTH
    },
    imageGalleryStyle: {
      width: APP_SCREEN_HEIGHT,
      height: APP_SCREEN_WIDTH
    },
    imageWrapperStyle: {
      height: APP_SCREEN_WIDTH,
      width: APP_SCREEN_HEIGHT
    },
    containerStyle: {
      flex: 1,
      zIndex: 1,
      marginEnd: insets.bottom,
      alignItems: "center",
      justifyContent: "flex-start"
    },
    imageIndicatorWrapperStyle: {
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      position: "absolute",
      paddingTop: 2,
      marginTop: verticalScale(8)
    },
    imageThumbnailWrapperStyle: { bottom: 10 },
    imageViewerWrapperStyle: {
      alignItems: "center",
      width: APP_SCREEN_HEIGHT
    },
    thumbnailStyle: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      marginRight: 10,
      borderRadius: 16,
      borderWidth: 0.75,
      borderColor: "white"
    },
    thumbnailSelectedStyle: {
      borderWidth: 4,
      borderColor: "orange"
    },
    closeWrapperStyle: {
      position: "absolute",
      right: 10,
      top: 10,
      zIndex: 1
    },
    galleryWrapperStyle: {
      width: APP_SCREEN_HEIGHT,
      height: "100%"
    },
    ownerAndSourceStyle: {
      position: "absolute",
      bottom: verticalScale(12),
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(4),
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "flex-start"
    },
    fullWidth: { width: "100%" },
    videoStyle: {
      marginTop: PLATFORM === "ios" ? verticalScale(34) : 0
    }
  });

export default styles;
