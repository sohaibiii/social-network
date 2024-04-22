import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

const showHotelDetailsButtonStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    showBookingDetailsButton: {
      bottom: 28,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.white,
      paddingVertical: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.bottomSheetOverlay,
      zIndex: 10,
      right: 10,
      alignSelf: "flex-end"
    },
    bookingDetailsHeaderText: {
      marginEnd: scale(8)
    },
    flexShrink: {
      flexShrink: 1,
      textAlign: "left",
      fontSize: RFValue(13)
    },
    sectionStyle: {
      marginTop: verticalScale(8),
      flexDirection: "row"
    },
    iconStyle: {
      marginHorizontal: scale(8),
      paddingBottom: verticalScale(8)
    }
  });

export default showHotelDetailsButtonStyles;
