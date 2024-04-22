import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const styles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    filtersContainer: {
      flexDirection: "row",
      marginVertical: verticalScale(6)
    },
    iconStyle: {
      marginHorizontal: scale(4)
    },
    whiteLabel: {
      color: colors.white
    },
    calendarButtonStyle: {
      flex: 1,
      marginHorizontal: scale(10),
      marginVertical: verticalScale(10)
    },
    buttonContainerStyle: {
      flexDirection: "row",
      marginTop: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: scale(8)
    },
    iconTextContainer: {
      backgroundColor: colors.surface,
      // io
      shadowOpacity: 0.2,
      shadowRadius: scale(2),
      shadowOffset: {
        height: 0,
        width: 0
      },
      // android
      elevation: 2,
      paddingVertical: 10,
      paddingHorizontal: 8,
      marginStart: 8,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    iconTextWithFlexContainer: {
      backgroundColor: colors.surface,
      // io
      shadowOpacity: 0.2,
      shadowRadius: scale(2),
      shadowOffset: {
        height: 0,
        width: 0
      },
      // android
      elevation: 2,
      flex: 1,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    }
  });

export default styles;
