import { StyleSheet, ViewStyle } from "react-native";

import { scale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  backgroundStyle: ViewStyle;
};

const facilitiesCardStyle = (
  colors: ReactNativePaper.ThemeColors,
  cardWidth: number
): style =>
  StyleSheet.create({
    containerStyle: {
      width: cardWidth
    },
    backgroundStyle: {
      borderRadius: 50,
      aspectRatio: 1,
      alignSelf: "center",
      width: scale(50),
      height: scale(50),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e8f5fd"
    }
  });

export default facilitiesCardStyle;
