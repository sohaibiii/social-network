import { ImageStyle, StatusBar, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

type style = {
  container: ViewStyle;
  centerItems: ViewStyle;
  unexpandedHeaderStyle: TextStyle;
  usernameStyle: TextStyle;
  countryStyle: TextStyle;
  profileButtonsStyle: ViewStyle;
  buttonsSpacerStyle: ViewStyle;
  followButtonsStyle: ViewStyle;
  noPostsContainer: ViewStyle;
  noPostsText: TextStyle;
  noPostsImage: ImageStyle;
  iconStyle: TextStyle;
  profileImageStyle: ViewStyle;
  flex: ViewStyle;
  changePasswordButton: ViewStyle;
  updateProfileButton: ViewStyle;
  fullHeight: ViewStyle;
  firstNameContainer: ViewStyle;
  lastNameContainer: ViewStyle;
  nameContainer: ViewStyle;
  genderContainer: ViewStyle;
  fieldContainer: ViewStyle;
  bioFieldContainer: ViewStyle;
  whiteLabel: TextStyle;
  changePasswordLabelStyle: TextStyle;
  containerStyle: ViewStyle;
};

const editProfileStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    container: {
      marginHorizontal: scale(8),
      marginTop: verticalScale(20),
      paddingBottom: verticalScale(30),
      alignItems: "center",
      justifyContent: "center"
    },
    centerItems: {
      marginTop: verticalScale(12),
      alignItems: "center"
    },
    unexpandedHeaderStyle: {
      textAlign: "center",
      fontSize: RFValue(18),
      fontWeight: "bold",
      color: "white"
    },
    usernameStyle: {
      color: colors.white,
      fontSize: RFValue(16)
    },
    countryStyle: {
      color: colors.white,
      fontSize: RFValue(12)
    },
    profileButtonsStyle: {
      flexDirection: "row",
      marginTop: verticalScale(25),
      width: "50%",
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
      color: "white"
    },
    noPostsImage: {
      width: scale(200),
      alignSelf: "center"
    },
    iconStyle: {
      marginHorizontal: scale(8)
    },
    profileImageStyle: {
      borderWidth: 3,
      borderColor: colors.text
    },
    changePasswordButton: {
      flex: 1,
      marginVertical: verticalScale(16),
      backgroundColor: colors.surface
    },
    flex: {
      flex: 1
    },
    updateProfileButton: {
      borderRadius: 50,
      marginTop: verticalScale(12),
      width: "100%",
      flex: 1
    },
    fullHeight: { height: "100%" },
    whiteLabel: { color: colors.white },
    firstNameContainer: { flex: 1, marginEnd: scale(4) },
    lastNameContainer: { flex: 1, marginStart: scale(4) },
    nameContainer: { flexDirection: "row", marginTop: 16 },
    fieldContainer: { width: "100%", marginTop: 4 },
    bioFieldContainer: { width: "100%", marginTop: 4, maxHeight: verticalScale(180) },
    genderContainer: { position: "absolute", bottom: 0 },
    changePasswordLabelStyle: {
      color: colors.text,
      fontSize: RFValue(12),
      lineHeight: RFValue(14)
    },
    containerStyle: {
      flex: 1,
      paddingTop: StatusBar?.currentHeight
    }
  });

export default editProfileStyles;
