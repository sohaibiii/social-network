import { StyleSheet } from "react-native";

import { moderateScale, verticalScale } from "~/utils/";

const variationDetailsCardStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: {
      marginBottom: 10,
      padding: 12
    },
    imageStyle: {
      height: moderateScale(80),
      width: moderateScale(80),
      marginEnd: 10,
      borderRadius: 10
    },
    row: {
      flexDirection: "row"
    },
    rowAlignItemsCenter: {
      flexDirection: "row",
      alignItems: "center"
    },
    flex: {
      flex: 1
    },
    iconStyle: {
      marginStart: 2
    },
    priceTextStyle: {
      fontWeight: "bold",
      alignSelf: "flex-end",
      marginTop: 10
    },
    priceInfoTextStyle: {
      fontWeight: "bold",
      alignSelf: "flex-end"
    },
    buttonsContainerStyle: {
      flexDirection: "row-reverse",
      width: "100%"
    },
    bookButtonContainerStyle: {
      flexDirection: "row",
      alignSelf: "flex-end",
      marginTop: verticalScale(8),
      justifyContent: "flex-end"
    },
    whiteTextStyle: {
      color: "white"
    },
    bookButtonStyle: {
      paddingHorizontal: 0,
      backgroundColor: colors.primary_blue
    },
    showDescriptionContainerStyle: {
      justifyContent: "center",
      flex: 1
    },
    galleryIconStyle: {
      backgroundColor: "rgba(0,0,0,0.4)",
      padding: 5,
      borderRadius: 5,
      position: "absolute",
      left: 6,
      top: 4
    },
    variantTextStyle: {
      marginBottom: 10,
      marginTop: 4
    },
    iconsContainerStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between"
    }
  });

export default variationDetailsCardStyle;
