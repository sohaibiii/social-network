import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const styles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    safeareaViewStyle: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      paddingHorizontal: 10
    },
    headerIconStyle: {
      width: "100%",
      height: verticalScale(120)
    },
    topParagraphStyle: { marginTop: verticalScale(30), marginBottom: verticalScale(18) },
    middleParagraphStyle: { marginBottom: 10 },
    bottomParagraphStyle: { marginBottom: verticalScale(20) },
    whiteLabel: {
      color: colors.white
    },
    sectionStyle: {
      marginTop: verticalScale(20),
      flexDirection: "row",
      marginStart: scale(12),
      marginEnd: scale(6),
      flex: 1,
      backgroundColor: colors.primary_blue
    },
    mainPageBtn: {
      marginTop: verticalScale(20),
      flexDirection: "row",
      marginEnd: scale(12),
      marginStart: scale(6),
      flex: 1,
      backgroundColor: colors.white,
      borderColor: colors.primary_blue
    },
    mainPageBtnLabel: {
      color: colors.primary_blue
    },
    bottomWrapperStyle: { flexDirection: "row", alignItems: "center" }
  });
export default styles;
