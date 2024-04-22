import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { APP_SCREEN_WIDTH, HORIZONTAL_SLIDER_HEIGHT } from "~/constants/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

type CityCountyRegiontype = {
  galleryTouchableStyle: ViewStyle;
  galleryImageStyle: ImageStyle;
  weatherWrapperStyle: ViewStyle;
  weatherWrapperContainer: ViewStyle;
  destinationTitleStyle: ViewStyle;
  destinationFlagImageStyle: ImageStyle;
  destinationTitleTextStyle: TextStyle;
  descriptionWrapperStyle: ViewStyle;
  detailsInfoWrapperStyle: ViewStyle;
  weatherInfoWrapperStyle: ViewStyle;
  flexRowCenter: ViewStyle;
  flexOneRowCenter: ViewStyle;
  iconStyle: ViewStyle;
  maxTempretureWrapperStyle: ViewStyle;
  livingCostWrapperStyle: ViewStyle;
  timeToVisitWrapperStyle: ViewStyle;
  articlesScrollViewContainerStyle: ViewStyle;
  propertiesScrollViewContainerStyle: ViewStyle;
  propertyContainerStyle: ViewStyle;
  headerIconStyle: ViewStyle;
  rightHeaderStyle: ViewStyle;
  backArrowStyle: ViewStyle;
  planYourTripButtonStyle: ViewStyle;
  dividerStyle: ViewStyle;
  languageCurrencyContainerStyle: ViewStyle;
  scrollViewStyle: ViewStyle;
  mapContainerStyle: ViewStyle;
  parallaxBodyWrapperStyle: ViewStyle;
  parallaxBodyBackground: ViewStyle;
  bottomMargin: ViewStyle;
  recycleViewStyle: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  insets: EdgeInsets,
  parallaxHeaderHeight: number
): CityCountyRegiontype =>
  StyleSheet.create({
    galleryTouchableStyle: {
      height: verticalScale(300),
      width: APP_SCREEN_WIDTH,
      position: "relative"
    },
    dividerStyle: {
      height: verticalScale(30),
      marginHorizontal: 5,
      backgroundColor: theme.colors.grayBB,
      width: 1
    },
    parallaxBodyWrapperStyle: {
      overflow: "hidden",
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: theme.colors.primaryBackground,
      marginTop: -verticalScale(20)
    },
    parallaxBodyBackground: { backgroundColor: theme.colors.primaryBackground },
    backArrowStyle: { position: "absolute", left: 0, top: insets.top },
    galleryImageStyle: { height: undefined, width: undefined, flex: 1 },
    weatherWrapperStyle: {
      flexDirection: "row",
      borderRadius: 10,
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(5),
      justifyContent: "center",
      alignItems: "center"
    },
    weatherWrapperContainer: {
      position: "absolute",
      zIndex: theme.zIndex.parallax + 1,
      bottom: verticalScale(30),
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center"
    },
    destinationTitleStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    destinationFlagImageStyle: { height: 50, width: 50, marginHorizontal: scale(8) },
    destinationTitleTextStyle: { marginVertical: 10 },
    descriptionWrapperStyle: { paddingHorizontal: scale(8) },
    detailsInfoWrapperStyle: {
      marginTop: verticalScale(20),
      marginHorizontal: scale(8)
    },
    weatherInfoWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: verticalScale(20)
    },
    flexRowCenter: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(8)
    },
    flexOneRowCenter: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(8)
    },
    iconStyle: { marginRight: 10 },
    maxTempretureWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20
    },
    livingCostWrapperStyle: {
      marginHorizontal: scale(8),
      marginBottom: verticalScale(20)
    },
    timeToVisitWrapperStyle: { marginHorizontal: 20, marginBottom: verticalScale(20) },
    articlesScrollViewContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: scale(8)
    },
    propertiesScrollViewContainerStyle: {
      minWidth: APP_SCREEN_WIDTH
    },
    propertyContainerStyle: { paddingLeft: 0, marginEnd: 10 },
    headerIconStyle: {
      borderRadius: 10,
      width: APP_SCREEN_WIDTH / 2,
      borderColor: theme.colors.grayBB,
      borderWidth: 1,
      marginTop: verticalScale(10),
      paddingVertical: verticalScale(5),
      paddingHorizontal: scale(8),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    rightHeaderStyle: {
      flexDirection: "row",
      justifyContent: "space-around"
    },
    languageCurrencyContainerStyle: {
      backgroundColor: theme.colors.whitishBadgeColor,
      paddingVertical: 4,
      paddingHorizontal: scale(6),
      marginStart: 10,
      borderRadius: 50
    },
    planYourTripButtonStyle: {
      backgroundColor: theme.colors.whitishBadgeColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: scale(70),
      height: "100%",
      marginEnd: scale(5),
      paddingHorizontal: scale(6),
      marginTop: verticalScale(5),
      paddingVertical: scale(6)
    },
    scrollViewStyle: { backgroundColor: theme.colors.lightGrayBackground },
    mapContainerStyle: {
      borderRadius: 0,
      marginHorizontal: 0,
      height: verticalScale(90)
    },
    bottomMargin: {
      marginBottom: 10
    },
    recycleViewStyle: {
      minHeight: HORIZONTAL_SLIDER_HEIGHT
    }
  });

export default styles;
