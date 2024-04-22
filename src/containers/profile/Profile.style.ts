import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/variables";
import { scale, verticalScale, moderateScale } from "~/utils/";

type style = {
  container: ViewStyle;
  centerItems: ViewStyle;
  unexpandedHeaderStyle: TextStyle;
  usernameStyle: TextStyle;
  nameVerifiedContainer: ViewStyle;
  countryStyle: TextStyle;
  profileButtonsStyle: ViewStyle;
  buttonsSpacerStyle: ViewStyle;
  followButtonsStyle: ViewStyle;
  noPostsContainer: ViewStyle;
  noPostsText: TextStyle;
  noPostsImage: ImageStyle;
  iconStyle: TextStyle;
  loaderWrapperStyle: ViewStyle;
  rahhalStyle: ViewStyle;
  profileImageStyle: ViewStyle;
  rahhalProfileImageStyle: ViewStyle;
  avatarLabelStyle: TextStyle;
  actionsWrapperStyle: ViewStyle;
  safeareaViewStyle: ViewStyle;
  profileImageWrapperStyle: ViewStyle;
  rowWrapperStyle: ViewStyle;
  iconWrapperStyle: ViewStyle;
  flexGrow: ViewStyle;
  bioWrapperStyle: ViewStyle;
};

const profileStyles = (
  colors: ReactNativePaper.ThemeColors,
  isMyProfile: boolean
): style =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingVertical: verticalScale(20),
      alignItems: "center",
      justifyContent: "center"
    },
    nameVerifiedContainer: {
      marginTop: verticalScale(8),
      flexDirection: "row",
      alignItems: "center"
    },
    centerItems: {
      marginTop: verticalScale(12),
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row"
    },
    unexpandedHeaderStyle: {
      textAlign: "center",
      fontSize: RFValue(18),
      fontWeight: "bold",
      color: colors.white
    },
    usernameStyle: {
      color: colors.white,
      fontSize: RFValue(16),
      lineHeight: RFValue(18),
      marginHorizontal: 10
    },
    countryStyle: {
      color: colors.white,
      fontSize: RFValue(12),
      textAlign: "center"
    },
    profileButtonsStyle: {
      flexDirection: "row",
      marginTop: verticalScale(25),
      width: isMyProfile ? "50%" : "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    buttonsSpacerStyle: {
      width: 0.5,
      backgroundColor: colors.white,
      marginHorizontal: "15%"
    },
    followButtonsStyle: {
      flexDirection: "row",
      marginTop: verticalScale(10)
    },
    noPostsContainer: {
      paddingVertical: verticalScale(10)
    },
    noPostsText: {
      textAlign: "center",
      marginVertical: verticalScale(10),
      color: colors.text
    },
    noPostsImage: {
      width: scale(200),
      alignSelf: "center"
    },
    iconStyle: {
      width: scale(24),
      marginHorizontal: scale(8)
    },
    loaderWrapperStyle: { marginTop: 10, justifyContent: "center", alignItems: "center" },
    rahhalStyle: {
      position: "absolute",
      top: moderateScale(100) - 10,
      width: scale(35),
      height: scale(50),
      bottom: 0,
      left: APP_SCREEN_WIDTH / 2 - moderateScale(65)
    },
    profileImageStyle: {
      width: moderateScale(100),
      height: moderateScale(100),
      borderRadius: moderateScale(50)
    },
    rahhalProfileImageStyle: {
      width: moderateScale(100),
      height: moderateScale(100),
      borderRadius: moderateScale(50),
      borderWidth: 3,
      borderColor: colors.primary
    },
    avatarLabelStyle: { color: colors.white, lineHeight: 65 },
    actionsWrapperStyle: { position: "absolute", top: 0, right: 0, left: 0, zIndex: 99 },
    safeareaViewStyle: { flex: 1 },
    profileImageWrapperStyle: {
      borderWidth: 2,
      borderRadius: 100,
      padding: 6,
      borderColor: colors.white
    },
    iconWrapperStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: scale(30)
    },
    rowWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10
    },
    flexGrow: {
      flex: 1
    },
    bioWrapperStyle: {
      minHeight: APP_SCREEN_HEIGHT / 3,
      paddingHorizontal: 10,
      paddingVertical: verticalScale(15)
    }
  });

export default profileStyles;
