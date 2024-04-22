import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const myOrderCardStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    cardStyle: { borderRadius: 10 },
    headerWrapperStyle: { flexDirection: "row", padding: 10 },
    mainImageStyle: {
      width: verticalScale(96),
      height: verticalScale(59),
      borderRadius: 4,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.grayBB
    },
    headerTextWrapperStyle: { justifyContent: "space-between", flex: 1 },
    cardContentStyle: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between"
    },
    hotelNameTextStyle: { textTransform: "capitalize" },
    dividerStyle: { marginTop: 15, marginHorizontal: 10, backgroundColor: colors.grayBB },
    cardActionsStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 10
    },
    hotelNameWrapperStyle: { flex: 1 },
    statusTextStyle: { textTransform: "uppercase" },
    statusTextWrapperStyle: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6
    },
    bottomSpacing: {
      paddingBottom: verticalScale(16)
    }
  });

export default myOrderCardStyles;
