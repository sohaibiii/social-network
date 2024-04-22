import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

type style = {
  image: ImageStyle;
  icon: TextStyle;
  progressiveImage: ViewStyle;
};

const userProfileImageStyle = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    image: {
      backgroundColor: colors.lightishGray,
      borderRadius: 100
    },
    icon: {
      color: colors.primary
    },
    progressiveImage: {
      borderRadius: 100
    }
  });

export default userProfileImageStyle;
