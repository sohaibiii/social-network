import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale, moderateScale } from "~/utils/";

const nearbyUsersStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    modalRoot: {
      marginTop: 15
    },
    modalButtonStyle: {
      width: scale(250),
      alignSelf: "center",
      borderRadius: 20,
      marginTop: 20,
      marginBottom: 20
    },
    modalButtonLabelStyle: { color: colors.white },
    radioButtonLabelStyle: {
      fontSize: RFValue(15)
    },
    footerContainer: {
      position: "absolute",
      bottom: scale(15),
      width: "100%",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5
    },
    mapContainer: {
      alignSelf: "center",
      marginTop: scale(75),
      borderRadius: scale(320),
      width: scale(320),
      height: moderateScale(280),
      alignItems: "center",
      justifyContent: "center"
    },
    firstGridStyle: {
      position: "absolute",
      alignSelf: "center",
      marginTop: scale(100),
      borderRadius: scale(320),
      width: scale(320),
      height: moderateScale(326),
      borderColor: colors.primary,
      borderWidth: scale(35),
      opacity: 0.3,
      alignItems: "center",
      justifyContent: "center"
    },
    secondGridStyle: {
      position: "absolute",
      alignSelf: "center",
      marginTop: scale(100),
      borderRadius: scale(320),
      width: scale(250),
      height: moderateScale(253),
      borderColor: colors.primary,
      borderWidth: scale(40),
      opacity: 0.5,
      alignItems: "center",
      justifyContent: "center"
    },
    thirdGridStyle: {
      position: "absolute",
      alignSelf: "center",
      marginTop: scale(100),
      borderRadius: scale(320),
      width: scale(170),
      height: moderateScale(170),
      borderColor: colors.primary,
      borderWidth: scale(35),
      opacity: 0.7,
      alignItems: "center",
      justifyContent: "center"
    },
    fourthGridStyle: {
      position: "absolute",
      alignSelf: "center",
      marginTop: scale(100),
      borderRadius: scale(320),
      width: scale(100),
      height: moderateScale(100),
      borderColor: colors.primary,
      borderWidth: scale(50),
      alignItems: "center",
      justifyContent: "center"
    },
    fifthGridStyle: {
      marginTop: moderateScale(-5),
      width: scale(30),
      height: moderateScale(30),
      alignItems: "center",
      justifyContent: "center"
    },
    gridViewContainer: { paddingBottom: 50 },
    userCardRoot: {
      flex: 1,
      backgroundColor: colors.lightBackground,
      borderRadius: scale(10),
      padding: scale(10),
      width: "90%",
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",

      elevation: 5
    },
    nearUserCardRoot: {
      backgroundColor: colors.lightBackground,
      width: "47%",
      marginVertical: 5,
      padding: 15,
      borderRadius: 10
    },
    columnWrapperStyle: {
      justifyContent: "space-around"
    },
    alignSelfCenter: {
      alignSelf: "center"
    },
    userCardImage: {
      marginTop: verticalScale(-5),
      width: scale(60),
      height: scale(60),
      alignItems: "center",
      justifyContent: "center"
    },
    userNearCardContainer: { justifyContent: "center", alignItems: "center" },
    userCardContainer: { flex: 1, width: scale(290), marginStart: scale(20) },
    userCardButtonStyle: {
      width: scale(200),
      borderRadius: 5,
      height: 35,
      marginTop: 5,
      paddingBottom: 5,
      paddingTop: 4
    },
    userCardButtonLabelStyle: { color: colors.white },
    toggleViewContainer: {
      backgroundColor: colors.white,
      alignItems: "center",
      justifyContent: "space-between",
      width: scale(90),
      borderRadius: scale(20),
      flexDirection: "row",
      alignSelf: "center",
      marginBottom: verticalScale(10),
      marginTop: 10,

      elevation: 5
    },
    userCardButtonIconStyle: {
      alignItems: "center",
      justifyContent: "center",
      width: scale(45),
      borderRadius: scale(20),
      height: scale(35)
    }
  });

export default nearbyUsersStyles;
