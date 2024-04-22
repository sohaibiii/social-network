import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

type ArticleDetailstype = {
  safeareaViewStyle: ViewStyle;
  authorWrapperStyle: ViewStyle;
  userProfileImageStyle: ImageStyle;
  strongStyle: TextStyle;
  titleTextStyle: TextStyle;
  parallaxBodyWrapperStyle: ViewStyle;
  backIconStyle: ViewStyle;
  stickyHeaderWrapperStyle: ViewStyle;
  stickyHeaderBackIconStyle: ViewStyle;
  stickyHeaderTitleWrapperStyle: ViewStyle;
  shareIconWrapperStyle: ViewStyle;
  imageGalleryIconWrapperStyle: ViewStyle;
  parallaxHeaderWrapperStyle: ViewStyle;
  parallaxHeaderTouchableStyle: ViewStyle;
  imagesLengthTextStyle: TextStyle;
  badgeStyle: ViewStyle;
  badgeWrapperStyle: ViewStyle;
  viewCountWrapperStyle: ViewStyle;
  viewCountTextStyle: TextStyle;
  overlayWrapperStyle: ViewStyle;
  coverImageStyle: ViewStyle;
  commentTextStyle: ViewStyle;
  moreButtonContainer: ViewStyle;
  moreButtonStyle: ViewStyle;
  moreButtonLabelStyle: TextStyle;
  commentsHeaderContainer: ViewStyle;
  parallaxBodyBackground: ViewStyle;
  reviewCardsContainerStyle: ViewStyle;
  buttonContainer: ViewStyle;
  addCommentStyle: ViewStyle;
  summaryTextStyle: TextStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number
): ArticleDetailstype =>
  StyleSheet.create({
    safeareaViewStyle: {
      flex: 1,
      marginBottom: insets.bottom,
      backgroundColor: "transparent"
    },
    authorWrapperStyle: {
      backgroundColor: theme.colors.lighterBackground,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10
    },
    userProfileImageStyle: { marginStart: scale(4), marginEnd: scale(12) },
    strongStyle: {
      textAlign: "left",
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: RFValue(14),
      fontWeight: "normal"
    },
    titleTextStyle: { margin: 10, paddingRight: 20 },
    parallaxBodyWrapperStyle: {
      overflow: "hidden",
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: theme.colors.primaryBackground,
      marginTop: -verticalScale(20)
    },
    backIconStyle: { position: "absolute", left: 0, top: insets.top, zIndex: 1 },
    stickyHeaderWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    stickyHeaderBackIconStyle: { position: "absolute", left: 0, top: 0 },
    stickyHeaderTitleWrapperStyle: { flex: 1, marginHorizontal: 25, paddingLeft: 40 },
    shareIconWrapperStyle: {
      padding: 5,
      backgroundColor: "rgba(7,7,7,0.4)",
      borderRadius: 10,
      position: "absolute",
      right: 20,
      top: parallaxHeaderHeight / 2,
      zIndex: 2
    },
    imageGalleryIconWrapperStyle: {
      position: "absolute",
      left: 20,
      top: parallaxHeaderHeight / 2,
      padding: 5,
      backgroundColor: "rgba(7,7,7,0.4)",
      borderRadius: 10,
      flexDirection: "row",
      zIndex: 2
    },
    imagesLengthTextStyle: { paddingHorizontal: 5 },
    parallaxHeaderWrapperStyle: {
      flex: 1,
      width: undefined,
      height: undefined
    },
    parallaxHeaderTouchableStyle: {
      flex: 1,
      width: undefined,
      height: undefined
    },
    badgeStyle: {
      marginLeft: 3,
      backgroundColor: theme.colors.primary_blue,
      lineHeight: 20,
      paddingHorizontal: moderateScale(10),
      marginTop: 3
    },
    badgeWrapperStyle: {
      flexDirection: "row",
      paddingVertical: 10,
      marginLeft: 10,
      flexWrap: "wrap"
    },
    viewCountTextStyle: { marginHorizontal: 5 },
    viewCountWrapperStyle: {
      flexDirection: "row",
      marginLeft: 10
    },
    overlayWrapperStyle: {
      backgroundColor: "rgba(7,7,7,0.3)",
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 1
    },
    coverImageStyle: {
      height: parallaxHeaderHeight,
      width: APP_SCREEN_WIDTH
    },
    commentTextStyle: { marginEnd: scale(8) },
    moreButtonContainer: {
      backgroundColor: theme.colors.primaryBackground,
      justifyContent: "center",
      flexDirection: "row"
    },
    moreButtonStyle: {
      alignSelf: "center",
      marginVertical: moderateScale(20)
    },
    moreButtonLabelStyle: { color: "white" },
    commentsHeaderContainer: {
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.primaryBackground,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10
    },
    summaryTextStyle: { paddingRight: 5, paddingLeft: 10, marginVertical: 10 },
    parallaxBodyBackground: { backgroundColor: theme.colors.primaryBackground },
    reviewCardsContainerStyle: {
      backgroundColor: theme.colors.primaryBackground,
      paddingTop: verticalScale(8)
    },
    buttonContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: scale(16),
      paddingVertical: 6
    },
    addCommentStyle: { marginHorizontal: 4 }
  });

export default styles;
