import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import {
  APP_SCREEN_HEIGHT,
  APP_SCREEN_WIDTH,
  HORIZONTAL_SLIDER_HEIGHT
} from "~/constants/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

type style = {
  safeAreaViewStyle: ViewStyle;
  backIconStyle: ViewStyle;
  stickyHeaderWrapperStyle: ViewStyle;
  stickyHeaderBackIconStyle: ViewStyle;
  stickyHeaderTitleWrapperStyle: ViewStyle;
  shareIconWrapperStyle: ViewStyle;
  parallaxHeaderWrapperStyle: ViewStyle;
  parallaxHeaderTouchableStyle: ViewStyle;
  overlayWrapperStyle: ViewStyle;
  coverImageStyle: ViewStyle;
  filtersContainer: ViewStyle;
  iconTextWithFlexContainer: ViewStyle;
  iconStyle: ViewStyle;
  iconTextContainer: ViewStyle;
  buttonContainerStyle: ViewStyle;
  calendarButtonStyle: ViewStyle;
  containerStyle: ViewStyle;
  whiteLabel: TextStyle;
  ratingBarStyle: ViewStyle;
  marginBottom5: ViewStyle;
  rowWithVerticalMargin: ViewStyle;
  row: ViewStyle;
  startingPriceTextStyle: ViewStyle;
  reviewButtonContainer: ViewStyle;
  offerEndRow: ViewStyle;
  filtersRowStyle: ViewStyle;
  moreButtonStyle: ViewStyle;
  moreButtonWrapperStyle: ViewStyle;
  moreButtonLabelStyle: TextStyle;
  mapContainerStyle: ViewStyle;
  descriptionWrapperStyle: ViewStyle;
  recycleViewStyle: ViewStyle;
  contentContainerStyle: ViewStyle;
  sliderWrapperStyle: ViewStyle;
  sliderTitleTextStyle: TextStyle;
  countDownStyle: TextStyle;
};

const hotelDetailsStyles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number,
  recyclerWidth: number
): style =>
  StyleSheet.create({
    containerStyle: {
      paddingHorizontal: scale(12),
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      marginTop: -verticalScale(12),
      paddingTop: verticalScale(10),
      backgroundColor: theme.colors.background,
      overflow: "hidden"
    },
    countDownStyle: {
      color: theme.colors.red,
      fontSize: RFValue(14),
      lineHeight: RFValue(16)
    },
    safeAreaViewStyle: {
      flex: 1,
      marginBottom: insets.bottom,
      backgroundColor: "transparent"
    },
    backIconStyle: { position: "absolute", left: 0, top: insets.top, zIndex: 1 },
    stickyHeaderWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    stickyHeaderBackIconStyle: { position: "absolute", left: 0, top: 0 },
    stickyHeaderTitleWrapperStyle: {
      flex: 1,
      marginHorizontal: scale(25),
      paddingHorizontal: scale(10)
    },
    shareIconWrapperStyle: {
      padding: 5,
      backgroundColor: "rgba(7,7,7,0.4)",
      borderRadius: 10,
      position: "absolute",
      right: 20,
      top: parallaxHeaderHeight / 2,
      zIndex: 2
    },
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
    filtersContainer: {
      flexDirection: "row",
      marginVertical: verticalScale(6),
      marginHorizontal: 4
    },
    iconTextWithFlexContainer: {
      backgroundColor: theme.colors.primary,
      flex: 1,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    iconStyle: {
      marginHorizontal: scale(8)
    },
    iconTextContainer: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginStart: 2,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(8)
    },
    calendarButtonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10)
    },
    whiteLabel: { color: theme.colors.white },
    ratingBarStyle: {
      marginStart: 4,
      alignSelf: "flex-start",
      marginVertical: verticalScale(8)
    },
    marginBottom5: {
      marginBottom: 5
    },
    rowWithVerticalMargin: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: verticalScale(6)
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    offerEndRow: {
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "space-between"
    },
    startingPriceTextStyle: { marginEnd: 5 },
    filtersRowStyle: {
      flexDirection: "row",
      marginTop: 10,
      justifyContent: "space-between",
      marginBottom: 10
    },
    reviewButtonContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      paddingHorizontal: 15,
      paddingVertical: 4
    },
    moreButtonStyle: {
      marginHorizontal: scale(20),
      marginBottom: verticalScale(20)
    },
    moreButtonWrapperStyle: {
      backgroundColor: theme.colors.primary_blue,
      paddingVertical: 4
    },
    moreButtonLabelStyle: {
      color: theme.colors.white,
      fontSize: RFValue(12)
    },
    mapContainerStyle: {
      borderRadius: 0,
      marginHorizontal: 0,
      height: verticalScale(90),
      marginVertical: 10
    },
    descriptionWrapperStyle: { marginBottom: 15 },
    recycleViewStyle: { minHeight: HORIZONTAL_SLIDER_HEIGHT, width: recyclerWidth },
    contentContainerStyle: {
      paddingHorizontal: 8
    },
    sliderWrapperStyle: {
      borderTopWidth: 1,
      paddingTop: 10,
      paddingBottom: verticalScale(6),
      borderColor: theme.colors.sliderItemBorderColor,
      backgroundColor: theme.colors.primaryBackground
    },
    sliderTitleTextStyle: { marginLeft: 20, marginBottom: 10, paddingTop: 5 }
  });

export default hotelDetailsStyles;
