import { StyleSheet } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";

import { scale, verticalScale } from "~/utils/";

const roomSelectorContentStyle = (
  colors: ReactNativePaper.ThemeColors,
  insets: EdgeInsets
) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center"
    },
    addRoomStyle: {
      alignSelf: "flex-end",
      marginHorizontal: 20,
      flexDirection: "row",
      alignItems: "center"
    },
    confirmTextStyle: {
      color: colors.white
    },
    buttonsContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      marginHorizontal: scale(8)
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginTop: verticalScale(5),
      marginBottom: verticalScale(5) + insets.bottom,
      backgroundColor: colors.primary_blue
    }
  });

export default roomSelectorContentStyle;
