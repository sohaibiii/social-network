import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { EdgeInsets } from "react-native-safe-area-context";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const style = (colors: ReactNativePaper.ThemeColors, insets: EdgeInsets) =>
  StyleSheet.create({
    containerStyle: {
      paddingTop: insets.top,
      flex: 1,
      backgroundColor: colors.lightBackground
    },
    lineHeight: { lineHeight: RFValue(24) },
    headerStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    backButtonStyle: { position: "relative", top: 0 },
    actionsStyle: { flexDirection: "row", marginEnd: scale(16) },
    deleteButtonStyle: { marginStart: 6 },
    scrollViewStyle: { flex: 1 },
    contentContainerStyle: { paddingBottom: insets.bottom + verticalScale(20) },
    titleContainerStyle: { paddingHorizontal: 10 },
    spacingStyle: { width: 10 },
    typeContainerStyle: {
      borderRadius: 10,
      paddingHorizontal: 5,
      justifyContent: "center",
      backgroundColor: colors.lightGray
    },
    typeTextStyle: {
      paddingHorizontal: 2,
      textTransform: "capitalize"
    },
    senderContainerStyle: {
      marginVertical: verticalScale(8),
      flexDirection: "row",
      alignItems: "center"
    },
    senderTextStyle: { marginStart: 10 },
    senderSpacing: { width: 10 },
    descriptionStyle: { paddingHorizontal: 10 },
    loaderWrapperStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });
export default style;
