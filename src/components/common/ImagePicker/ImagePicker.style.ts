import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import { verticalScale, scale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  actionSheetContainer: ViewStyle;
  imagesContainer: ViewStyle;
  row: ViewStyle;
  optionText: TextStyle;
  directionStyle: ViewStyle;
};

const imagePickerStyle = (
  colors: ReactNativePaper.ThemeColors,
  fullWidth?: boolean
): style =>
  StyleSheet.create({
    containerStyle: {
      minHeight: verticalScale(500),
      width: "100%",
      paddingTop: verticalScale(16),
      alignItems: "center"
    },
    actionSheetContainer: {
      alignSelf: "flex-start",
      width: "100%"
    },
    imagesContainer: {
      marginStart: fullWidth ? 0 : scale(16),
      marginTop: verticalScale(8),
      flexDirection: "row",
      flexWrap: "wrap"
    },
    row: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.gray,
      marginHorizontal: fullWidth ? 2 : scale(16),
      paddingHorizontal: scale(5),
      paddingVertical: verticalScale(8),
      marginBottom: verticalScale(12),
      flexDirection: "row",
      alignItems: "center"
    },
    optionText: {
      color: colors.grayReversed,
      marginStart: scale(10),
      fontSize: RFValue(14),
      lineHeight: RFValue(16)
    },
    directionStyle: { flexDirection: fullWidth ? "row" : "column" }
  });

export default imagePickerStyle;
