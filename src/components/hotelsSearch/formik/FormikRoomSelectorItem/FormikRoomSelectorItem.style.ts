import { StyleSheet, ViewStyle } from "react-native";

import { verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  roomHeaderStyle: ViewStyle;
  row: ViewStyle;
  incrementalStyle: ViewStyle;
  childrenContainerStyle: ViewStyle;
};
const formikRoomSelectorItemStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      backgroundColor: colors.grayBackground,
      borderWidth: 1,
      borderColor: colors.grayEE,
      borderRadius: 10,
      margin: 10,
      padding: 10
    },
    roomHeaderStyle: {
      flexDirection: "row",
      marginBottom: 8,
      alignItems: "center",
      justifyContent: "space-between"
    },
    incrementalStyle: {
      marginBottom: verticalScale(8)
    },
    row: { flexDirection: "row" },
    childrenContainerStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start"
    }
  });

export default formikRoomSelectorItemStyles;
