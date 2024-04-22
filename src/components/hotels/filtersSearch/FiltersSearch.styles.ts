import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/";

const filtersSearchStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap"
    },
    contentContainerStyle: {
      height: "100%",
      marginHorizontal: scale(16),
      flexDirection: "column",
      justifyContent: "flex-start"
    },
    hotelStyle: {
      paddingVertical: verticalScale(10),
      borderBottomWidth: 1,
      borderColor: colors.grayBB
    }
  });

export default filtersSearchStyles;
