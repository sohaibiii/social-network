import { StyleSheet } from "react-native";

import color from "color";

import { scale, verticalScale } from "~/utils/";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    mapWrapperStyle: {
      marginTop: verticalScale(10)
    },
    routeIconStyle: { marginRight: 5 },
    rowWrapperStyle: {
      flexDirection: "row",
      alignItems: "center"
    },
    addressRowWrapperStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: scale(30),
      justifyContent: "flex-start"
    },
    iconWrapperStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: scale(30)
    },
    dividerStyle: {
      backgroundColor: color("#000").alpha(0.15).rgb().string(),
      marginHorizontal: scale(10)
    },
    getDirectionWrapperStyle: {
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
      borderRadius: 2,
      backgroundColor: theme.colors.homepageItemText,
      marginHorizontal: scale(4),
      marginTop: verticalScale(4),
      marginBottom: verticalScale(12)
    },
    getDirectionIconStyleAr: { transform: [{ rotateY: "180deg" }], marginEnd: 6 },
    getDirectionIconStyle: { marginEnd: 6 },
    mapContainerStyle: {
      borderRadius: 0,
      marginHorizontal: 0,
      height: verticalScale(90)
    }
  });

export default styles;
