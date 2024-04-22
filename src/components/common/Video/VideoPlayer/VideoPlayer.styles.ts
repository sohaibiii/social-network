import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { verticalScale } from "~/utils/";

type IosStylesType = {
  backgroundVideo: ViewStyle;
  loaderStyle: ViewStyle;
  thumbnailStyle: ViewStyle;
  thumbnailContainerStyle: ViewStyle;
};

type AndroidStylesType = {
  backgroundVideo: ViewStyle;
  backgroundVideoFullScreenStyle: ViewStyle;
  videoWrapperStyle: ViewStyle;
  progressBarStyle: ViewStyle;
  progressBarLandscapeStyle: ViewStyle;
  videoWrapperFullScreenStyle: ViewStyle;
  controlOverlay: ViewStyle;
  fullscreenButton: ViewStyle;
  videoIconStyle: TextStyle;
  hitSlopStyle: ViewStyle;
  loaderStyle: ViewStyle;
  modalStyle: ViewStyle;
  flexGrow: ViewStyle;
  videoPlayerWrapperStyle: ViewStyle;
};

const iosStyles = (theme: ReactNativePaper.Theme): IosStylesType =>
  StyleSheet.create({
    backgroundVideo: {
      height: "100%",
      zIndex: 1,
      width: "100%",
      backgroundColor: "transparent"
    },
    loaderStyle: {
      flex: 1,
      position: "absolute",
      opacity: 0.85,
      width: "100%",
      height: "100%",
      zIndex: theme.zIndex.videoModal - 1,
      alignSelf: "center",
      justifyContent: "center"
    },
    thumbnailStyle: {
      height: "100%",
      width: "100%",
      zIndex: theme.zIndex.videoModal - 1,
      backgroundColor: "#9DCADC",
      alignItems: "center"
    },
    thumbnailContainerStyle: {
      flex: 1,
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: theme.zIndex.videoModal - 1,
      alignSelf: "center",
      justifyContent: "center"
    }
  });

const androidStyles = (theme: ReactNativePaper.Theme): AndroidStylesType =>
  StyleSheet.create({
    backgroundVideo: {
      height: "100%",
      width: "100%"
    },
    progressBarStyle: {
      position: "absolute",
      bottom: verticalScale(120),
      width: "100%",
      zIndex: theme.zIndex.videoModal + 1
    },
    progressBarLandscapeStyle: {
      position: "absolute",
      bottom: verticalScale(60),
      width: "100%",
      zIndex: theme.zIndex.videoModal + 1
    },
    backgroundVideoFullScreenStyle: {
      height: "100%",
      width: "100%",
      backgroundColor: "#000"
    },
    videoWrapperStyle: {
      backgroundColor: "#000",
      // flex: 1
      height: "100%",
      width: "100%"
    },
    videoWrapperFullScreenStyle: {
      height: APP_SCREEN_HEIGHT,
      width: APP_SCREEN_WIDTH,
      zIndex: theme.zIndex.videoModal,
      position: "absolute",
      //   top: -CARD_ITEM_HEADER_HETGHT,
      top: 0, //temp
      bottom: 0,
      left: 0,
      right: 0
    },
    controlOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      justifyContent: "space-between"
    },
    fullscreenButton: {
      flex: 1,
      flexDirection: "row",
      alignSelf: "flex-end",
      alignItems: "center",
      paddingRight: 10
    },
    videoIconStyle: {
      color: theme.colors.white,
      fontSize: 28
    },
    hitSlopStyle: { top: 10, bottom: 10, left: 10, right: 10 },
    loaderStyle: {
      flex: 1,
      position: "absolute",
      opacity: 0.85,
      width: "100%",
      height: "100%",
      zIndex: theme.zIndex.videoModal - 1,
      alignSelf: "center",
      justifyContent: "center"
    },
    modalStyle: { padding: 0, margin: 0 },
    flexGrow: {
      flex: 1
    },
    videoPlayerWrapperStyle: { width: "100%", height: "100%" }
  });

export { iosStyles, androidStyles };
