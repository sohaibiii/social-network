import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const myOrderDetailsStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    safeAreaViewStyle: { flex: 1 },
    contentContainerStyle: { paddingHorizontal: 20 },
    sectionWrapperStyle: { marginTop: verticalScale(20) },
    headerIconStyle: { marginRight: 10 },
    infoSectionWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: scale(20),
      marginVertical: 10
    },
    infoSectionLabel: { marginRight: 5 },
    ratingStyle: { marginLeft: 10 },
    wrappedTextStyle: { flex: 1, flexWrap: "wrap" },
    miniIconStyle: { marginRight: 5 },
    cityCountryTextStyle: { textTransform: "capitalize", marginTop: 5 },
    wrapperStyle: { flexDirection: "row", alignItems: "center" },
    imageStyle: { height: verticalScale(250) },
    actionWrapperStyle: { flexDirection: "row", justifyContent: "space-evenly" },
    cancelBtnStyle: {
      flex: 1,
      marginHorizontal: scale(15),
      borderWidth: 1,
      borderColor: colors.danger_red
    },
    viewReceiptStyle: { flex: 1, marginHorizontal: scale(15) },
    receiptsModalStyle: {
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 10
    },
    receiptsModalTitleStyle: {
      textAlign: "center",
      paddingBottom: 8
    }
  });

export default myOrderDetailsStyles;
