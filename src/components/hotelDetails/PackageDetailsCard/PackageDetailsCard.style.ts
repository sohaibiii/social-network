import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/";

const packageDetailsCardStyle = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    containerStyle: { marginBottom: verticalScale(8) },
    imageStyle: {
      margin: 8,
      height: verticalScale(130),
      borderRadius: 8
    },
    roomSectionTextStyle: {
      marginTop: verticalScale(4),
      marginBottom: verticalScale(2),
      fontWeight: "bold"
    },
    row: {
      flexDirection: "row"
    },
    flex: {
      flex: 1
    },
    whiteTextStyle: {
      color: "white"
    },
    bookingContainerStyle: {
      width: APP_SCREEN_WIDTH / 3,
      marginBottom: 10,
      marginStart: 10
    },
    bookingStyle: { marginHorizontal: 5, backgroundColor: colors.primary_blue },
    bookingWrapperStyle: {
      backgroundColor: colors.profile.gradient1,
      padding: 5,
      margin: 10,
      alignItems: "center",
      borderRadius: 5
    },
    descriptionStyle: {
      paddingHorizontal: 10
    },
    markdownStyle: { flex: 0 }
  });
export default packageDetailsCardStyle;
