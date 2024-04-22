import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH, HORIZONTAL_SLIDER_HEIGHT } from "~/constants/";
import { moderateScale, scale, verticalScale } from "~/utils/responsivityUtil";

type CityCountyRegiontype = {
  galleryTouchableStyle: ViewStyle;
  galleryImageStyle: ImageStyle;
  weatherWrapperStyle: ViewStyle;
  weatherTextStyle: TextStyle;
  destinationTitleStyle: ViewStyle;
  destinationFlagImageStyle: ImageStyle;
  destinationTitleTextStyle: TextStyle;
  descriptionWrapperStyle: ViewStyle;
  detailsInfoWrapperStyle: ViewStyle;
  weatherInfoWrapperStyle: ViewStyle;
  flexRowCenter: ViewStyle;
  iconStyle: ViewStyle;
  maxTempretureWrapperStyle: ViewStyle;
  livingCostWrapperStyle: ViewStyle;
  timeToVisitWrapperStyle: ViewStyle;
  mapWrapperStyle: ViewStyle;
  articlesScrollViewContainerStyle: ViewStyle;
  propertiesScrollViewContainerStyle: ViewStyle;
  subTitleTextStyle: TextStyle;
  articlesWrapperStyle: ViewStyle;
  headerIconStyle: ViewStyle;
  rightHeaderStyle: ViewStyle;
  searchHeaderWrapperStyle: ViewStyle;
  searchTitleTextStyle: TextStyle;
  bestTimeWrapperStyle: ViewStyle;
  sliderItemTextWrapperStyle: ViewStyle;
  sliderTitleTextStyle: TextStyle;
  sliderWrapperStyle: ViewStyle;
  featuresWrapperStyle: ViewStyle;
  buyTicketWrapperStyle: ViewStyle;
  buyTicketButtonStyle: ViewStyle;
  buyTicketButtonLabelStyle: ViewStyle;
  reviewsWrapperStyle: ViewStyle;
  recommendedTimeStyle: ViewStyle;
  flexGrow: ViewStyle;
  flexOne: ViewStyle;
  specialContentScrollViewStyle: ViewStyle;
  propertyDescriptionWrapperStyle: ViewStyle;
  propertEnglishNameTextStyle: TextStyle;
  propertyNameTextStyle: TextStyle;
  recommendedTimeTextStyle: TextStyle;
  namesWrapperStyle: ViewStyle;
  topWrapperStyle: ViewStyle;
  actionsWrapperStyle: ViewStyle;
  descriptionTextStyle: TextStyle;
  recycleViewStyle: ViewStyle;
  sliderSectionWrapperStyle: ViewStyle;
  reviewSliderWrapperStyle: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number,
  hasTicket: boolean,
  recylcerWidth: number
): any =>
  StyleSheet.create({
    galleryTouchableStyle: {
      height: verticalScale(300),
      width: APP_SCREEN_WIDTH,
      position: "relative"
    },
    moreButtonStyle: {
      marginHorizontal: scale(20)
    },
    moreButtonWrapperStyle: {
      backgroundColor: theme.colors.white,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary_blue
    },
    moreButtonLabelStyle: {
      color: theme.colors.primary_blue,
      fontSize: RFValue(12)
    },
    galleryImageStyle: { height: undefined, width: undefined, flex: 1 },
    weatherWrapperStyle: {
      width: verticalScale(100),
      height: verticalScale(100),
      position: "absolute",
      top: 50,
      right: 50,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center"
    },
    weatherTextStyle: { lineHeight: 52 },
    destinationTitleStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
    destinationFlagImageStyle: { width: 32, height: 32, marginRight: 10 },
    destinationTitleTextStyle: { marginVertical: 10 },
    descriptionWrapperStyle: { paddingHorizontal: scale(20) },
    detailsInfoWrapperStyle: {
      flexDirection: "row",
      marginTop: verticalScale(20),
      justifyContent: "space-around"
    },
    weatherInfoWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: verticalScale(20)
    },
    flexRowCenter: { flexDirection: "row", alignItems: "center" },
    iconStyle: { marginRight: 10 },
    maxTempretureWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20
    },
    livingCostWrapperStyle: { marginHorizontal: 20, marginBottom: verticalScale(20) },
    timeToVisitWrapperStyle: { marginHorizontal: 20, marginBottom: verticalScale(20) },
    mapWrapperStyle: { marginHorizontal: 20, marginBottom: verticalScale(20) },
    articlesScrollViewContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: 10
    },
    propertiesScrollViewContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: 10
    },
    subTitleTextStyle: { marginBottom: 30 },
    articlesWrapperStyle: {
      paddingHorizontal: 10
    },
    headerIconStyle: {
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center"
    },
    rightHeaderStyle: {
      flexDirection: "row",
      justifyContent: "space-around"
    },
    searchHeaderWrapperStyle: { paddingHorizontal: 10, marginBottom: 10 },
    searchTitleTextStyle: { marginBottom: verticalScale(10) },
    bestTimeWrapperStyle: { flexDirection: "row", justifyContent: "space-between" },
    safeareaViewStyle: {
      flex: 1
    },
    strongStyle: {
      textAlign: "left",
      fontFamily: theme.fonts.medium.fontFamily,
      fontSize: RFValue(14),
      fontWeight: "normal"
    },
    parallaxBodyWrapperStyle: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      marginTop: -verticalScale(20),
      backgroundColor: theme.colors.primaryBackground
    },
    backIconStyle: { position: "absolute", left: 0, top: insets.top, zIndex: 1 },
    stickyHeaderWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1
    },
    stickyHeaderStyle: {
      position: "absolute",
      zIndex: 999,
      paddingTop: insets.top,
      paddingBottom: 4,
      backgroundColor: theme.colors.primary,
      width: "100%",
      flexDirection: "row",
      alignItems: "center"
    },
    stickyHeaderBackIconStyle: { position: "absolute", left: 0, top: 0 },
    stickyHeaderTitleWrapperStyle: { flex: 1, marginHorizontal: 25, paddingLeft: 40 },
    shareIconWrapperStyle: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      backgroundColor: "rgba(7,7,7,0.4)",
      marginRight: 5,
      borderRadius: 10
    },
    imageGalleryIconWrapperStyle: {
      padding: 5,
      backgroundColor: "rgba(7,7,7,0.4)",
      marginRight: 5,
      borderRadius: 10,
      flexDirection: "row"
    },
    favoriteIconWrapperStyle: {
      padding: 5,
      backgroundColor: "rgba(7,7,7,0.4)",
      marginRight: 5,
      borderRadius: 10,
      flexDirection: "row"
    },
    imagesLengthTextStyle: { paddingHorizontal: 5 },
    parallaxHeaderWrapperStyle: {
      flex: 1,
      width: undefined,
      height: undefined
    },
    sliderSectionWrapperStyle: { marginTop: 10, paddingVertical: verticalScale(6) },
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
    iconWrapperStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: scale(30)
    },
    rowWrapperStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    sliderItemTextWrapperStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 10,
      paddingHorizontal: 8
    },
    nearbyAttractionsStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 10
    },
    contentContainerStyle: {
      paddingHorizontal: 8
    },
    sliderTitleTextStyle: { marginLeft: 20, marginBottom: 10, paddingTop: 5 },
    sliderWrapperStyle: {
      borderTopWidth: 1,
      paddingTop: 10,
      paddingBottom: verticalScale(6),
      borderColor: theme.colors.sliderItemBorderColor,
      backgroundColor: theme.colors.primaryBackground
    },
    reviewSliderWrapperStyle: {
      borderTopWidth: 1,
      paddingTop: 10,
      paddingBottom: hasTicket ? verticalScale(6) : insets.bottom + verticalScale(6),
      borderColor: theme.colors.sliderItemBorderColor,
      backgroundColor: theme.colors.primaryBackground
    },
    featuresWrapperStyle: { flexDirection: "row", paddingLeft: 10, flexWrap: "wrap" },
    specialContentWrapperStyle: { marginTop: verticalScale(20) },
    actionWrapperParallelStyle: {
      alignItems: "stretch",
      flexDirection: "row",
      justifyContent: "space-between",
      position: "absolute",
      right: 10,
      top: insets.top + 10,
      zIndex: 1,
      flex: 1
    },
    claimedLogoStyle: {
      width: verticalScale(60),
      height: verticalScale(60),
      borderRadius: verticalScale(30)
    },
    claimedLogoWrapperStyle: {
      position: "absolute",
      top: -verticalScale(20),
      right: moderateScale(20),
      borderWidth: 3,
      borderColor: theme.colors.white,
      borderRadius: verticalScale(35),
      backgroundColor: theme.colors.white
    },
    buyTicketWrapperStyle: {
      position: "absolute",
      bottom: 0,
      backgroundColor: theme.colors.background,
      width: "100%",
      paddingHorizontal: 10
    },
    buyTicketButtonStyle: {
      backgroundColor: theme.colors.primary_blue,
      paddingTop: verticalScale(6),
      paddingBottom: verticalScale(6),
      marginBottom: insets.bottom,
      marginHorizontal: 10
    },
    buyTicketButtonLabelStyle: { color: theme.colors.white, fontSize: RFValue(15) },
    reviewsWrapperStyle: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.colors.primaryBackground,
      paddingTop: 10
    },
    flexGrow: { flexGrow: 1 },
    flexOne: { flex: 1 },
    specialContentScrollViewStyle: {
      flexGrow: 1,
      paddingBottom: 10,
      paddingLeft: 1
    },
    propertyDescriptionWrapperStyle: {
      marginTop: 10,
      paddingHorizontal: scale(16),
      paddingBottom: 10
    },
    propertEnglishNameTextStyle: { marginLeft: scale(16), marginTop: 10 },
    propertyNameTextStyle: { marginLeft: scale(16), marginRight: 5 },
    namesWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 20
    },
    topWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    actionsWrapperStyle: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      flex: 1
    },
    descriptionTextStyle: {
      textAlign: "left",
      fontSize: RFValue(13),
      lineHeight: RFValue(18),
      fontFamily: theme.fonts.thin.fontFamily,
      color: "black"
    },
    reviewRowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: moderateScale(15),
      paddingRight: moderateScale(10)
    },
    ratingStarsContainer: { flexDirection: "row", alignItems: "center" },
    reviewButtonContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      marginHorizontal: 8,
      paddingHorizontal: 15,
      paddingVertical: 4
    },
    ratingStyle: { marginRight: moderateScale(8) },
    recommendedTimeStyle: {
      borderTopWidth: 1,
      marginTop: verticalScale(5),
      paddingTop: verticalScale(15),
      paddingBottom: verticalScale(10),
      paddingLeft: scale(16),
      borderColor: theme.colors.sliderItemBorderColor,
      flexDirection: "row",
      alignItems: "center"
    },
    recommendedTimeTextStyle: {
      marginLeft: scale(5),
      maxWidth: "90%"
    },
    showOnMapStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 8
    },
    recycleViewStyle: {
      minHeight: HORIZONTAL_SLIDER_HEIGHT,
      width: recylcerWidth
    }
  });

export default styles;
