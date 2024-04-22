import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/variables";
import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

const addReviewModalStyles = (
  colors: ReactNativePaper.ThemeColors,
  selectedImagesLength?: number,
  withStars?: boolean
) =>
  StyleSheet.create({
    root: { padding: 20, height: APP_SCREEN_HEIGHT },
    ratingStyle: { marginVertical: moderateScale(15) },
    textAreaStyle: {
      height: APP_SCREEN_HEIGHT / 2.3,
      marginBottom: 5
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: verticalScale(20),
      justifyContent: "space-between",
      marginBottom: !withStars ? 20 : 0
    },
    buttonStyle: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 25,
      paddingVertical: 5
    },
    imagesContainerStyle: {
      height: moderateScale(selectedImagesLength ? 180 : 50),
      marginBottom: 5
    },
    titleHeader: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      width: "100%"
    },
    closeIconStyle: {
      zIndex: 2
    },
    remainingTextImagesStyle: { marginTop: 15, marginBottom: -10 },
    titleStyle: { width: "40%" }
  });

export default addReviewModalStyles;
